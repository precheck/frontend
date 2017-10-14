
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//let baseURL = "https://testurl";


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


/**
* test: String of text body to analyse
**/

app.post('/', function(req, res){
    console.log("Got to the post");
    console.log(req.body.text);

    // request.post(
    //     'http://www.yoursite.com/formpage',
    //     { json:
    //         { key: 'value' }
    //         },
    //     function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             console.log(body)
    //         }
    //     }
    // );


    res.send('POST request to the homepage');
});


app.listen(15000);












