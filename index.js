// Kreedz Bot, by Jacob Barrett (Zach47)
// This is a functioning twitch bot that is useful for cs:go kreedz streamers.
// Version 1.2.3

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
var kzTimerMapTime = "";
var kzSimpleMapTime = "";
var kzVanillaMapTime = "";



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
    password: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  },
  channels: ["ijjust","orbittron","sachburger","neverluqy","slumpfy","zpammm","gamechaos","netcodeyyy","ephneyo","byssl","BaIlisticBacon"]
}

/* https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds */
function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

function timeConvert(time) {
  ms = time.toString().split(".");
  // API sends a time that ends with ".000" as just a whole number (Discovery: 12.000 is sent as 12). This fixes that.
  if (!ms[1]) {
    ms[1] = "000";
  }
  if (ms[1].length === 1) {
    ms[1] += "0";
  }
  if (time >= 3600.00) {
    hours = Math.floor(time / 3600.00);
    minutes = Math.floor(time % 3600.00 /60.00);
    seconds = Math.floor(time % 60.00);
    return str_pad_left(hours,'',2)+':'+str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2) +'.'+ ms[1].substr(0,2);
  }
  else if (time === "NA") {
    return "NA";
  }
  else if (time < 60) {
    seconds = Math.floor(time % 60.00);
    return str_pad_left(seconds,'0',2)+"."+ms[1].substr(0,2);
  }
  else {
    minutes = Math.floor(time % 3600.00 /60.00);
    seconds = Math.floor(time % 60.00);
    return str_pad_left(minutes,'',2)+':'+str_pad_left(seconds,'0',2)+'.'+ ms[1].substr(0,2); // "time" is milliseconds
  }
}


function SimpleKZ(channel, map) {
  var request = new XMLHttpRequest();

  request.open('GET', 'http://kztimerglobal.com/api/v1.0/records/top?map_name=' + map + '&tickrate=128&stage=0&modes_list_string=kz_simple&has_teleports=false', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var maps = JSON.parse(request.responseText);
      if (maps.length !== 0) {
        if (maps[0].player_name.length < 14) {
          kzSimpleMapTime = (mapName.length > 16 ? " ————Top Records On | " : " ————————Top Records on | ") + map + " ——————SimpleKZ | " + timeConvert(maps[0].time) + (maps[0].player_name.length < 7 ? " ———— " + maps[0].player_name : " — " + maps[0].player_name);
        }
        else {
          kzSimpleMapTime = (mapName.length > 16 ? " ————Top Records On | " : " ————————Top Records on | ") + map + " ——————SimpleKZ | " + timeConvert(maps[0].time) + " — " + maps[0].player_name.substr(0,11) + "...";
        }
      } else { kzSimpleMapTime = " ——————SimpleKZ | No Record Recorded Yet." }
    } else { console.log("brokered"); }
  };
  request.onerror = function() { console.log("mega brokered"); };
  request.send();
  return true;
}

function KZTimer(channel, map) {
  var request = new XMLHttpRequest();

  request.open('GET', 'http://kztimerglobal.com/api/v1.0/records/top?map_name=' + map + '&tickrate=128&stage=0&modes_list_string=kz_timer&has_teleports=false', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var maps = JSON.parse(request.responseText);
      if (maps.length !== 0) {
        if (maps[0].player_name.length < 14) {
          kzTimerMapTime = " ——————KZTimer | " + timeConvert(maps[0].time) + (maps[0].player_name.length < 7 ? " ———— " + maps[0].player_name : " — " + maps[0].player_name);
        }
        else {
          kzTimerMapTime = " ——————KZTimer | " + timeConvert(maps[0].time) + " — " + maps[0].player_name.substr(0,11) + "...";
        }
      } else { kzTimerMapTime = " ——————KZTimer | No Record Recorded Yet." }
    } else { console.log("brokered"); }
  };
  request.onerror = function() { console.log("mega brokered"); };
  request.send();
  return true;
}

function VanillaKZ(channel, map) {
  var request = new XMLHttpRequest();

  request.open('GET', 'http://kztimerglobal.com/api/v1.0/records/top?map_name=' + map + '&tickrate=128&stage=0&modes_list_string=kz_vanilla&has_teleports=false', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var maps = JSON.parse(request.responseText);
      if (maps.length !== 0) {
        if (maps[0].player_name.length < 14) {
          kzVanillaMapTime = "——————VanillaKZ | " + timeConvert(maps[0].time) + (maps[0].player_name.length < 7 ? " ———— " + maps[0].player_name : " — " + maps[0].player_name);
        }
        else {
          kzVanillaMapTime = "——————VanillaKZ | " + timeConvert(maps[0].time) + " — " + maps[0].player_name.substr(0,11) + "...";
        }
      } else { kzVanillaMapTime = " ——————VanillaKZ | No Record Recorded Yet." }
    } else { console.log("brokered"); }
  };
  request.onerror = function() { console.log("mega brokered"); };
  request.send();
  return true;
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
  client.color("GoldenRod");
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
      var mapFound = 0;
      for (i=0;i<maplist.length;i++) {
        if (maplist[i].indexOf(message.split(" ")[1].toLowerCase()) !== -1) {
          mapFound = 1;
          mapName = maplist[i];
          SimpleKZ(channel, mapName);
          KZTimer(channel, mapName);
          VanillaKZ(channel, mapName);

          setTimeout(function() {
            client.say(channel, "—— GOKZ Stats ——————" + kzSimpleMapTime + kzTimerMapTime + kzVanillaMapTime);
          }, 300);
          break;
        }
      }
      if (mapFound === 0) {
        client.say(channel, "Invalid map name. Please enter a partial or full global map name.");
      }
    }
  }

  if(message.toLowerCase().startsWith("!kzcommands") || message.toLowerCase().startsWith("!help")) {
    client.say(channel, "The full list of commands for kreedz_bot is available here: https://github.com/Zach47/twitch_bot/");
  }

  if(message.toLowerCase().startsWith("!servers")) {
    client.say(channel, "kzstats.com/servers/");
  }

  if(message.toLowerCase().startsWith("!kzstats")) {
    client.say(channel, "kzstats.com/");
  }

  if(message.toLowerCase().startsWith("!gokzstats")) {
    client.say(channel, "gokzstats.com");
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
