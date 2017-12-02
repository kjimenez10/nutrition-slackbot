const request = require('request');

module.exports = function(controller){
  // controller
  controller.hears(['I ate'],'direct_message,direct_mention',function(bot,message){
    let location = message.text.split('I ate ')[1];
    //bot.reply(message,spongebobify(text));
    let processGeoCodeData = (data) =>{
      let info = JSON.parse(data)[0];
      
      let response = "You must burn  " + info.calories + ". So you must run" + info.miles;
      bot.reply(message,response);
      
    }
    geocode(location,processGeoCodeData);
  
  }); 
  
  
}

function geocode(where,callback){
  let options = {
    method : 'GET',
    url: 'http://nominatim.openstreetmap.org/',
    qs:{
      q: where,
      format : 'json'
    }
  };
  request(options,function(error,response,body){
    callback(body);
  })
}

