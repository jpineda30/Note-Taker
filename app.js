// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

var fs = require("fs");
const { json } = require("express");
const { parse } = require("path");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT  || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

///api/notes
app.post("/api/notes",function(req,res){
        var base = require("./db.json");
        var index = base.length;
        var add = req.body;
        add.id = index;
        base.push(add);
        console.log(base);
        
        fs.writeFileSync(__dirname + '/db.json', JSON.stringify(base) ,function (error, data) {
            if (error) {
              return error
            }
            console.log("Saved!")
        });
        
    res.json(base);     
});

//get
app.get("/api/notes", function(req, res) {

  var base = require("./db.json");
  console.log("Get data");
  console.log(base);
  res.send(base);

});




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


app.post("/api/delete",function(req,res){
  var base = require("./db.json");
  var add = req.body;
  var newBase = base.filter(function(element){
      return element.id != add.id;
  });
  
  console.log(newBase);
  let count =0;
  var saveBase = newBase.map(function(element){
    count++;
    element.id = count;
    return element;
  });
  console.log(saveBase);
  
  fs.writeFileSync(__dirname + '/db.json', JSON.stringify(newBase) ,function (error, data) {
      if (error) {
        return error
      }
      console.log("Saved!")
  });
  
res.json(base);     
});