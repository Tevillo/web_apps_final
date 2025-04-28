const { get } = require('ajax');
var express = require('express');
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(url);

router.get("/dex", async (req,res) => {
    const data = await getOne(req.query.ID);
    console.log(data);
    res.render("specific", { data: data[0] });
});

router.get("/", function(req, res) {
    res.render("hello", { title: 'Pokemon'});
});

router.post('/search', async (req, res) => {
  console.log("ajax request received");  
  console.log(req.body);
  const { sort, limit, order, search, filter} = req.body;
  const data = await getData(sort,Number(limit), Number(order), search, Number(filter));
  console.log(data);
  res.render('poke_visual', { data: data});
});

async function getOne(pid_val) {
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('pokedex');
        const look = {
            pid: pid_val
        }
        console.log("pid val: " + pid_val);
        const data = await collection.find({pid: Number(pid_val)}).limit(1).toArray(); // FindOne wont work for some reason
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function getData(sort, limit, order, search, filter) {
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
        if (search != "" && search != null) {
            searchQuery.Name = { $regex: search + '.*', $options: 'i' };
        }
        if (filter > 0) {
            let f = [];
            getTypes(filter).forEach((type) => {
                console.log(type);
                f.push({ "Types": type });
            });
            searchQuery["$or"] = f;
        }
        console.log("search Query: " + searchQuery);
        const data = await collection.find(searchQuery,options).sort({[sort]: order}).limit(limit).toArray();
        console.log(data);
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