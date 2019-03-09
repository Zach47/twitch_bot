// Kreedz Bot, by Jacob Barrett (Zach47)
// This is a functioning twitch bot that is meant for CS:GO KZ streamers.
// Version 1.2.4

var tmi = require('tmi.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
var timeout = 0;



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
    password: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  },
  channels: ["ijjust"]
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
          mapName = maps[0].map_name;
          kzSimpleMapTime = timeConvert(maps[0].time) + " by " + maps[0].player_name;
        }
        else {
          kzSimpleMapTime = timeConvert(maps[0].time) + " by " + maps[0].player_name;
        }
      } else {
        kzSimpleMapTime = "NA"; }
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
          kzTimerMapTime = timeConvert(maps[0].time) + " by " + maps[0].player_name;
        }
        else {
          kzTimerMapTime =  timeConvert(maps[0].time) + " by " + maps[0].player_name;
        }
      } else {
		  kzTimerMapTime = "NA";
		}
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
          kzVanillaMapTime = timeConvert(maps[0].time) + " by " + maps[0].player_name;
        }
        else {
          kzVanillaMapTime = timeConvert(maps[0].time) + " by " + maps[0].player_name;
        }
      } else {
        kzVanillaMapTime = "NA"; }
    } else { console.log("brokered"); }
  };
  request.onerror = function() { console.log("mega brokered"); };
  request.send();
  return true;
}








function mapInfoRequest() {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://kztimerglobal.com/api/v1.0/maps?limit=1000', true);

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
          maplist.push(maps[i].name);

          if (maps[i].difficulty_id == 1) {
            VeryEasyMaps.push(maps[i].name);
          }
          else if (maps[i].difficulty_id == 2) {
            EasyMaps.push(maps[i].name);
          }
          else if (maps[i].difficulty_id == 3) {
            MediumMaps.push(maps[i].name);
          }
          else if (maps[i].difficulty_id == 4) {
            HardMaps.push(maps[i].name);
          }
          else if (maps[i].difficulty_id == 5) {
            VeryHardMaps.push(maps[i].name);
          }
          else if (maps[i].difficulty_id == 6) {
            DeathMaps.push(maps[i].name);
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
  
  if (timeout !== 0) {
	  return;
  }

  if(message.toLowerCase().startsWith("!maptop")){

    if (message.split(" ")[1] == void 0) {
      client.say(channel, "You forgot a map name!");
      return;
    }
	if (message.split(" ")[2] == void 0) {
      client.say(channel, "You forgot a mode!");
      return;
    }
	else if (!(message.split(" ")[2].toUpperCase() === "KZT" || message.split(" ")[2].toUpperCase() === "SKZ" || message.split(" ")[2].toUpperCase() === "VNL")) {
		client.say(channel, "Invalid mode. Requires 'KZT, SKZ, or VNL.'");
		client.say(channel, message.split(" ")[2]);
		return;
	}
    else {
      var mapFound = 0;
      for (i=0;i<maplist.length;i++) {
        if (maplist[i].indexOf(message.split(" ")[1].toLowerCase()) !== -1) {
          mapFound = 1;
          mapName = maplist[i];
		  if (message.split(" ")[2].toUpperCase() == "KZT") {
			KZTimer(channel, mapName);
			setTimeout(function() {
			client.say(channel, mapName + ": " + kzTimerMapTime);
          }, 1200);
		  }
		  if (message.split(" ")[2].toUpperCase() == "SKZ") {
			SimpleKZ(channel, mapName);
			setTimeout(function() {
			client.say(channel, mapName + ": " + kzSimpleMapTime);
          }, 1200);
		  }
		  if (message.split(" ")[2].toUpperCase() == "VNL") {
			VanillaKZ(channel, mapName);
			setTimeout(function() {
			client.say(channel, mapName + ": " + kzVanillaMapTime);
          }, 1200);
		  }
		  timeout = 1;
		  setTimeout(function() {
			timeout = 0;
          }, 10000);
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
	timeout = 1;
		  setTimeout(function() {
			timeout = 0;
          }, 5000);
  }

  if(message.toLowerCase().startsWith("!gokzstats")) {
    client.say(channel, "https://gokzstats.com");
	timeout = 1;
		  setTimeout(function() {
			timeout = 0;
          }, 5000);
  }
});
