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
app.use(express.static(__dirname + '/public'));
// Routes
// =============================================================

// Basic routes
// =============================================================
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// Routes
// =============================================================

//save note return new array
app.post("/api/notes",function(req,res){

        let base = require("./db.json");
        let index = base.length;
        let add = req.body;
        add.id = index;
        base.push(add);
        
        const myWriteFunction = async (filename) => {
          await fs.writeFile(__dirname + '/db.json', JSON.stringify(filename),function (error, data) {
            if (error) {
              return error
            }
            console.log("Saved!")
        })
        }


        let count =0;

        var saveBase = base.map(function(element){
          count++;
          element.id = count;
          return element;
        });
      
        myWriteFunction(saveBase);
        console.log("POST",saveBase);
        
    res.json(saveBase);     
});

//get all notes
app.get("/api/notes", function(req, res) {

  var refresh = require("./db.json");
 
  res.send(refresh);

});


//delete notes
app.delete("/api/delete",function(req,res){
  var base = require("./db.json");
  var add = req.body;
  var newBase = base.filter(function(element){
      return element.id != add.id;
  });
  
  
  let count =0;
  var saveBase = newBase.map(function(element){
    count++;
    element.id = count;
    return element;
  });
 
  const myWriteFunction = async (filename) => {
    await fs.writeFile(__dirname + '/db.json', JSON.stringify(filename),function (error, data) {
      if (error) {
        return error
      }
      console.log("Saved!")
  })
  }

  myWriteFunction(saveBase);

 /* fs.writeFileSync(__dirname + '/db.json', JSON.stringify(newBase) ,function (error, data) {
      if (error) {
        return error
      }
      console.log("Saved!")
  });*/

  res.json(newBase);     
})


// Starts the server to begin listening
// ============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
