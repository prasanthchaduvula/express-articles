// require to use  npm packages
var express = require("express");
var mongoose = require("mongoose");
var Article = require("./models/article")

// mongose to connect to mongo db
mongoose.connect('mongodb://localhost/sample', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
  console.log('Connected', err ? false : true);
});
mongoose.set('useCreateIndex', true);



// intialising express app
var app = express();

// models set
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// routes
app.get("/",(req,res) => {
    res.render("index")
})

// get artilces 
app.get("/articles", (req, res) => {
    Article.find((err, artilesList) => {
      res.render("articles", {artilesList: artilesList})
    })
  })

// rendering create a article form
app.get("/articles/create",(req,res) => {
    res.render("createArticle")
})


// creating a article
app.post("/articles", (req, res) => {
    Article.create(req.body, (err, createdArticle) => {
      console.log(err, createdArticle);
      if(err) return res.json({err});
      res.redirect("/articles")
    })
  });


// Get Single article
app.get("/articles/:id", (req, res) => {
    Article.findById(req.params.id, (err, singleArticle) => {
      res.render('singleArticle', {article: singleArticle});
    })
  });
  

// edit article form
app.get("/articles/:id/edit", (req,res) => {
    Article.findById(req.params.id, (err,article) => {
        if(err) return res.json({err});
        res.render("editarticle",{article: article})
    })
})

// edit article 
app.post("/articles/:id", (req,res) => {
    Article.findByIdAndUpdate(req.params.id, req.body, (err,updatedArticle) => {
        if(err) return res.json({err});
        res.redirect("/articles/" + updatedArticle.id)
    })
})


// deleting article
app.get("/articles/:id/delete", (req,res) => {
    Article.findByIdAndDelete(req.params.id, (err,article) => {
        if(err) return res.json({err});
        res.redirect("/articles")
    })
})


// 404 handler
app.use((req, res, next) => {
    res.status(404).send('Page Not found');
  })

// server listner
app.listen(3000, () => {
    console.log("server runs at 3000")
})