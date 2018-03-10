var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var labelModule = require("ui/label");
var buttonModule = require("ui/button")
var layout = require("ui/layouts/grid-layout");
var enums = require("ui/enums");
exports.pageLoaded = function(args){
var item = new buttonModule.Button();
item.className = "btn";
item.text = "Get Started";
var page = args.object;
var grid = page.getViewById("btnhold");
item.on("loaded", function (args) {   
          args.object.animate({
                translate:{x:0, y:300},
                              
                duration: 1,
                 opacity:0.2,
                 scale:{x:0.6, y:0.6},
                curve: enums.AnimationCurve.easeIn
            })
          .then(function () {              
                return args.object.animate({          
                translate: {x:0, y:0},                
                duration: 1400,
                 opacity:1,
                  scale:{x:1, y:   1},
                curve: enums.AnimationCurve.easeIn                     
                });
            })


});
grid.addChild(item);
item.on(buttonModule.Button.tapEvent, function (eventData) {
      var topmost = frameModule.topmost();
     topmost.navigate("views/signinform/signinform");
      animated: true
},this);
exports.login = function(){
      var topmost = frameModule.topmost();
     topmost.navigate("views/signinform/signinform");
      animated: true
}

}