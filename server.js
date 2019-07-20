var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/rNewsScraper", { useNewUrlParser: true });

app.get("/", function(req, res) 
{
  db.Article.find({}).then(function(dbArticles) 
  {
    res.render("index", {
      article: dbArticles
    });
  }).catch(function(err) {
    res.json(err);
  });
});


app.get("/scrape", function(req, res) 
{
  // when should this happen?
  // every time page is loaded, or when user clicks button?
  axios.get("https://old.reddit.com/r/news/").then(function(response) {

    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("a.title").each(function(i, element) {
      // Save an empty result object
      var result = {};

      //console.log("---------------------------------------");
      //console.log("title: " + $(this).text());
      //console.log("link: " + $(this).attr("href"));
      //console.log("---------------------------------------");

      
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = $(this).attr("href");

      db.Article.findOne({title: result.title}).then(function(dbArticle){
        //console.log("---------------------------------------");
        
        if(dbArticle === null)
        {
          //console.log("scrape article NOT NULL 2");
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result).then(function(dbArticle)
          {
            //console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
        }
        //console.log("scrape article found: ", dbArticle);
        //console.log("---------------------------------------");

      }).catch(function(err) {
        console.log(err);
      });

    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
/*app.get("/articles", function(req, res) 
{
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});*/



// Route for saving/updating an Article's associated Note
app.post("/article/:id", function(req, res) 
{
  //console.log("----------------------------------");
  //console.log("req.body:", req.body);
  //console.log("----------------------------------");
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body).then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) 
    {
      // If we were able to successfully update an Article, send it back to the client

      // res.json(dbArticle);

      //console.log("----------------------------------");
      //console.log("Matching Article:", dbArticle);
      //console.log("----------------------------------");

      // find notes for article

      //db.Article.find({}).then(function(dbArticle) {



      res.render("article", {
        article: dbArticle
      });


    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/article/:id", function(req, res) 
{
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note").then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      // res.json(dbArticle);

      console.log("------------------------------------------");
      console.log("num of articles: " + dbArticle.length);
      console.log("dbArticle", dbArticle);
      console.log("------------------------------------------");

      res.render("article", {
        article: dbArticle
      });

    }).catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() 
{
  console.log("App running on port " + PORT + "!");
});
