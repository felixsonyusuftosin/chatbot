var viewModel = require("../../shared/pinmodel");
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");
var authuser = new viewModel();

exports.pageLoaded = function(args){
var page = args.object; 
 page.bindingContext = authuser;

}

exports.confirm = function(){
    authuser.acknowledge()
     .then(function() {
            console.log("success");  
            pin();
            
        })
    .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                  message: "Sorry PIN Does Not Match ",
                okButtonText: "OK"
            });
            return Promise.reject(); 
        });


}
function pin(){
      var topmost = frameModule.topmost();
      var navigationEntry = {
      moduleName: "views/signinform/signinform",
    animated: true, 
        transition: {
        name: "slideBottom",
        duration: 380,
        curve: "easeIn"
    }
};
topmost.navigate(navigationEntry);
}
