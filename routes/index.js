var express = require('express');
var router = express.Router();
//var config = require('./config.js');
const {google} = require('googleapis');
//var plus = google.plus('v1');
var opn = require('opn');
var path = require('path');
const fs = require('fs');
var request = require('request');

const keyfile = path.join(__dirname, '../keys.json');
const keys = JSON.parse(fs.readFileSync(keyfile));

const oauth2Client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);
const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/plus.login'
];
const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
 
  // If you only need one scope you can pass it as a string
  scope: scopes
});
const plus = google.plus({
  version: 'v1',
  auth: '<API Key>'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/index', function(req, res, next) {
    res.redirect(url);
});
router.get('/callback', function(req,res,next){
  const code = req.query.code;
  var response = x(code,res)
});

function x(code,res){

  const {tokens} =  oauth2Client.getToken(code)
  
  
  
  oauth2Client.on('tokens', (tokens) => {
    oauth2Client.setCredentials(tokens)
    //console.log(tokens);
    //console.log(tokens.access_token)
    plus.people.get({  
      userId: 'me',
      auth: oauth2Client
      }, function (err, response) {
        res.render('new', {name: response.data.displayName, url: response.data.url})
    });
  });
};
module.exports = router;
