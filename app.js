const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(express.static('public'));

// main code  👇 

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});
const Article = new mongoose.model("Article", articleSchema);

///////////////////////// Requests Targeting all Articles /////////////////////////////

app.route("/articles")

    .get(function(req,res){
        
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            }
            else{
                res.send(err);
            }
        });
    })

    .post(function(req,res){

        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("successfully added a new article")
            }else{
                res.send(err);
            }
        });
    })

    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("successfully deleted from DB");
            }else{
                res.send(err);
            }
        })
});

///////////////// Requests Targeting a specific  Articles /////////////////////////////

app.route("/articles/:articleTitle")

    .get(function(req,res){
        
        Article.findOne({title : req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("No article of name " + req.params.articleTitle + " found.");
            }
        });
    })
    .put(function(req,res){
        Article.findOneAndUpdate(
            {title : req.params.articleTitle},
            {title : req.body.title , content : req.body.content},
            {overwrite : true},
            function(err, result){
                if(!err){
                    res.send("Successfully updated Article");
                }
            }
        );
    })
.patch(function(req, res){
    Article.findOneAndUpdate(
        {title : req.params.articleTitle},
        {$set : req.body},
        function(err){
            if(!err){
                res.send("successfully updated article 🫢");
            }
            else{
                res.send(err);
            }
        }
    );
})
.delete(function(req, res){
    Article.deleteOne(
        {title : req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Deleted article successfully 🫢");
            }
            else{
                res.send(err);
            }
        }
    );
});

app.listen(3000, function(){
    console.log('Server is running on port 3000');
});
