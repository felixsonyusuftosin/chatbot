var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var labelModule = require("ui/label");
var layout = require("ui/layouts/grid-layout");
var enums = require("ui/enums");
exports.pageLoaded = function(args){
var item = new imageModule.Image();
var lbl = new labelModule.Label();
var page = args.object;
var grid = page.getViewById("logocontainer");
item.src = "~/images/Logo_name5.png";
item.height = 150;
item.opacity = 1;
item.row = 2;
item.column = 2;
item.translateY  = -500;
item.verticalAlignment = "center";
item.horrizontalAlignment = "center";
item.on("loaded", function (args) {            
          args.object.animate({
                translate:{x:0, y:600},
                 opacity:0,
                duration: 1,
                curve: enums.AnimationCurve.easeIn
            })
          .then(function () {              
                return args.object.animate({          
                translate: {x:0, y:200},
                 opacity:1,
                duration: 900,
                curve: enums.AnimationCurve.easeIn                     
                });
            })
      .then(function () {              
                return args.object.animate({                                 
                     duration: 500, 
                     rotate:90,
                     curve: enums.AnimationCurve.easeIn                        
                });
            })
            .then(function () {
                // Fade out the logo
                return args.object.animate({                                        
                    scale: {x:1, y:1},
                    duration: 200,
                    rotate:-360, 
                     curve: enums.AnimationCurve.spring
                  
                });
            })
             .then(function () {
                // Fade out the logo
            return args.object.animate({                                        
                    opacity: 1, 
                    duration: 500,         
                     curve: enums.AnimationCurve.easeIn
                  
                });
            })
            .then(function () {               
                // Navigate to the starting page. In the case of Groceries.
                // this is the login page  
                   var topmost = frameModule.topmost();
                   topmost.navigate("views/login/login");
                    animated: true
           
            });


});//item loaded


    grid.addChild(item);
};//loaded exprts