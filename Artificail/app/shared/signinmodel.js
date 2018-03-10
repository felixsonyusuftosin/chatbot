var config = require('../shared/config');
var fetchModule = require("fetch");
var storage = require("application-settings");
var http = require("http")
//var twilio = require("twilio");
var Observable = require("data/observable").Observable;
function signin(obj){
obj = obj || {};
    var views = new Observable({        
        username: obj.username || "",
        password :obj.password || "",
        details: obj.details || "",
        showdetails: false,
        showLoading:false
        }); 
views.signinnow = function(){ 
    views.set("showLoading", true);
    return new Promise(function(resolve,reject){
        if (views.get("username") != "" && views.get("password") != ""){ 
             views.set('showLaoding', true);
            var sturl = config.remote + '/'+views.get("username");   
            console.log(sturl);            
            http.request({ url: sturl, method: "GET" }).then((res)=>{
                var re = JSON.parse(res.content)              
                console.dump(re)
               // if (views.get("username") == re["_id"] || views.get("username") == re["email"]  && views.get("password") == re["password"] ){
                if (views.get("username") == re["_id"] && views.get("password") == re["password"] ){ 
                console.log("passed");
                views.set("showdetails", false);   
                views.set("showLoading", false);
                storage.setString("pin", re["pin"]);
                storage.setString("registered", "true");
                storage.setString("name", re['name']);
                storage.setString("_id", re["_id"]); 
                storage.setString("email", re["email"]);
                 views.set('showLaoding', false);
                resolve("success");  
                }else{
                 views.set("showdetails", true);                  
                 views.set("details", "Sorry we do not recognize this account, Username or password is incorrect" );
                 views.set("showLoading", false);
                 views.set("password", "");
                reject("No authorized")
                }
                             
            }).catch((err)=>{
            console.log(err)
            views.set("showdetails", true);
            storage.setString("registered", "false");
            views.set("details", "Sorry we do not recognize this account" );
            views.set("showLoading", false);
             views.set("password", "");
            reject("Not Recognized");
            });
     
        

        }
        else{
            console.log("fail to run")
            views.set("showdetails", true);
            views.set("password", "");
            views.set("showLoading", false);
            views.set("details", "Both username and password are important" );
            reject("No Value");
        };
    });
};
return views;
};
module.exports = signin;
