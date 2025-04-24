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
  const { sort, limit, order } = req.body;
  const data = await getData(sort,Number(limit), Number(order));
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

async function getData(sort, limit, order) {
    try {
        await client.connect();
        const collection = client.db('pokemon').collection('pokedex');
        const options = {
            projection: {
                _id: 0,
                pid: 1,
                Name: 1,
                Type_1: 1,
                Type_2: 1,
            }
        }
        const data = await collection.find({},options).sort({[sort]: order}).limit(limit).toArray();
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

module.exports = router;