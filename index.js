// Kreedz Bot, by Jacob Barrett (Zach47)
// This is a functioning twitch bot that is useful for cs:go kreedz streamers.
// Version 1.2

var tmi = require('tmi.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var jsonMapId = {};
var maplist = [];
var combinedMapList = [];
var VeryEasyMaps = [];
var EasyMaps = [];
var MediumMaps = [];
var HardMaps = [];
var VeryHardMaps = [];
var DeathMaps = [];
var NominatedMapArray = [];
var mapName = "";
var error = "";



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
    password: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  },
  channels: ["ijjust","orbit_cs","sachburger","neverluqy","slumpfy","zpammm"]
}


function loadMap(map) {
  error = "";
  for (i=0;i<maplist.length;i++) {
    if (maplist[i].includes(map)) {
      mapName = maplist[i];
      return true;
    }
    else {
      error = "No map was found.";
    }
  }
}

function addNomination(map) {
  error = "";
  for (i=0;i<maplist.length;i++) {
    if (maplist[i].includes(map)) {
      NominatedMapArray.push(maplist[i]);
      mapName = maplist[i];
      return true;
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

    else {
      client.say(channel, (loadMap(message.split(" ")[1].toLowerCase())) ? "http://www.kzstats.com/maps/" + mapName + "/" : error);
    }
  }





  if (message.toLowerCase().startsWith("!nominate")) {
    if (message.split(" ")[1] == void 0) {
      client.say(channel, "You forgot to nominate a map!");
      return;
    }

    else {
      client.say(channel, (addNomination(message.split(" ")[1].toLowerCase())) ? mapName + " has been added to the nomination list" : error);
    }
  }




  if (message.toLowerCase().startsWith("!nomlist")) {
    if (NominatedMapArray.length === 0) {
      client.say(channel, "There aren't any nominated maps.");
    }
    nomListString = "";
    for (i=0;i<NominatedMapArray.length;i++) {
      if (nomListString.length === 0) {
        nomListString += NominatedMapArray[i];
      }
      else {
        nomListString += ", " + NominatedMapArray[i];
      }
    }
    client.say(channel, nomListString);
  }

  if (message.toLowerCase().startsWith("!select") && (user.mod === true || user.badges.broadcaster === "1")) {
    if (NominatedMapArray.length === 0) {
      client.say(channel, "A map must be nominated first before you can select it.");
      return;
    }
    if (message.split(" ")[1] == void 0) {
      client.say(channel, "You did not select a map.");
      return;
    }

    if (message.split(" ")[1] === "random") {
      randomGet = Math.round(Math.random()*(NominatedMapArray.length - 1));
      client.say(channel, NominatedMapArray[randomGet]);
      NominatedMapArray = []; // clear array after selection
    }

    else {
      loadMap(message.split(" ")[1].toLowerCase());
      for (i=0;i<NominatedMapArray.length;i++) {
        if (NominatedMapArray[i].includes(mapName)) {
          client.say(channel, mapName);
          NominatedMapArray = [];
          break;
        }
        else if (i+1 == NominatedMapArray.length) {
          client.say(channel, "That wasn't a nominated map.");
        }
      }
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


        if (message.split(" ").length.toString() > 2) {
          var splitMessage = message.split(" ");
          combinedMapList = [];

          for (i=1;i<message.split(" ").length;i++) {
            if (splitMessage[i] == "veasy") {
              combinedMapList.push.apply(combinedMapList, VeryEasyMaps);
            }
            if (splitMessage[i] == "easy") {
              combinedMapList.push.apply(combinedMapList, EasyMaps);
            }
            if (splitMessage[i] == "medium") {
              combinedMapList.push.apply(combinedMapList, MediumMaps);
            }
            if (splitMessage[i] == "hard") {
              combinedMapList.push.apply(combinedMapList, HardMaps);
            }
            if (splitMessage[i] == "vhard") {
              combinedMapList.push.apply(combinedMapList, VeryHardMaps);
            }
            if (splitMessage[i] == "death") {
              combinedMapList.push.apply(combinedMapList, DeathMaps);
            }
          }
          randomGet = Math.round(Math.random()*(combinedMapList.length - 1));
          client.say(channel, combinedMapList[randomGet].mapname);
        } else {

          switch(message.split(" ")[1]) {
            case "help":
            client.say(channel, "You can use !randommap by itself and it will give you any map. Use these parameters (including multiple parameters) with !randommap if you'd like a specific difficulty range: veasy, easy, medium, hard, vhard, death.");
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
      }
    });
