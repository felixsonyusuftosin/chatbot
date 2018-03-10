var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var labelModule = require("ui/label");
var buttonModule = require("ui/button")
var layout = require("ui/layouts/grid-layout");
var viewModel = require("../../shared/signinmodel");
var dialogsModule = require("ui/dialogs");
var layout = require("ui/layouts/grid-layout");
var enums = require("ui/enums");
var signinuser = new viewModel();
var AnimationModule = require("ui/animation");
exports.pageLoaded = function(args){
var item = new buttonModule.Button();
item.className = "btn";
item.text = "Get Started";
var page = args.object;
 page.bindingContext = signinuser;
var grid = page.getViewById("btnhold");

var one =  page.getViewById("one");
var definitions = new Array();
var a2 = {   target:one ,       translate: {x:0, y:-120},     opacity:1,    duration: 200,    curve: enums.AnimationCurve.easeIn     };
    definitions.push(a2);
 var animationSet = new AnimationModule.Animation(definitions,true);
animationSet.play().then(function () {
    console.log("Animation finished");
})
.catch(function (e) {
    console.log(e.message);
});

}
exports.signinm = function(){
      signinuser.signinnow()
    .then((dat)=>{
        console.log(dat);
       var topmost = frameModule.topmost();
      var navigationEntry = {
      moduleName: "views/mainpage/mainpage",
    animated: true,
        transition: {
        name: "slideTop",
        duration: 380,
        curve: "easeIn"
    }
};
topmost.navigate(navigationEntry);
    }).catch((err)=>{
        console.log(err)
    })

}
exports.home = function(){
      var topmost = frameModule.topmost();
      var navigationEntry = {
      moduleName: "views/mainpage/mainpage",
    animated: true,
        transition: {
        name: "slideTop",
        duration: 380,
        curve: "easeIn"
    }
};
topmost.navigate(navigationEntry);
}
exports.signup = function(){
      var topmost = frameModule.topmost();
      var navigationEntry = {
      moduleName: "views/signupform/signupform",
    animated: true,
        transition: {
        name: "slideTop",
        duration: 380,
        curve: "easeIn"
    }
};
topmost.navigate(navigationEntry);
}



