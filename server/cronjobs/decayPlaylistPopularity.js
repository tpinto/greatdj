
/**

    Task that decays the popularity of the popular playlists stored 
    on GreatDJ's REDIS (a ZSET under gretdj-popular).
    
    Should run every hour.

**/ 

var redis = require("redis"),
    redisClient = redis.createClient();

    redisClient.ZREMRANGEBYRANK('greatdj-popular', 0, -20);
    redisClient.ZUNIONSTORE('greatdj-popular', 1, 'greatdj-popular', 0.97, function(err, res){
        console.log('Done union store', err, res);
        process.exit(1)
    });
