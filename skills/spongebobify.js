//require spongebobify here!

const spongebobify = require('spongebobify')

module.exports = function(controller){
  controller.hears(['spongebobify'],'direct_message,direct_mention',function(bot,message){
    let text = message.text.split('spongebobify')[1];
    bot.reply(message,spongebobify(text));
    
  //console.log('Heyy');
                   });
}

