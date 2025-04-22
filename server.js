const express = require("express");
const app = express();

app.set("views", "views");
app.set("view engine", "pug");
app.get("/", function(req, res) {
    res.render("hello");
});

app.get("/bulbasaur.html", function(req, res) {
    res.render("bulbasaur");
});

app.get("/charmander.html", function(req, res) {
    res.render("charmander");
});

app.get("/squirtle.html", function(req, res) {
    res.render("squirtle");
});

app.use(express.urlencoded({extended: false})); //middleware

app.post("/trainer", function(req, res) {
    res.render("trainer", {trainerName:req.body.name});
});

// Serve static files from the public dir
app.use(express.static("public"));

// Start the web server
app.listen(3010, function() {
   console.log("Listening on port 3010...");
});