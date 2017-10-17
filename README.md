# kreedz_bot, a twitch bot for kreedz streamers!

[This bot](https://go.twitch.tv/kreedz_bot) was created by [Zach47](http://steamcommunity.com/id/zach47).

Originally created as a means of replacing Orbit's custom nightbot command "!maptop", it has become a full-fledged kreedz bot for twitch streamers.

Made in Node JS.
____
# Commands

**!kzcommands** - Shows all commands available for the bot.

**!randommap** - Provides a random map. You can add either a single parameter or multiple parameters (veasy, easy, medium, hard, vhard, death) to get specific maps. You can also use a "help" parameter to show how to use it in twitch chat.

**!maptop** (map name) - Provides a [kzstats](http://www.kzstats.com/) link of the map given as a parameter. You can provide a partial map name or the full map name as a parameter.

**!nominate** (map name) - Allows users to nominate maps for the streamer to play.

**!nomlist** - See which maps are nominated.

**!select** ("random" or map name) - Allows **mods** and **the streamer** to select which of the nominated maps to play.
        If someone types !select random, it will randomly select a map from the nominated list.
        If someone types !select (map name), the map must both be a kreedz map and in the nominated map list.

**!kzstats** - Provides a link to [KZStats](http://www.kzstats.com/).

**!gokzstats** - Provides a link to [GOKZ Stats](https://www.jacobwbarrett.com/kreedz/gokzstats.html).

**!servers** - Provides a link to [KZStats server link](http://www.kzstats.com/servers/).
