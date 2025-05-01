const { get } = require('ajax');
var express = require('express');
var jwt = require('jwt-simple');
var secret = 'SuperSecretKey'; // Replace with your secret key
var bcrypt = require('bcrypt'); // Add bcrypt for password hashing
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(url);
const ONLYLETTERSPATTERN = /^[A-Za-z]+$/;

router.get("/dex", async (req,res) => {
    const data = await getOne(req.query.ID);
    res.render("specific", { d: data[0] });
});

router.get("/", function(req, res) {
    res.render("hello", { title: 'Pokemon', teambuilder: false});
});

router.get("/teambuilder", function(req, res) {
    res.render("hello", { title: 'Pokemon', teambuilder: true});
});

router.post('/search', async (req, res) => {
  const { sort, limit, order, search, filter, teambuilder} = req.body;
  const data = await getData(sort,Number(limit), Number(order), search, Number(filter));
  console.log(teambuilder);
  if (Number(teambuilder) === 1) {
    res.render('teams_visual', { data: data});
  } else {
    res.render('poke_visual', { data: data});
  }
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { error: null }); // Pass error as null initially
});

router.post('/signup', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match' }); // Pass error message
    
    }
    if(!username.match(ONLYLETTERSPATTERN)){
        return res.render('signup', { error: "Only letters in username"});
    }
    
    let check = await checkUser(username);

    if (check.length > 0) {
        return res.render('signup', { error: 'Username already taken' }); // Pass error message
    } else {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        createUser(username, hashedPassword);
        res.redirect('/login');
    }    
});

router.get('/login', function(req, res) {
    res.render('login', { error: null }); // Pass error as null initially
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if(!username.match(ONLYLETTERSPATTERN)){
        return res.render('signup', { error: "Only letters in username"});
    }

    let result = await checkUser(username);
    // Check if the user exists

    if (result.length > 0) {
        const user = result[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) throw err;

            if (match) {
                const token = jwt.encode({username: user}, secret);
                res.json({ token: token });
            }
        });
    }
});

router.get("/status", async function(req, res) {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const token = req.headers["x-auth"];
        
        const decoded = jwt.decode(token, secret);
        const user = await checkUser(decoded.username.username);

        if (user.length > 0) {
            res.json({ status: "ok", user: user[0] });
        } else {
            res.status(401).json({ error: "Invalid token" });
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

router.get("/trainer", async function(req, res) {
    res.render("trainer");
});

router.post("/addToTeam", async function(req, res) {
    const { pid1, pid2, pid3, pid4, pid5, pid6, user, teamName } = req.body;
    console.log(req.body);
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('users');
        const filter = { username: user };
        const newTeam = {
            teamName: teamName,
            poke: [
                Number(pid1),
                Number(pid2),
                Number(pid3),
                Number(pid4),
                Number(pid5),
                Number(pid6)
            ]
        };
        const update = { $push: { teams: newTeam } };
        console.log(filter);
        console.log(update);
        await collection.updateOne(filter,update);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
});

router.post('/getTeams', async (req, res) => {
    const { user } = req.body;
    const vals = await checkUser(user);
    const team = vals[0].teams;
    const values = [];
    if(!(team==undefined)) {
        for (let i = 0; i < team.length; i++) {
            let val = await getFromPids(team[i].poke);
            values.push(val);
        }
        console.log("Team!")
    }
    return res.render('poke_team', { data: values });
});


async function checkUser(user) {
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('users');
        const data = await collection.find({username: user}).limit(1).toArray(); // FindOne wont work for some reason
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function createUser(user, pass) {
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('users');
        const obj = {
            username: user,
            password: pass,
            teams: [],
        }
        await collection.insertOne(obj); // FindOne wont work for some reason
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function getOne(pid_val) {
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('pokedex');
        const data = await collection.find({pid: Number(pid_val)}).limit(1).toArray(); // FindOne wont work for some reason
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function getData(sort, limit, order, search, filter) { try {
        await client.connect();
        const collection = client.db('pokemon').collection('pokedex');
        const options = {
            projection: {
                _id: 0,
                pid: 1,
                Name: 1,
                Types: 1,
            }
        }
        let searchQuery = {};
        if (search != "" && search != null) {
            searchQuery.Name = { $regex: search + '.*', $options: 'i' };
        }
        if (filter > 0) {
            let f = [];
            getTypes(filter).forEach((type) => {
                f.push({ "Types": type });
            });
            searchQuery["$or"] = f;
        }
        const data = await collection.find(searchQuery,options).sort({[sort]: order}).limit(limit).toArray();
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function getFromPids(pids) {
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('pokedex');
        const options = {
            projection: {
                _id: 0,
                pid: 1,
                Name: 1,
                Types: 1,
            }
        }
        let searchQuery = {};
        let f = [];
        pids.forEach((pid) => {
            f.push({ "pid": Number(pid) });
        });
        searchQuery["$or"] = f;
        const data = await collection.find(searchQuery,options).toArray();
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}


function getTypes(filter) {
    let types = {
        1: "Normal",
        2: "Fighting",
        3: "Flying",
        4: "Poison",
        5: "Ground",
        6: "Rock",
        7: "Bug",
        8: "Ghost",
        9: "Steel",
        10: "Fire",
        11: "Water",
        12: "Grass",
        13: "Electric",
        14: "Psychic",
        15: "Ice",
        16: "Dragon",
        17: "Dark",
        18: "Fairy"
    };
    let ret = [];
    let i = 1;
    while (filter > 0) {
        if (filter % 2 == 1) {
            ret.push(types[i]);
        }
        filter = Math.floor(filter / 2);
        i++;
    }
    return ret;
}

module.exports = router;
