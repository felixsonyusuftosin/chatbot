var config = require('../shared/config');
var fetchModule = require("fetch");
var storage = require("application-settings");
var http = require("http")
//var twilio = require("twilio");
var Observable = require("data/observable").Observable;
function auth(obj){
obj = obj || {};
    var views = new Observable({        
        otp: obj.otp || null,
         showLoading : false
        });
    
views.set("otp", storage.getNumber("otp"));
console.log("this is otp");
console.log(views.get("otp"))
views.acknowledge = function(){  
    return new Promise(function(resolve,reject){
        if (views.get("otp") != "" && views.get("otp") == storage.getNumber("otp")){
            views.set("showLoading", false); 
           resolve(true);
        }
        else{
            viewss.set("showLoading", false);
            views.set("otp", null)
            reject();
        }
    })
}
    return views;
}

module.exports = auth;