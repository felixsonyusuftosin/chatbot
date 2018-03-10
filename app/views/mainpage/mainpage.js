var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var labelModule = require("ui/label");
var buttonModule = require("ui/button");
var Slider = require("ui/slider");
var slider2 = require("ui/slider")
var layout = require("ui/layouts/grid-layout");
var viewModel = require("../../shared/pinauth");
var dialogsModule = require("ui/dialogs");
var pageModule = require('ui/page');
var layout = require("ui/layouts/grid-layout");
var enums = require("ui/enums");
var pinmodel = new viewModel();
var SShare = require("nativescript-social-share");
var imageSourceModule = require("image-source");
var AnimationModule = require("ui/animation");
var application = require("application");
var Observable = require("data/observable").Observable;
var gpage;
var webViewModule = require("ui/web-view");

require("nativescript-dom");
exports.pageLoaded = function(args){

    var page = args.object;
    gpage = page;
     page.bindingContext = pinmodel;
    pinmodel.showpin();

    /*var p = page.getViewById("pin",function(){
         p.notify({eventName: "tap", object: p});
    });*/
    var p = page.getViewById("pin");
    p.focus();    
   slider2.minValue = 1000;
   slider2.maxValue = pinmodel.eligibility;  
   Slider.minValue = 0;
   Slider.maxValue = 1500000;
   Slider.value = 10,000;
   pinmodel.selectbank()
   .then((t)=>{
page.getViewById("bankpicker").addEventListener(
    Observable.propertyChangeEvent, function(e) {
      if (e.propertyName == "selectedIndex") {
   /* console.log('evalue...................................../')
    console.dump(e)
      console.dump(e);*/
       var mm = pinmodel.banklist[e.value];
       console.dump(mm)
       pinmodel.selectedbank = mm['name']
       pinmodel.bank_code = mm['code']
       console.log(pinmodel.selectedbank);
      }
    })
   })
   .catch((e)=>{
       console.log(e)
   })
}//page
exports.switch = function(args){
try{ 
var node =  args.object.objNode;
console.log(node)
pinmodel.version(node);
}catch(err){console.log(err);}
console.dump(pinmodel.profile);
console.log('.......................................');
  var definitions = new Array();
  var otherright = gpage.getViewById("otherright");
pinmodel.switchint().then((dat)=>{      

if (dat){
     pinmodel.submenu = dat;
var a2 = {    target:otherright,   translate: {y:0,  x:0},    duration:250,     curve: enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)   };
definitions.push(a2);
var animationSet = new AnimationModule.Animation(definitions,true);
animationSet.play().then(function () {
    console.log("datsall");
})
    .catch(function (e) {
    console.log(e.message);
});
}else{
var a3 = {    target:otherright,    translate: {y:0, x:400},   duration:250,    curve:enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)     };
definitions.push(a3);
var animationSet = new AnimationModule.Animation(definitions,true);
animationSet.play().then(function () {
    console.log("datsnotall");
     pinmodel.submenu = dat;
})
    .catch(function (e) {
    console.log(e.message);
}); 
}//
  }).catch((err)=>{console.log(err)})
}//switch




exports.switchview = function(){

  var definitions = new Array();
  var otherright = gpage.getViewById("otherright");
pinmodel.switchint().then((dat)=>{   
if (dat){
     pinmodel.submenu = dat;
var a2 = {    target:otherright,   translate: {y:0,  x:0},    duration:250,     curve: enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)   };
definitions.push(a2);
var animationSet = new AnimationModule.Animation(definitions,true);
animationSet.play().then(function () {
    console.log("datsall");
})
    .catch(function (e) {
    console.log(e.message);
});
}else{
var a3 = {    target:otherright,    translate: {y:0, x:400},   duration:250,    curve:enums.AnimationCurve.cubicBezier(0.1, 0.1, 0.1, 1)     };
definitions.push(a3);
var animationSet = new AnimationModule.Animation(definitions,true);
animationSet.play().then(function () {
    console.log("datsnotall");
     pinmodel.submenu = dat;
})
    .catch(function (e) {
    console.log(e.message);
}); 
}//
  }).catch((err)=>{console.log(err)})
}//switch








exports.log = function(){
     //pinmodel.version("profile");
      pinmodel.check().
      then((dat)=>{
        console.log(dat);
        pinmodel.hidepin();
      }).catch((err)=>{console.log(err)})

}//sig

exports.btntap  = function(args){
  var button = args.object;  
  try{ 
var node =  args.object.objNode;
pinmodel.version(node);
}catch(err){console.log(err);}
  if ( pinmodel.submenu){
      pinmodel.submenu = false;
  }
  gpage.runAgainstClasses('bel', function(elem) {  
      elem.classList.remove('active');
  });  
    button.classList.insert('active');
     
}

application.on(application.resumeEvent, function (args) {
      pinmodel.showpin();


})//application proceedpayment
 exports.proceedpayment = function(){
     pinmodel.verifytransact()
     .then(()=>{
         exports.switchview();  
         pinmodel.submenu = false;       
     }).catch((err)=>{console.log(err)})
 }
 exports.proceedpayment2 = function(){
     pinmodel.verifytransact2()
     .then(()=>{
         exports.switchview();  
         pinmodel.version('returnfinal');
         pinmodel.submenu = false;       
     }).catch((err)=>{console.log(err)})
 }
 exports.pay = function() {
if (! pinmodel.havedetails == "true"){
 exports.switchview();
 pinmodel.paystacktransfer()
 .then((d)=>{ 
     //var w = gpage.getViewById("pays");
    var w = gpage.getViewById("payview"); 
    console.log(d)
     w.url = d;
  
    console.log('webview ' +pinmodel.request.child3)
    // console.dump(w)
 }).catch((err)=>{console.log(err)}); 
}else{
    pinmodel.verifycharge().then(()=>{
          pinmodel.version('confirmpay');
    }).catch((err)=>{console.log(err)}); 

}
 }



 exports.paydebit = function() {

 exports.switchview();
 pinmodel.paystacktransfer2()
 .then((d)=>{ 
     //var w = gpage.getViewById("pays");
    var w = gpage.getViewById("payview2"); 
    console.log(d)
     w.url = d;  
    console.log('webview ' +pinmodel.request.child3)
    // console.dump(w)
 }).catch((err)=>{console.log(err)}); 

 }








exports.registerbvn = function(){
/*click to registerbv */

    pinmodel.process('step1')
    .then((obj)=>{
        if (obj != 'finalize'){
        pinmodel.nextotp();
        }else{
          exports.switch();   
        }
    }).catch((obj)=>{
        console.dump(obj)
        
    })
}
exports.registeraccount = function(){

};
exports.setret = function(){
    pinmodel.setreturn() 
}
exports.registerotp = function(){
    if (pinmodel.otp != ""){
    pinmodel.process('step2') .then((obj)=>{
        pinmodel.nextotp2();
    }).catch((obj)=>{
         pinmodel.otperror();
    })
}else{
    pinmodel.otperror();

    }
}

exports.share = function(){
    console.log('sharing');
        var image = imageSourceModule.fromFile('~/images/Logo_name2.png');
             
        SShare.shareText("Get the Sprintlaons App! Get the sprint loans app, and access quick loans fast and secure, with linient repayment conditions this application will be launched on playstore in the nearest future watch out?");
         SShare.shareImage( image, "Please Check out Sprintlaons on play store")  

}



