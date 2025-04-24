const express = require("express");
const app = express();

var indexRouter = require('./routes/index');

app.set("views", "views");
app.set("view engine", "pug");

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({extended: false })); //middleware

app.use('/', indexRouter);

app.post("/trainer", function(req, res) {
    res.render("trainer", {trainerName:req.body.name});
});

// Serve static files from the public dir
app.use(express.static("public"));

// Start the web server
app.listen(3010, function() {
   console.log("Listening on port 3010...");
});