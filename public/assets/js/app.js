$(document).ready(function() 
{

  /*$.getJSON("/articles", function(data)
  {
    for (var i = 0; i < data.length; i++) 
    {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });*/

  $("#getNews").on("click", function() 
  {
    console.log("#getNews");
    // this should be /scrape
    // get the content from a website
    // check to see if a matching headline already exists in DB
    // if not add it to DB
  });

  $(document).on("click", ".article-data", function() 
  {
    var articleID = $(this).attr("data-article-id");
    window.location.href = "/article/" + articleID;

    // article p tag needs defined class,
    // then if anything of that class is clicked...
    // go to a page for the speciic article
    // headline
    // link
    // date
    // writer
    // summary
    // display all comments

    /*$("#notes").empty();

    var thisId = $(this).attr("data-id");

    $.ajax(
    {
      method: "GET",
      url: "/articles/" + thisId
    })
    .then(function(data) 
    {
      console.log(data);
      
      $("#notes").append("<h2>" + data.title + "</h2>");
      
      $("#notes").append("<input id='titleinput' name='title' >");
  
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) 
      {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });*/
  });

  /*$(document).on("click", "#savenote", function()
  {
    // user has textbox to enter comment
    // then click #savenote button to store comment in DB

    var thisId = $(this).attr("data-id");

    $.ajax(
    {
      method: "POST",
      url: "/articles/" + thisId,
      data: 
      {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) 
    {
      console.log(data);
      $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
  });*/

  $( "#new-note-submit" ).click(function(event)
  //$("#new-note-submit").on("click", function(event)
  {
    event.preventDefault();
    var newNote = $("#user-added-note").val().trim();
    var articleID = $("#wrapper").attr("data-article-id");

    alert("new note = " + newNote);

    if(newNote.length >= 2)
    {
      $.ajax(
      {
        method: "POST",
        url: "/article/" + articleID,
        data: 
        {
          body: newNote
        }
      }).then(function(data) 
      {
        //console.log(data);//
        //$("#notes").empty();
        // location.reload();
      });
    }
  });

});
