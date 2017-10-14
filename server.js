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
app.get('/', function(req, res){
    // res.render('main', {
    //     message : "Hello World"
    // });
    res.send("Hello World");

    console.log("A user has arrived at the main page");
});


app.post('/register', function(req,res){
    console.log("Attempting to log in");
    let username = req.body.username;
    let password = req.body.password;
    let org = req.body.org;

});

app.post('/login', function(req,res){
    console.log("Attempting to log in");
    let username = req.body.username;
    let password = req.body.password;
});

//http://ec2-34-215-123-101.us-west-2.compute.amazonaws.com/oauth/token




/**
 * test: String of text body to analyse
 **/
app.post('/', function(req, res){
    console.log("Got to the post");
    console.log(req.body.inputText);
    var body = req.body.inputText;


    let url = baseURL + '/document/analyze';
    console.log(url);

    var options = {
        url: url,
        method:'post',
        headers: {
            'Authorization':'Bearer ' + '0d54b1f6-1186-46a0-a38c-35b0df61f189'
        },
        body:body
    };

    var words;
    function callback(error, response, body) {

        //console.log(body);
        console.log(response.body);
        console.log(error);
        words = response.body;


        words = JSON.parse(words);
        console.log(words);



        for (var key in words) {
            // check if the property/key is defined in the object itself, not in parent
            if (words.hasOwnProperty(key)) {
                //console.log(key, words[key]);
                console.log(key);
                console.log(words[key]);
                if(words[key].length > 0){
                    console.log(words[key].length);
                    console.log("Name: " + words[key][0].name);
                }


            }
        }


        res.send(words);
    }

    request(options, callback);

});


app.listen(15000);












