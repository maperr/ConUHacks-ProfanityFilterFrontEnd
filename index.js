var client;

var tweets = [];

$(function() {

  var tweetObj = function(payload, tweets) {
    this.content = payload.tweet.content;
    this.language = payload.tweet.language;
    this.isMean = payload.result.isMean;
    this.avgConfidence = payload.result.avgConfidence;
    this.displayName = payload.tweet.display_name;
    this.username = payload.tweet.username;
    this.date = payload.tweet.date;
    if(!(payload.tweet.attachedImages instanceof Array)) {
      this.imgUrl = [payload.tweet.attachedImages];
    }
    else this.imgUrl = payload.tweet.attachedImages;

    if(!(payload.result.intents instanceof Array)) {
      this.intents = [payload.result.intents];
    }
    else this.intents = payload.result.intents;

    if(!(payload.tweet.hashtags instanceof Array)) {
      this.hashtags = [payload.tweet.hashtags];
    }
    else this.hashtags = payload.tweet.hashtags;

    tweets.push(this);
  };

  var tweets = [];

  function addContact(payload) {
    new tweetObj(name, numbers, address, AddressBook)
  }


  client = new FilterClient();

  var tweetImgUrl;
  var tweetDiplayName;
  var tweetUsername;
  var tweetTime;
  var tweetMessage;
  var tweetHashtags = [];
  var tweetLang;
  var tweetIsMean;
  var tweetAvgConfidence
  var tweetIntents = [];

  client.onNewTweet = function(tweet) {
    tweetMessage = tweet.tweet.content;
    tweetImgUrl = tweet.tweet.attachedImages;
    tweetLang = tweet.tweet.language;
    tweetHashtags = tweet.tweet.hashtags;
    tweetIntents = tweet.result.intents;
    tweetIsMean = tweet.result.isMean;
    tweetAvgConfidence = tweet.result.avgConfidence;

    tweets.push( )

    console.log(tweet);
  }

  client.onStatUpdate = function(stats) {
      //TODO: jQuery manipulations
      console.log(stats);
  }

  client.onTrendingRecieved = function(trending) {
      //TODO: jQuery manipulations
      console.log(trending);
  }

  client.connect();

  $("#fakeTweet").click(function(){
    new NewTweet();
  });

  $("#addHashtag").click(function() {
    if($("#message").val().trim())
      $("#current-hashtags").append("<span>" + $("#message").val() + ", </span>");
      //TODO: tell client to follow this hashtag
  });
});

  NewTweet = function(tweet) {
  var numberOfPostsToShow = 5;
  
  obj = "<li class='received tweet' id='messageList'>" +
                '<img src="http://placehold.it/32x32" />' +
                '<h4>DiplayName</h4>'+
                '<h5>@Username</h5>'+
                '<h6>Time</h6>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dictum interdum ante non gravida. Duis fringilla pulvinar mi, non vestibulum felis dapibus non. Nunc elementum eleifend pretium. Phasellus mattis felis.</p>'+
            '</li>';
  $("#messages").prepend(obj);
  if($(".tweet").length > numberOfPostsToShow){
    $(".tweet").last().remove();
  }
}

FilterClient = function() {
  this.onNewTweet = function(tweet) {
    console.log('You must override this event handler');
  }

  this.onStatUpdate = function(stats) {
    console.log('You must override this event handler');
  }

  this.onTrendingRecieved = function(trending) {
    console.log('You must override this event handler');
  }
}

FilterClient.prototype.connect = function() {
  this.socket = new WebSocket('ws://172.31.194.25:1338');
  console.log('Connecting...');

  var that = this;

  this.socket.onopen = function() {
    console.log('Connected to the tweet filter');
  }

  this.socket.onclose = function() {
    console.log('Connection to the tweet filter closed');
  }

  this.socket.onerror = function(err) {
    console.log('Error');
    console.log(err);
  }

  this.socket.onmessage = function(event) {
      var response = JSON.parse(event.data);

      if(response.command == "NEW_TWEET"){
          that.onNewTweet(response.payload);
      } else if(response.command == "STATS_RESPONSE") {
        that.onStatUpdate(response.payload);
      } else if(response.command == "TRENDING_RESPONSE") {
        that.onTrendingRecieved(response.payload);
      }
  }
}

FilterClient.prototype.requestStats = function() {
  this.socket.send(JSON.stringify({
    command : 'STATS_REQUEST',
    payload : {}
  }));
}

FilterClient.prototype.requestTrending = function() {
  this.socket.send(JSON.stringify({
    command : 'REQUEST_TRENDING',
    payload : {}
  }));
}

FilterClient.prototype.addTrackedTopic = function(topic) {
  this.socket.send(JSON.stringify({
    command : 'ADD_TOPIC',
    payload : {
      topic : topic
    }
  }));
}

FilterClient.prototype.removeTrackedTopic = function(topic) {
  this.socket.send(JSON.stringify({
    command : 'REMOVE_TOPIC',
    payload : {
      topic : topic
    }
  }));
}
