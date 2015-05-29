
var request = require('superagent');

var youTubeListApi = 'https://www.googleapis.com/youtube/v3/videos';
var youtubeApiKey = 'AIzaSyBOUg2rsWYmnU627izv30PK60ctKzw9h9k';

var graphApi = 'https://graph.facebook.com/',
    fbToken;

/**
  Controller that parses stuff and returns videos

*/

var Parsers = function(){
  var api = {},
      parsers = {};

  /**
    Parses a public webpage by url.

    @method page
    @param {object} url - the page's url
    @param {object} callback - for returning data
  */
  parsers.page = function(url, callback){
    var result = {items: []};

    request
      .get(url)
      .end(function(err, response){
        var videos = response.text.match(/youtube\.com\/embed\/(.*)\?/g);

        // no video found on the page;
        if(!videos) return callback(err, {items: []});

        var ids = videos.map(function(vid){
            return vid.match(/youtube\.com\/embed\/(.*)\?/)[1];
          }).join(',');

        // gets info about a list of videos
        request.get(youTubeListApi)
          .accept('json')
          .query({
            part: 'snippet',
            id: ids,
            key: youtubeApiKey
          }).end(function(e, response){
            result.items = response.body.items;
            callback(e, result);
          });
      });

  };

  /**
    Parses a facebook page by id

    @method page
    @param {object} id - The Facebook page id
    @param {object} callback - for returning the value
  */
  parsers.facebook = function(id, callback){
    var result = {items: []};

    function doRequest(){
      request
        .get(graphApi + 'v2.2/' + id + '/posts')
        .query({access_token: fbToken})
        .accept('json')
        .end(function(err, response){

          if(err || !response.body || !response.body.data){
            return callback(err, {items: []});
          }

          result.items = response.body.data
            .filter(function(post){
              return post.link && post.link.match(/youtube.com\/watch/);
            })
            .map(function(ytpost){
              var id = ytpost.link.match(/youtube.com\/watch\?v=(.*)/)[1];
              return {
                id: id,
                snippet: {
                  title: ytpost.name,
                  thumbnails: {
                    medium: {url: ytpost.picture}
                  }
                }
              };
            });

          callback(null, result);
        });
    }

    if(fbToken){
      doRequest();
    } else {
      utils.generateFacebookAccessToken(function(token){
        fbToken = token;
        doRequest();
      });
    }
  };

  //-

  api.parsePage = function(req, res){
    if(!req.body.url){
      res.send({error: 'Required parameter url missing!'});
      return;
    }

    parsers.page(req.body.url, function(err, videoArray){
      res.send(videoArray);
    });
  };

  api.parseFacebookPage = function(req, res){
    if(!req.body.id){
      res.send({error: 'Required parameter id missing!'});
      return;
    }

    parsers.facebook(req.body.id, function(err, videoArray){
      res.send(videoArray);
    });
  };

  return api;

};


module.exports = Parsers;