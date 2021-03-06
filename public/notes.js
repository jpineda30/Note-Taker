      
// Asign elements
// =============================================================
const $saveNoteBtn = $(".save-note");
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// functions
// =============================================================     
var handleNoteSave = function () {

  if($noteTitle.val() != ""){
    const newNote = {
      title: $noteTitle.val(),
      text: $noteText.val(),
      id:"",
      active:true,
    };
      saveNote(newNote).then(() => {
  
          
        getAndRenderNotes();
      //getAndRenderNotes();
      //renderActiveNote();
    });
  }
  else
  {alert("Empty title");}

  
};

//click on a note
function focus(obj){
  let id = obj.id;
  if(id != "")
  {
    getNotes().then(function(response){


        var active = JSON.parse(response).filter(function(save){
          return save.id == id;
        })

        $saveNoteBtn.hide();


        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(active[0].title);
        $noteText.val(active[0].text);
        console.log(active);
        });

  }
      
  
}

//click on delete
function removeS(obj){

  let id = obj.id;
  let currentObj = {
    "id":id
  }
  remove(currentObj).then(function(res){
    
    $noteList.empty();
    renderNoteList(res);
    //getAndRenderNotes();
    

    
  });

    
}

var saveNote = (note) => {
    return $.ajax({
      url: "/api/notes",
      data: note,
      method: "POST",
    });
};


var remove = (note) => {
    return $.ajax({
      url: "/api/delete",
      data: note,
      method: "DELETE",
    });
  };

// Render's the list of note titles
var renderNoteList = (notes) => {
    $noteList.empty();

    var noteListItems = [];

    // Returns jquery object for li with given text and delete button
    // unless withDeleteButton argument is provided as false
    var create$li = (text, withDeleteButton = true) => {
      var $li = $("<li class='list-group-item' id=''>");
      var $span = $("<span>").text(text);
        $li.on("click",function(event){
          
          if(event.target.nodeName == "I"){
              removeS(this);
          }else{
            focus(this);
          }
          
        });
      $li.append($span);

      if (withDeleteButton) {
        var $delBtn = $(
          "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );
        
        $li.append($delBtn);
      }
      return $li;
    };

    if (notes.length === 0) {
      noteListItems.push(create$li("No saved Notes", false));
    }
    
    notes.forEach((note) => {
      var $li = create$li(note.title).data(note);
     
      $li[0].id = note.id;
     
      noteListItems.push($li);
    });

$noteList.append(noteListItems);
clearNote();
};  

var getNotes = () => {

  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });

};

var getAndRenderNotes = () => {

  getNotes().then(function(response){
    
    var Parsed = JSON.parse(response);
    renderNoteList(Parsed);

  });
};

function clearNote(){
  $noteTitle.attr("readonly", false);
  $noteText.attr("readonly", false);
  $noteTitle.val("");
  $noteText.val("");
}  

// events
// ===========================================================
$(".new-note").on("click",function(){
  clearNote();
  $saveNoteBtn.show();
});
$saveNoteBtn.on("click", function(){
  
  handleNoteSave();
});

$noteTitle.on("keyup", function(){
  handleRenderSaveBtn();
});
$noteText.on("keyup", function(){
  handleRenderSaveBtn();
});

//button save logic


var handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

getAndRenderNotes();
  