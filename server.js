//Imports
let express = require('express'),
    app = express();
let static = require('serve-static');
var request = require('request');
var http = require('http');
var https = require('https');
const util = require('util');
var bodyParser = require('body-parser');
var request = require('request');
var querystring = require('querystring');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

String.prototype.nl2br = function() {
    return this.replace(/\n/g, "<br />");
};


let baseURL = 'http://ec2-34-215-123-101.us-west-2.compute.amazonaws.com/api';


//app.configure(function(){

//Directory Configs
app.set('views', __dirname + '/views');
app.use('/dist', express.static(__dirname + '/assets/dist'));
app.use('/images', express.static(__dirname + '/assets/images'));


//Twig settings
let Twig = require('twig');
Twig.cache(false);
app.set('view engine', 'twig');
// This section is optional and can be used to configure twig.
app.set('twig options', {
    strict_variables: false
});


//Landing Page
// app.get('/', function(req, res){
//     // res.render('main', {
//     //     message : "Hello World"
//     // });
//     res.send("Hello World");
//
//     console.log("A user has arrived at the main page");
// });


app.get('/register', function(req,res){
    console.log("Attempting to log in");
    let username = req.body.username;
    let password = req.body.password;
    //let org = req.body.org;

});

app.get('/', function(req,res){
   res.render('login',{});
});

var authToken;

app.post('/login', function(req,res){
    console.log("Attempting to log in");
    let username = req.body.username;
    let password = req.body.password;

    // getAuthToken
    //     .then(function (authToken) {
    //         console.log("auth Token: " + authToken);
    //         console.log(authToken);
    //         res.send(authToken);
    //     })
    //     .catch(function (error) {
    //         console.log(error.message);
    //         res.send(error.message);
    //     });

    console.log("Getting the auth token");
    console.log("Username: " + username + "Password: " + password);
    let url = 'http://web-precheck:123456@ec2-34-215-123-101.us-west-2.compute.amazonaws.com/oauth/token';
    var options = {
        url: url,
        method:'post',
        form: {
            password: password,
            username: username,
            grant_type: 'password',
            scope: 'write',
            client_secret: '123456',
            client_id: 'web-precheck'
        }
    };
    function callback(error, response, body) {
        console.log(error);
        console.log(body);
        var data = JSON.parse(body);
        console.log(data.access_token);

        authToken = data.access_token;
        // res.render('home',{
        //     auth:data.access_token
        // });

        res.redirect('/home');

        //res.send(data.access_token);
    }

    request(options, callback);

});

app.get('/home',function(req, res){
    res.render('home',{
        auth:authToken
    });

    authToken = undefined;
});


function WordResult(name, id, url, location) {
    this.name = name;
    this.id = id;
    this.url = url;
    this.location = location;
}

function Keyword(name, result,locations, wordResultArray){
    this.result = result;
    this.name = name;
    console.log("Inner locations: " + locations);
    this.locations = JSON.parse(JSON.stringify(locations));
    this.wordResultArray = wordResultArray;
}

function Results(keywords){
    this.keywords = keywords;
}


var article;

/**
 * test: String of text body to analyse
 **/
app.post('/getWords', function(req, res){

    console.log("Got to the post");
    console.log(req.body);
    var inputBody = req.body.inputText;

    console.log("inputBody: " + inputBody);

    if (inputBody == undefined){
        res.send("There was an error parsing");
        return;
    }

    let url = baseURL + '/document/analyze';

    var options = {
        url: url,
        method:'post',
        headers: {
            'Authorization':'Bearer b7273565-d7db-4d5f-b766-77c486e13ab0'
        },
        body:inputBody
    };

    var words;
    function callback(error, response, body) {
        var keywords = [];
        words = response.body;
        words = JSON.parse(words);
        console.log(words);
        var keywords = [];
        for (var key in words) {
            // check if the property/key is defined in the object itself, not in parent
            if (words.hasOwnProperty(key)) {
                console.log("current key: " + key);
                console.log(words[key]);
                //Check if we got something back for the word
                if(words[key].entities.length > 0){
                    var wordResults = [];
                    for (var data in words[key].entities){
                        console.log("Current object: ");
                        console.log(words[key].entities[data]);
                        console.log("Name: " + words[key].entities[data].name); //Ask what the word was that was found
                        let wordResult = new WordResult(words[key].entities[data].name, words[key].entities[data].id, words[key].entities[data].url, 0);
                        wordResults.push(wordResult);
                    }
                    console.log("Locations: " + words[key].locations);
                    let keyword = new Keyword(key, true,words[key].locations, wordResults);
                    console.log("Keyword location: " + keyword.locations[0]);
                    keywords.push(keyword);
                }else{
                    let keyword = new Keyword(key, false,words[key].locations, null);
                    console.log("Locations: " + words[key].locations);
                    keywords.push(keyword);
                }
            }
        }

        var results = new Results(keywords);

        console.log(results);
        console.log(results.keywords[0].locations);

        article = parseArticle(results, inputBody);
        article = article.nl2br();
        console.log("got the article" + article);

        //res.setHeader('Content-Type', 'application/json');


        // res.render('parsed',{
        //     article:article
        // });

        //res.send(JSON.stringify(results));
        res.redirect('/parsed');


    }

    request(options, callback);

});


app.get('/microsoft', function(req, res){
    let authToken = req.query.code;
    console.log(authToken);

    var options = {
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        method:'post',
        form: {
            client_id: "6888383f-261f-4a88-9cbf-e05324d0c411",
            scope: "user.read mail.send",
            code: authToken,
            redirect_uri: "http://localhost:15000/microsoft",
            grant_type: "authorization_code",
            client_secret: "mf0CdCON42nqhJJ0S1XT50Y"
        }
    };


    function callback(error, response, body) {
        console.log(error);
        console.log(body.access_token);


        //var data = JSON.parse(body);
        //console.log(data.access_token);

        //authToken = data.access_token;
        // res.render('home',{
        //     auth:data.access_token
        // });

        //res.redirect('/home');

        //res.send(data.access_token);
    }

    request(options, callback);


});



app.get('/parsed',function(req, res){
    res.render('parsed',{
        article:article
    });

    article = undefined;
});

function parseArticle(keywords, article){

    console.log('-----------------------------------------------------------------');
    console.log(article);
    for(var item in keywords.keywords){
        var keyword = keywords.keywords[item];
        console.log(keyword.name);

        while(keyword.locations.length > 0) {
            console.log(keyword.locations.length);
            var string = " " + keyword.name;
            var wordLoc = article.search(string);
            let letter = article.charAt(wordLoc + 1);
            if(wordLoc == -1){
                keyword.locations.pop();
                break;
            }
            console.log("Found: " + letter + " at: " + wordLoc);
            var preString = "<div class='dropdown found'><span class='dropbtn'>";
            var postString = buildPostString(keyword);

            article = article.splice(wordLoc+1 + keyword.name.length, 0, postString);
            article = article.splice(wordLoc+1, 0, preString);

            keyword.locations.pop();

            //console.log(article);
        }
    }

    console.log(article);

    return article;
}

function buildPostString(keyword){
    var buildString = "</span><div id='myDropdown' class='dropdown-content'>";
    for(var result in keyword.wordResultArray){
        buildString += "<a class='result'>" + keyword.name + "<div class='url'>" + keyword.wordResultArray[result].url + "</div></a>";
    }
    buildString += "<a class='custom'>Enter Custom URL</a></div></div>";

    console.log(buildString);
    return buildString;
}


app.listen(15000);
