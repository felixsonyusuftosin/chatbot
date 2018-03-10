var config = require('../shared/config');
var fetchModule = require("fetch");
var storage = require("application-settings");
var http = require("http")
//var twilio = require("twilio");
var Observable = require("data/observable").Observable;
function signup(obj){
obj = obj || {};
var views = new Observable({
    username :obj.username  || "",
    telephone : obj.telephone || "",
    password : obj.password || "",
    name : obj.name || "",
    showLoading:false,
    showdetails:false,
    otp:null

});
var otp = Math.floor(Math.random() * Math.random() * 1004560);
views.set('otp', otp);
console.log(otp);
views.set("showLoading", false);
views.checkregistered = function(){
  views.set('showLaoding', true);
return new Promise(function(resolve, reject){  
   if (views.get("username") != "" &&  views.get("telephone") != "" && views.get("password") != "" &&  views.get("name") != ""){
    views.set('showLaoding', true);
   var  obj =   {username: views.get("username"),  _id:views.get("telephone"), telephone:views.get("telephone"), email: views.get("username"),   password: views.get("password"),   name: views.get("name") }
   var url = theurl = config.remote + '/' + views.get("telephone");
   views.gotourl(url,obj).then((data)=>{
       data.username = views.get("username");
       data._id = views.get("telephone")
       data.telephone = views.get("telephone");
       data.email = views.get("username");
       data.password =views.get("password");
       data.name = views.get("name");
    views.puttourl(url,data).then((result)=>{
    storage.setString("_id", result.id);   
    storage.setString("rev", result.rev);
    storage.setString("username", views.get("username"));
    storage.setString("telephone", views.get("telephone"));
    storage.setString("email", views.get("username"));
    storage.setString("password", views.get("password"));
    storage.setString("name", views.get("name"));    
     views.set("showLoading", false);           
     resolve(result);
    }).catch((err)=>{
       reject(err);
})

   }).catch(()=>{
    http.request({
        url: config.rem,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify( obj )
    }).then ((res)=>{
    console.dump(res);
    console.log("This is res next is result")
    var result = JSON.parse(res.content);
    console.dump(result)
    storage.setString("_id", result.id);   
    storage.setString("rev", result.rev);
    storage.setString("username", views.get("username"));
    storage.setString("telephone", views.get("telephone"));
    storage.setString("email", views.get("username"));
    storage.setString("password", views.get("password"));
    storage.setString("name", views.get("name"));    
    views.set("showLoading", false);           
    resolve(res);
    })
	.catch((err)=>{console.log(err)   
        views.rest();
          views.set("showLoading", false);   
        reject(err);
    
})//catch
})//new post
}//checkif
else{
  views.reset();
  reject("all fields are important")
  views.set("showdetails", true);  
    views.set("showLoading", false);   
}//else empty values
})//promise
}//registered
views.reset = function(){
   views.set("username","");
    views.set("telephone", ""); 
    views.set("password", "") ; 
    views.set("name","");
};//reset
views.sendsms = function(){
return new Promise((resolve, reject)=>{
views.set("showLoading", true); 
console.log('started')
var telephone = views.get("telephone");
var message  = "Welcome to sprint Loans 24, Please use the following code as your OTP  "+otp+" Note this  expires after 10 Minutes";
var strurl = 'http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+config.owneremail+'&subacct='+config.subacct+'&subacctpwd='+config.subacctpassword+'&message='+message+'&sender='+config.sender+'&sendto='+telephone+'&msgtype=0'
console.log(strurl); 
http.request({ url: strurl, method: "GET" }).then((res)=>{
console.dump(res)
views.set("showLoading", false);
storage.setNumber("otp",otp)
views.reset();
resolve(true);
})
.catch((err)=>{
    console.dump(err);
    views.set("showLoading", false);
    storage.setNumber("otp",otp)
       views.set("username","");
        views.set("telephone", ""); 
        views.set("password", "") ; 
        views.set("name","");
    resolve(true);
})

})
}//sendsms
views.gotourl = function(urll,data){
  return new Promise(function(resolve,reject){
         http.request({
           url: urll,
           method: "GET",
           headers: { "Content-Type": "application/json" }
          }).then((docs)=>{
                var cont = JSON.parse(docs.content);
                try{
                 if (cont.error){
                    var rej = cont.error;
                    reject('not found');
                }else{
                       
                        resolve(JSON.parse(docs.content));  
                    }
                }catch(err){
                     reject('not found')
                }    
          }).catch(err=>{
              reject(err);
          })

  });
}
views.puttourl = function(urll,data){
  return new Promise(function(resolve,reject){
         http.request({
           url: urll,
           method: "PUT",
           headers: { "Content-Type": "application/json" },
           content: JSON.stringify( data )
          }).then((docs)=>{
              console.log('put to url succeeded................. ...................../')
                console.dump(JSON.parse(docs.content));
                resolve(JSON.parse(docs.content));
                

          }).catch(err=>{
              console.log("Error could not put to url");
              console.log(err)
              reject(err);
          })

  });
}
    return views;
}//signup

module.exports = signup;
