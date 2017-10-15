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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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


app.post('/register', function(req,res){
    console.log("Attempting to log in");
    let username = req.body.username;
    let password = req.body.password;
    let org = req.body.org;

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


// var getAuthToken = new Promise(
//     function (resolve, reject) {
//             if(username == undefined || password == undefined){
//                 console.log("Tried to run the promise");
//                 return;
//             }
//             console.log("Getting the auth token");
//             console.log("Username: " + username + "Password: " + password);
//             let url = 'http://web-precheck:123456@ec2-34-215-123-101.us-west-2.compute.amazonaws.com/oauth/token';
//             var options = {
//                 url: url,
//                 method:'post',
//                 form: {
//                     password: 'password',
//                     username: 'michael',
//                     grant_type: 'password',
//                     scope: 'write',
//                     client_secret: '123456',
//                     client_id: 'web-precheck'
//                 }
//             };
//             function callback(error, response, body) {
//                 console.log(error);
//                 console.log(body);
//                 var data = JSON.parse(body);
//                 console.log(data.access_token);
//                 if(!data.error){
//                     resolve(data.access_token);
//                 }
//                 var error = new Error("Error getting auth token");
//                 reject(error);
//
//
//             }
//
//             request(options, callback);
//     }
// );



//http://ec2-34-215-123-101.us-west-2.compute.amazonaws.com/oauth/token



function WordResult(name, id, url, location) {
    this.name = name;
    this.id = id;
    this.url = url;
    this.location = location;
}

function Keyword(name, result,locations, wordResultArray){
    this.result = result;
    this.name = name;
    this.locations = locations;
    this.wordResultArray = wordResultArray;
}

function Results(keywords){
    this.keywords = keywords;
}


/**
 * test: String of text body to analyse
 **/
app.post('/getWords', function(req, res){

    console.log("Got to the post");
    console.log(req.body);
    var body = req.body.inputText;

    console.log("body: " + body);

    if (body == undefined){
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
        body:body
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
                    wordResults.app
                    for (var data in words[key].entities){
                        console.log("Current object: ");
                        console.log(words[key].entities[data]);
                        console.log("Name: " + words[key].entities[data].name); //Ask what the word was that was found
                        let wordResult = new WordResult(words[key].entities[data].name, words[key].entities[data].id, words[key].entities[data].url, 0);
                        wordResults.push(wordResult);
                    }
                    let keyword = new Keyword(key, true,words[key].locations, wordResults);
                    keywords.push(keyword);
                }else{
                    let keyword = new Keyword(key, false, null);
                    keywords.push(keyword);
                }
            }
        }

        var results = new Results(keywords);
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    }

    request(options, callback);

});


app.listen(15000);
