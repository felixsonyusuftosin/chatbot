var viewModel = require("../../shared/authmodel");
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var authuser = new viewModel();
exports.pageLoaded = function(args){
var page = args.object; 
 page.bindingContext = authuser;
};

exports.authenticate = function(){
    authuser.acknowledge()
     .then(function() {
            console.log("success");  
            pin() ;
            
        })
    .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                  message: "Sorry OTP records entered is not correct",
                okButtonText: "OK"
            });
            return Promise.reject(); 
        });


}
function pin(){
      var topmost = frameModule.topmost();
      var navigationEntry = {
      moduleName: "views/pin/pin",
    animated: true,
        transition: {
        name: "slideLeft",
        duration: 380,
        curve: "easeIn"
    }
};
topmost.navigate(navigationEntry);
}
