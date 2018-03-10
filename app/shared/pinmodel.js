var config = require('../shared/config');
var fetchModule = require("fetch");
var storage = require("application-settings");
var http = require("http")
//var twilio = require("twilio");
var Observable = require("data/observable").Observable;
function auth(obj){
obj = obj || {};
    var views = new Observable({        
        pin: obj.pin || null,
        confirmpin :obj.confirmpin || null,
         showLoading:false
        }); 
views.acknowledge = function(){ 
    views.set("showLoading", true);
    return new Promise(function(resolve,reject){
        if (views.get("pin") != "" && views.get("confirmpin") != ""  &&views.get("pin") == views.get("confirmpin") ){
            views.set("showLoading", false);
            var sending = { _rev:storage.getString('rev'), pin:views.get("pin"), _id :storage.getString('_id'), username:storage.getString('username'), telephone:storage.getString('telephone'),
            email:storage.getString('email'), password:storage.getString('password'), name:storage.getString('name') }
           http.request({
           url: config.remote + "/"+storage.getString('_id')+"/",
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           content: JSON.stringify( sending )
          }).then((docs)=>{
             console.log('putted')
             storage.setString("pin",views.get("pin"));
             console.log( storage.getString("pin") + " Pin Saved Successfully");
             var dd = JSON.parse(docs.content);
             storage.setString('rev', dd.rev);
              resolve(true);
          }).catch((err)=>{
              console.log('pin not saved')
              reject(false);
          })    
           
        }
        else{
            viewss.set("showLoading", false);
            views.set("pin", null);
            views.set("confirmpin", null);
            reject();
        };
    });
};
    return views;
};

module.exports = auth;