const Botkit = require("botkit");
const env = require("node-env-file");

env(".env");

const botOptions = {
  debug: true,
  stats_optout: true
};

botOptions.json_file_store = "./data/";

const controller = Botkit.slackbot(botOptions);

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log("Error: Specify clientId clientSecret and PORT in environment");
}

console.log(process.env.clientId);

controller.configureSlackApp({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.oauthRedirect,
  scopes: ["bot"]
});

controller.setupWebserver(process.env.PORT, function(err, webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver, function(
    err,
    req,
    res
  ) {
    if (err) {
      res.status(500).send("ERROR: " + err);
    } else {
      res.send("Success!");
    }
  });
});

// stop multiple connections
var _bots = {};

function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on("create_bot", function(bot, config) {
  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {
      if (!err) {
        trackBot(bot);
      }
    });
  }
});

controller.storage.teams.all(function(err, teams) {
  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t in teams) {
    if (teams[t].bot) {
      controller.spawn(teams[t]).startRTM(function(err, bot) {
        if (err) {
          console.log("Error connecting bot to Slack:", err);
        } else {
          trackBot(bot);
        }
      });
    }
  }
});

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

controller.hears(["satay"], "direct_message", function(bot, message) {
  bot.reply(message, "satay boiz");
});
