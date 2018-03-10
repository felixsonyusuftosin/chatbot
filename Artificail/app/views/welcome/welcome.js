var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var labelModule = require("ui/label");
var layout = require("ui/layouts/grid-layout");
var enums = require("ui/enums");
var storage = require("application-settings");
var AnimationModule = require("ui/animation");
var pageglobe;
exports.pageLoaded = function(args){
var page = args.object;
pageglobe = page;

var container = page.getViewById("logocontainer2");
 var two = page.getViewById("two");
 var three = page.getViewById("three");
 var four = page.getViewById("four");
 var five = page.getViewById("hh")
var definitions = new Array();

var a2 = {   target:two ,   scale: {x:1, y:1},    translate: {x:0, y:0},     opacity:1,    duration: 150,    curve: enums.AnimationCurve.easeIn     };
    definitions.push(a2);
/*var a22 = {    target:two,     scale:{x:1, y:1},       duration: 100,     curve: enums.AnimationCurve.easeIn     };
    definitions.push(a22);*/
var a3 = {    target:three,    translate: {x:0, y:0},    scale: {x:1, y:1},    opacity:1,    duration:150,    curve: enums.AnimationCurve.easeIn     };
    definitions.push(a3);

 var a1 = {    target:container ,    scale:{x:1,y:1},    backgroundColor: "#161e3d",    delay:30,    duration: 150,    curve: enums.AnimationCurve.easeIn     };
    definitions.push(a1);
var a4= {    target:four,    opacity:1,    duration: 1000,    curve: enums.AnimationCurve.easeIn     };
    definitions.push(a4);

var a5 = { target:five, duration:800,  translate: {x:0, y:0},   curve: enums.AnimationCurve.easeIn }
      // definitions.push(a5);
   var animationSet = new AnimationModule.Animation(definitions,true);
animationSet.play().then(function () {
    console.log("Animation finished");
})
    .catch(function (e) {
    console.log(e.message);
});

};//loaded exprts

exports.login = function(){
var d2 = new Array();
var container = pageglobe.getViewById("logocontainer2");
 var two = pageglobe.getViewById("two");
 var three = pageglobe.getViewById("three");
 var four = pageglobe.getViewById("four");
var b2 = {   target:two ,    translate: {x:4000, y:0},     opacity:0,    duration: 300,    curve: enums.AnimationCurve.easeIn   };
    d2.push(b2);
var b3 = {   target:three ,    translate: {x:-4000, y:0},     opacity:0,    duration: 250,    curve: enums.AnimationCurve.easeIn   };
    d2.push(b3);
var b3 = {   target:three ,    translate: {x:4000, y:0},     opacity:0,    duration: 250,    curve: enums.AnimationCurve.easeIn   };
    d2.push(b4);
var b4 = {   target:four ,    translate: {x:-4000, y:0},     opacity:0,    duration: 200,    curve: enums.AnimationCurve.easeIn  };
    d2.push(b4);
var b1 = {   target:container ,    backgroundColor: "#fff",       duration: 750,    curve: enums.AnimationCurve.easeIn   };
    d2.push(b1);

/*var anim = new AnimationModule.Animation(d2,true);
anim.play().then(function () {*/
    var topmost = frameModule.topmost();
var  navigationEntry = {}
if (!storage.getString("registered") || storage.getString("registered") != "true"  ||  storage.getString("pin") == ""  ||  ! storage.getString("pin") ){
 navigationEntry = {
    moduleName: "views/signinform/signinform",
    animated: true,
        transition: {
        name: "slideTop",
        duration: 250,
        curve: "easeIn"
    }
};
}else{
   navigationEntry = {
    moduleName: "views/mainpage/mainpage",
    animated: true,
        transition: {
        name: "slideTop",
        duration: 250,
        curve: "easeIn"
    }
};  
}
topmost.navigate(navigationEntry);
/*})
    .catch(function (e) {
    console.log(e.message);
});*/
}