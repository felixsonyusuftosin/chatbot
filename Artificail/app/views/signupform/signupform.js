var viewModel = require("../../shared/viewmodel");
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var signupuser = new viewModel();


exports.pageLoaded = function(args){

var page = args.object; 
var grid = page.getViewById("btnhold");
 page.bindingContext = signupuser;

}

exports.realsignup = function(){
    signupuser.checkregistered()
     .then(function() {
            console.log("success");  
            signupuser.sendsms().then(()=>{
            auth();
            }).catch(function(error) {
            console.log(error);
             dialogsModule.alert({
                message: "Could not send SMS, please check your internet settings",
                okButtonText: "OK"
             });
         auth();
        });
        })
    .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                 title: "Error",
                message: "Unfortunately we could not process your account your account or this account already exists.",
                okButtonText: "OK"
            });
           // return Promise.reject(); 
        });
}

function auth(){
      var topmost = frameModule.topmost();
      var navigationEntry = {
      moduleName: "views/auth/auth",
    animated: true,
        transition: {
        name: "slideLeft",
        duration: 280,
        curve: "easeIn"
    }
};
topmost.navigate(navigationEntry);
}