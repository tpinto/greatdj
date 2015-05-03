// Routes

var Router = function(app, io){

var db = app.get('db');

var RecentSearches = require('./models/recentSearches'),
    Parties = require('./models/party'),

    recentSearchesController = require('./controllers/recentSearchesController')(db),
    playlistController = require('./controllers/playlistController')(db),
    parsersController = require('./controllers/parsersController')(),
    adminController = require('./controllers/adminController')(db),

    utils = require('./utils');

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
    GET /admin
    Admin stuff.
  **/
  app.get('/admin', adminController.index);

  /**
    GET *
    Everything else - serves index.html.
  **/
  app.get('*', function(req, res){
    Parties.find({ip: utils.getRemoteIpAddress(req)}, function(err, result){
      var ids = result.map(function(obj){ return obj.playlistId; });
      res.render('index', {data: utils.passVar({playlists: ids, recent: RecentSearches.getAll()})});
    });
  });

};

module.exports = Router;
