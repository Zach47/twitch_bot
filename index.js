//Initial requires.
var tmi = require('tmi.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var jsonMapId = {};
var maplist = [];
var VeryEasyMaps = [];
var EasyMaps = [];
var MediumMaps = [];
var HardMaps = [];
var VeryHardMaps = [];
var DeathMaps = [];

var mapName = "";
var error = "";
//These are the settings for the client to use.
var options = {
  options: {
    debug: true
  },

  connection: {
    cluster: "aws",
    reconnect: true
  },

  identity: {
    username: "kreedz_bot",
    password: "Good one"
  },
  channels: ["orbit_cs","ijjust"]
}


function loadMap(map) {
  for (i=0;i<maplist.length;i++) {
    if (maplist[i].includes(map)) {
      error = "";
      mapName = maplist[i];
      break;
    }
    else {
      error = "No map was found.";
    }
  }
}



function mapInfoRequest() {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://www.jacobwbarrett.com/js/mapListNew.js', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var maps = JSON.parse(request.responseText);
      for (i=0;i<maps.length;i++) {
        if (maps[i].Global === 0) {
          return;
        }
        else if (maps[i].id === undefined) {
          return;
        }
        else {
          jsonMapId[maps[i].id] = [maps[i].mapname,maps[i].workshop_id,maps[i].difficulty_id];
          maplist.push(jsonMapId[maps[i].id][0]);

          if (maps[i].difficulty_id == 1) {
            VeryEasyMaps.push(maps[i]);
          }
          else if (maps[i].difficulty_id == 2) {
            EasyMaps.push(maps[i]);
          }
          else if (maps[i].difficulty_id == 3) {
            MediumMaps.push(maps[i]);
          }
          else if (maps[i].difficulty_id == 4) {
            HardMaps.push(maps[i]);
          }
          else if (maps[i].difficulty_id == 5) {
            VeryHardMaps.push(maps[i]);
          }
          else if (maps[i].difficulty_id == 6) {
            DeathMaps.push(maps[i]);
          }
        }
      }


    } else {
      console.log("brokered");
    }
  };

  request.onerror = function() {
    console.log("mega brokered");
  };

  request.send();
}


var client = new tmi.client(options);
client.connect();

client.on("connected", function(address, port, channel){
  client.action("ijjust", "has been started.");
  mapInfoRequest();
});

//This function is executed everytime someone sends a message in the chat.
client.on("chat", function(channel, user, message, self){
  if (self) return;

  if(message.toLowerCase().startsWith("!maptop")){
    if (message.split(" ")[1] == void 0) {
      client.say(channel, "You forgot a map name!");
      return;
    }
    loadMap(message.split(" ")[1].toLowerCase());

    if (error.length > 0) {
      client.say(channel, error);
    }
    else {
      client.say(channel, "http://www.kzstats.com/maps/" + mapName + "/");
    }
  }

  if(message.toLowerCase().startsWith("!kzcommands")) {
    client.say(channel, "A full list of commands is available here: https://github.com/Zach47/twitch_bot/ If you have any suggestions, please message Zach47 on Discord or Steam.");
  }

  if(message.toLowerCase().startsWith("!servers")) {
    client.say(channel, "http://www.kzstats.com/servers/");
  }

  if(message.toLowerCase().startsWith("!kzstats")) {
    client.say(channel, "http://www.kzstats.com/");
  }

  if(message.toLowerCase().startsWith("!gokzstats")) {
    client.say(channel, "https://www.jacobwbarrett.com/kreedz/gokzstats.html");
  }

  if(message.toLowerCase().startsWith("!randommap")) {
    var randomGet = 0;

    switch(message.split(" ")[1]) {
      case "help":
        client.say(channel, "You can use !randommap by itself and it will give you any map. Use these parameters with !randommap if you'd like a specific difficulty: veasy, easy, medium, hard, vhard, death.");
        break;
      case "veasy":
        randomGet = Math.round(Math.random()*(VeryEasyMaps.length - 1));
        client.say(channel, VeryEasyMaps[randomGet].mapname);
        break;
      case "easy":
        randomGet = Math.round(Math.random()*(EasyMaps.length - 1));
        client.say(channel, EasyMaps[randomGet].mapname);
        break;
      case "medium":
        randomGet = Math.round(Math.random()*(MediumMaps.length - 1));
        client.say(channel, MediumMaps[randomGet].mapname);
        break;
      case "hard":
        randomGet = Math.round(Math.random()*(HardMaps.length - 1));
        client.say(channel, HardMaps[randomGet].mapname);
        break;
      case "vhard":
        randomGet = Math.round(Math.random()*(VeryHardMaps.length - 1));
        client.say(channel, VeryHardMaps[randomGet].mapname);
        break;
      case "death":
        randomGet = Math.round(Math.random()*(DeathMaps.length - 1));
        client.say(channel, DeathMaps[randomGet].mapname);
        break;
      default:
        randomGet = Math.round(Math.random()*(maplist.length - 1));
        client.say(channel, maplist[randomGet]);
    }
  }
});
