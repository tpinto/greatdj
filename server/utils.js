
var request  = require('superagent');

var graphApi    = 'https://graph.facebook.com/',
    credentials = require('./auth.json');

module.exports = {
  getRemoteIpAddress: function(req){
  // have to do it this way as it's being served by apache so remoteAddress would always be 127.0.0.1 ...
   return (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '127.0.0.1');
  },

  passVar: function(object){
    return new Buffer(JSON.stringify(object)).toString('base64');
  },

  generateFacebookAccessToken: function(callback){
    // Generate FB Access Token
    request
      .get(graphApi + 'oauth/access_token')
      .query({
        'grant_type': 'client_credentials',
        'client_id': credentials.fb_app,
        'client_secret': credentials.fb_secret
      })
      .end(function(err, response){
        var id = response.text.split('=')[1];
        console.log(' * got fb access token', id);
        callback(id);
      });
  }

};