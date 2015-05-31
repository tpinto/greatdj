// Routes

var Router = function(app, io){

var db = app.get('db');

var RecentSearches = require('./models/recentSearches'),
    Parties = require('./models/party'),
    Playlists = require('./models/playlist'),

    recentSearchesController = require('./controllers/recentSearchesController')(db),
    playlistController = require('./controllers/playlistController')(db),
    parsersController = require('./controllers/parsersController')(),
    adminController = require('./controllers/adminController')(db),

    utils = require('./utils')
    AppConstants = require('./constants/App');

    Parties.setup(db);

  /**
    POST /p
    Saves (or overrides) a playlist.
  **/
  app.post('/p', playlistController.savePlaylist);


  /**
    POST /s
    Saves a new recent search.
  **/
  app.post('/s', recentSearchesController.newSearch);

  /**
    POST /fb_s
    Queries a Facebook page for posts and returns an array of Youtube videos.
  **/
  app.post('/fb_s', parsersController.parseFacebookPage);



  /**
    POST /url_s
    Parses a web page returning all Youtube videos it finds along the way.
  **/
  app.post('/url_s', parsersController.parsePage);


  /**
    GET /p
    Gets a saved playlist by query id.
  **/
  app.get('/p', playlistController.getPlaylistById);

  /**
    GET /s
    Gets all the recently saved searches.
  **/
  app.get('/s', recentSearchesController.getSearches);

  /**
    GET /popular
    Gets the current popular playlists.
  **/
  app.get('/popular', playlistController.getPopularPlaylists);

  /**
    GET /popular
    Gets the current popular playlists.
  **/
  app.get('/p_summary', playlistController.getPlaylistsSummary);


  /**
    GET /admin
    Admin stuff.
  **/
  app.get('/admin', adminController.index);

  app.param('plId', function(req, res, next, id){
    req.playlist = {
      plId: id
    };

    Playlists.getPlaylistDetails(req.params.plId, function(err, result){
      if(err){
        delete req.playlist;
      } else {
        req.playlist = result;
      }

      next();
    })
  });

  /**
    GET *
    Everything else - serves index.html.
  **/
  app.get('/(:plId?)', function(req, res){

    var pageDescription =  req.playlist ?
      req.playlist.description :
      AppConstants.pageDescription;

    Parties.find({ip: utils.getRemoteIpAddress(req)}, function(err, result){
      var ids = result.map(function(obj){ return obj.playlistId; });

      var data = {
        data: utils.passVar({playlists: ids, recent: RecentSearches.getAll()}),
        description: pageDescription,
        title: 'GREAT DJ!'
      };

      if(req.playlist){
        var randomVideo = req.playlist.videos[Math.floor(Math.random() * req.playlist.videos.length)];
        data.image_large_url = 'img.youtube.com/vi/' + randomVideo.videoId + '/0.jpg'
        data.title += ' Playlist: ' + req.playlist.plId;
        data.video_url = 'www.youtube.com/embed/'+randomVideo.videoId;
      }

      res.render('index', data);
    });
  });

};

module.exports = Router;
