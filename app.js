var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    Recaptcha        = require("express-recaptcha").RecaptchaV3,
    methodOverride   = require("method-override"),
    flash            = require("connect-flash"),
    TriviaSub        = require("./models/TriviaSub");


const dotenv = require('dotenv');
dotenv.config();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/triviasubmit");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

var recaptcha = new Recaptcha('6LdoWOUUAAAAAHXq0m_3E-IFwJton3cqE7OuM-du', '6LdoWOUUAAAAAJRY5UVbAVNusPqiQ9mzZBvvr0eL', {callback:'cb'});

app.get("/", function(req, res){
    TriviaSub.find({}).sort({upvote : 'desc'}).exec(function(err, foundSub){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('index', {submissions: foundSub});
        }
    });
});

app.post("/submit", function(req, res){
    recaptcha.verify(req, function(error, data){
        if (!error) {
            var name = req.body.name;
            var submission = req.body.submission;
            var upvote = 1;
            var newSubmission = {name: name, submission: submission, upvote: upvote};
            TriviaSub.create(newSubmission, function(err, newTrivia){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.redirect("back");
                }
            });
        } else {
            console.log(error);
            res.redirect("back");
        }
    });
});

app.put("/submit/:id", function(req, res){
    TriviaSub.findById(req.params.id, function(err, updatedSub){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            var upvote = updatedSub.upvote +1;
            updatedSub.upvote = upvote;
            updatedSub.save();
            res.redirect("back");
        }
    })
});

app.get("/admin1234", function(req, res){
    TriviaSub.find({}).sort({upvote : 'desc'}).exec(function(err, foundSub){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('admin', {submissions: foundSub});
        }
    });
});

app.delete("/delete/:id", function(req, res){
    TriviaSub.findByIdAndDelete(req.params.id, function(err, updatedSub){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});



app.listen(process.env.PORT, function(){
    console.log("Trivial Submissions Active");
});