var webViewModule  = require( "tns-core-modules/ui/web-view");
var config = require('../shared/config');
var fetchModule = require("fetch");
var storage = require("application-settings");
var http = require("http");
var DDD = require("crypto-js/tripledes")
var My = require("../shared/encrypt");
var ln = new Array();
//var paystack = require('paystack')(config.paystacktest); 
var CryptoJS = require('crypto-js');
var forge    = require('node-forge');
var utf8     = require('utf8'); 
//var twilio = require("twilio");
var Observable = require("data/observable").Observable;
function checkstat(obj){
obj = obj || {};
var views = new Observable({
    pin : storage.getString("pin"),  
    showpin : false,
    notcorrect: false , 
    suppliedpin: obj.pin || "",
    pinshow:false,
    name:storage.getString('fullname'),
    submenu:false,
    loading: false,
    proceed:false,
    transactioninfo : "",
    bvn:obj.bvn || "",
    account:obj.account || "",
    otp:obj.otp || "",
    error:false,
    banks:[],
    banklist:[],
    owing:"",
    topay:false,
    src:'',
    owingexplain:"",
    owingdetails1:"",
    owingdetails2:"",
    owingdetails3:"",

	selectedbank:"",
    reference:"",
    havedetails:"",
    bank_code:"",
    bank_name:"",
    transactionReference: "",
    errortext:"",
    points:30,
    bvnstat:false,
    displaybvn:null,
    accountstat:false,
    displayaccount:null,
    eligibility:"",
    returndate:"",
    maxval :10000,
    selectedamount:null,
    wview:false,
    bankstat:false,
    displaybank:"",
    recipient_code:"",
    allverified:false,
    explanation1:"To improve your your points you can share on social media, supported media includes Facebook, Instagram, LinkedIn and Twitter.",
     explanation2:"When you share this app on these platform you earn you additional 5 points each. And your loan conditions are affected towards liniency.",
   explanation3:" Each platform has a  rating of 3 points each also  when you default on repayment we will deduct 10 points which will affect, the amount you can burrow", 
    explanation4:"A total point of 100 qualifies you for a loan of upto N40,000. While a total point of 30 Qualifies you for a loan of N10,000  repayment period also depends on your point but generally its below one month for quick loans",
  
    
    
    profile : {main : true, child1 : false, child2 : false, child3:false, child4:false} || null, 
    request: {main : false, child1 : false, child2 : false, child3:false, child4:false} || null, 
    return : {main : false, child1 : false, child2 : false, child3:false, child4:false} || null,
     details : {main : false, child1 : false, child2 : false} || null,  
    messages : {main : false, child1 : false, child2 : false} || null,
     settings : {main : false, child1 : false, child2 : false} || null
});
views.setowing = function(){
    views.set('owingexplain', "You can not access multiple loans unless you return your outstanding")
    views.set('owingdetails1', "Your outstanding is  N"+views.get('owing') );
    views.set('owingdetails2', "Please pay back on or before " +views.get('returndate'));
    views.set('owingdetails3', "You can return at anytime if you wish to please click the button below to perform your tansaction, note, points goes to early return.");
}
views.setreturn = function(){
var currentDate = new Date()
var day = currentDate.getDate()
var month = currentDate.getMonth() + 2
var year = currentDate.getFullYear()
views.returndate =  day + " /" + month + " /" + year ;
views.version('parameters');
var el = parseFloat(views.eligibility) * 0.3 ;
var fine = el + parseFloat(views.eligibility);
views.set('returnvalue', fine.toString()) ; 
console.log(' fine.toString()')
console.log(views.returnvalue);
}
views.check = function(){
//console.log(DDD.encrypt('sending', config.ftestapikey));
views.seteligibility();
views.set("notcorrect", false);


return new Promise(function(resolve, reject){ 
   if (views.get("suppliedpin") != "" && views.get("suppliedpin") == storage.getString("pin") ){
        views.set("name",storage.getString('name'));    
       if (storage.getString('bvnVerified') == 'verified' && storage.getString('accountVerified') == 'verified' ){  
        try{
         views.set('reference', storage.getString('reference'));
         views.set('havedetails', storage.getString('havedetails'))
        views.set('owing', storage.getString('owing'));
        if (views.get('owing') != ""){
            views.set('topay', true);
             console.log('this shows you are owing'+views.get('owing'));          }
             views.set('returndate', storage.getString('returndate'));
        } catch(err){console.log(err);} 
        try{ 
          console.log('It starts now');        
           views.set('bvnstat', true);
           views.set('displaybvn', storage.getString('bvn'));
           views.set('accountstat', true);
           views.set('bankstat',true);
           views.set('displayaccount', storage.getString('account_number'));
            views.set('account', storage.getString('account_number'));
           views.set('displaybank', storage.getString('bank_code'));
           views.set('recipient_code',  storage.getString("recipient_code"));      
           views.set('selectedbank',  storage.getString("bank_name"));     
           views.set('displaybank', storage.getString("bank_name"));
           views.set('allverified', true);
           views.setowing();
           console.log('On show of the pin')
           console.log(views.get('allverified'));
           resolve(true);   
        }catch(err){console.log(err);}    
       }else{ 
         console.log('It didnt start');
        var theurl = config.accountinfo + '/' + storage.getString('_id');
         console.log( theurl);
		views.geturl(theurl)  
			.then((dd)=>{
                console.dump(dd);
                storage.setString('accountrev', dd['_rev']);                           
                try{		
                storage.setString("bvnVerified", "verified");
                storage.setString("bvn",dd.bvn);  
                views.set('bvnstat', true)
                views.set('displaybvn', dd.bvn);
                views.setupvar();
             
                }catch(err){
                    console.log(err)                    
                }
                try{
                  views.set("points", parseInt(dd['points']));
                }catch(err){
                    console.log(err);
                }

                try{
                views.set('displayaccount', dd["account_number"]);
                storage.setString('accountrev', dd['_rev']);
                storage.setString('account_number',  dd["account_number"] );
                storage.setString('account_name',  dd["account_name"] );
                storage.setString('accountVerified', dd['accountVerified']);
                views.set('accountstat',true)
                views.set('displaybank', dd['bank_code']);
                storage.setString('bank_code',  dd['bank_code'] );
                views.set('bankstat',true);
                views.setupvar();
                 }catch(err){
                  console.log(err)
                }
               try{
                views.set("recipient_code", dd['recipient_code']);
                storage.setString("recipient_code", dd['recipient_code']);
                
                }catch(err){
                    console.log(err);
                }  
                try{
                    storage.setString('reference', dd['reference'])
                    views.set('reference',dd['reference'] );
                    storage.setString('havedetails', dd['havedetails'])
                    views.set('havedetails',dd['havedetails'] );
                    storage.setString("owing", dd['owing']);
                    views.set('owing',dd['owing'] );
                     if (views.get('owing') != ""){
                               views.set('topay', true);
                               views.setowing();
                               console.log('this shows you are owing'+views.get('owing'));
                                views.setowing(); 
                           }
                    storage.setString('returndate', dd['returndate']);
                    views.set('returndate',dd['returndate'])
                }catch(err){
                    console.log(err);
                } 
				resolve(true);				
			}).catch((err)=>{	
                console.log(err)		
			});
       }
       resolve(true);         
     }//checkif
else{   
    views.set("notcorrect", true); 
     console.log(views.get("notcorrect" ) + " Not Correct")
     reject(false);   
}//else empty values
})//promise
}//registered
views.showpin = function(){
views.set("notcorrect", false);
 views.set("suppliedpin", "");
 views.set("pinshow",true)
 if (views.get('owing') != ""){
views.set('topay', true);
console.log('this shows you are owing'+views.topay);

          }
}//
views.version = function (obj){
    views.reset();
    if (obj  ==  "profile"){
        views.set("profile", {main: true, child1 : false, child2 : false,child3:false, child4:false} );
    }else if (obj == "bvn"){
        views.set("profile", {main: true, child1 : true, child2 : false,child3:false, child4:false});
    }else if (obj == "account"){
        views.set("profile", {main: true, child1 : false, child2 : true,child3:false, child4:false});
    }else if(obj == "otp"){
         views.set("profile", {main: true, child1 : false, child2 : false,child3:true, child4:false});
    }else if(obj == "confirmotp"){
        views.set("profile", {main: true, child1 : false, child2 : false,child3:false, child4:true});
    }
    else if (obj == "all"){
        views.set("profile", {main: true, child1 : true, child2 : true,child3:false, child4:false});
    }else if (obj == "return"){
        views.set("return", {main: true, child1 : false, child2 : false, child3:false, child4:false});
     }else if (obj == "returnpage"){
        views.set("return", {main: true, child1 : false, child2 : true, child3:false, child4:false});
     }else if (obj == "returnfinal"){
        views.set("return", {main: true, child1 : false, child2 : false, child3:false, child4:true});    
    }else if (obj == "request"){
        views.set("request", {main: true, child1 : true, child2 : false,child3:false , child4:false });
    }else if (obj == "parameters"){
        views.set("request", {main: true, child1 : false, child2 : true, child3:false , child4:false });
   } else if (obj == "confirm"){
        views.set("request", {main: true, child1 : false, child2 : false, child3:true, child4:false });
   } else if (obj == "confirmpay"){
        views.set("request", {main: true, child1 : false, child2 : false, child3:false, child4:true });
    } else if (obj == "response"){
        views.set("return", {main: true, child1 : false, child2 : true});
    }else if (obj == "details"){
        views.set("details", {main: true, child1 : true, child2 : true});
    }else if (obj == "messages"){
        views.set("messages", {main: true, child1 : true, child2 : true});
    }else if (obj == "settings"){
        views.set("settings", {main: true, child1 : true, child2 : true});
    }
 
}

views.nextotp = function(){
    views.set('loading',false);
     views.set('error',false);
      views.set('errortext',"");
    views.version("otp");
}
views.nextotp2 = function(){
    views.set('loading',false);
     views.set('error',false);
      views.set('errortext',"");
      views.set('bvnstat', true);
      views.switchint();
}
views.previousotp = function(){
    views.set('loading',false);
     views.set('error',false);
      views.set('errortext',"");
    views.version("all");
}
views.otperror  = function(){
   views.set('errortext', "Please enter the OTP Code sent to you");
   views.set('error',true);
}
views.process = function(obji){
    var obj = "step2";
    return new Promise(function(resolve,reject){
        if (views.get("bvn") != "" || views.get('displaybvn') != "" &&  views.get("account") != ""  ||  views.get('displayaccount') != "" && views.get("selectedbank") != "" ){
            views.set('loading',true);
             var sending = null;
              var urll = "";
              var url = "";
            if (obj == "step1"){   
                console.log("step1");
                 var cryptbvn = "";
                 var cryptotpoption = "";
                  views.encrypto(config.ftestapikey, views.get('bvn')).then((dat)=>{
                     console.log(dat);
                     cryptbvn = dat;
                     views.encrypto(config.ftestapikey, "SMS").then((dato)=>{
                        cryptoptoption = dato;                       
                         var sendit = { 'bvn': cryptbvn, 'otpoption':dato, 'merchantid':config.ftestmkey  };                          
                         sending = JSON.stringify(sendit); 
                         console.log('.....................................................................................logging send');
                        console.log(sending);                         
                     });//firstproise
                 })//second promise              
              }else{
                // var send = { 'bvn':DDD.encrypt(views.get('bvn'),config.ftestapikey) ,'otp':DDD.encrypt(views.get('otp'), config.ftestapikey), 'merchantid':config.ftestmkey, 'transactionReference': DDD.encrypt(views.get('transactionReference'), config.ftestapikey) }   
             // var sending =  encodeURI("bvn="+DDD.encrypt(views.get('bvn'), config.ftestapikey)+'&otp='+DDD.encrypt(views.get('otp'), config.ftestapikey)+'&transactionReference='+DDD.encrypt(views.get('transactionReference'), config.ftestapikey)+"&merchantid="+config.ftestmkey );
                // sending = JSON.stringify(send);   
                sending = {};
             }
           
            if (obj == "step1"){
             // urll = "https://authbvn.herokuapp.com/authbvn/api/v1.0/verify";
              // urll = "http://staging1flutterwave.co:8080/pwc/rest/bvn/verify/";
               urll =  "https://api.paystack.co/bank/resolve_bvn/"
               url = urll + views.get('bvn');
            }else{
               //urll = "http://staging1flutterwave.co:8080/pwc/rest/bvn/validate/";
               urll =  "https://api.paystack.co/bank/resolve_bvn/"
               url = urll + views.get('bvn');
            }
            //console.dump(sending)
			var theurl = config.accountinfo + '/' + storage.getString('_id');
			views.geturl(theurl)           
			.then((dd)=>{
            if (!dd['error']){
              console.log('data gotten from string...')
              storage.setString('accountrev', dd['_rev']);
              if (! views.get('bvnstat')){
                  console.log('bvnstat is not set')
                    views.bvnsetup(urll,obj,sending).then((dat)=>{ 
                        if (obj == "step1"){
                            resolve(true);
                        }else{
                        storage.setString('bvnVerified', 'verified');
                        }
                    }).catch((err)=>{
                            views.set('loading',false)
                            views.set("errortext", "Sorry the bvn entered is not correct ");
                            views.set("error", true);                           
                            reject(false);
                      })
                }
                if (!views.get('displayaccount')){
                    console.log('setting up account...')
                     views.accountsetup().then((obj)=>{
                         views.setupvar();
                         resolve('finalize')}).catch(()=>{reject()})
                }
            }else{
                 if (obj == "step2"){
                views.bvnsetup(url,obj).then((obj)=>{
                    views.accountsetup().then(()=>{resolve('finalize')}).catch(()=>{reject()})
                }).catch((err)=>{
                            views.set('loading',false)
                            views.set("errortext", "Sorry the bvn entered is not correct ");
                            views.set("error", true);                           
                            reject(false);
                })
               }
            }
			   }).catch((err)=>{
               if (obj == "step1" ){
                  console.log('bvnstat is not set');
                     views.bvnsetup(url,obj,sending).then((dat)=>{ 
                        if (obj == "step1"){
                            storage.setString('bvnVerified', 'verified');
                            resolve(true);
                        }else{
                        storage.setString('bvnVerified', 'verified');
                        }
                    }).catch((err)=>{
                            views.set('loading',false)
                            views.set("errortext", "Sorry the bvn entered is not correct ");
                            views.set("error", true);                           
                            reject(false);
                      })
                }
                if (obj == "step2"){
                views.bvnsetup(url,obj,sending).then((obj)=>{
                    views.accountsetup().then(()=>{resolve('finalize')}).catch(()=>{reject()})
                }).catch((err)=>{
                    if (err){
                    if (err == 'bvnsetup required' ){
                        views.bvnsetup(url,obj,sending).then(()=>{
                            views.accountsetup().then(()=>{resolve('finalize')}).catch(()=>{reject()})
                        }).catch(()=>{reject()})
                    }
                    } else{
                        reject(err);
                    }
                })
               }
			});
        }else{
            views.set("errortext", "Please ensure all the required fields are supplied with your account details");
            views.set("error", true);
            reject(false)
        }
 
});//not registered
}//process

views.accountsetup = function(){
return new Promise(function(resolve,reject){
if (!views.get('accountstat')){//no account status registered
console.log('processing account...')
views.processaccount({bank_code:views.get('bank_code')})
.then((dat)=>{
 views.accounttoserver().then(()=>{
if (! storage.getString('recipient_code')){
    views.add_recipient().then(()=>{
    console.log('recipient added');
     if(views.get('bvnstat')){
       resolve(true)  
    }else{reject('bvnsetup required')}
}) .catch(()=>{ 
    views.set('loading',false)
     views.set("errortext", "Sorry we could not add you as a recipient, either your account already has being activated or its a server please contact customer care ");
    views.set("error", true);                           
    reject(false)
     });
      }//block recipient code not registered
    views.setupvar();
    }).catch(()=>{ 
    views.set('loading',false)
    views.set("errortext", "Sorry we could not upload your account details ensure it is correct, or check your internet serttings");
    views.set("error", true);
         reject(false)
    });//account registeration block
    }).catch((err)=>{
     console.log(err);
    views.set('loading',false)
     views.set("errortext", "Sorry we could not upload your account details ensure it is correct, or check your internet serttings");
     views.set("error", true);
      reject(false)
    })
    
     }	//account	
     else{
         reject('bvnsetup required');
     }
})
}//account setup
views.seteligibility = function(){
    try{
    if (views.get('points') ){
        var thepoint = views.get('points').toString();
        views.set('eligibility', config.eligibilityMapping[thepoint]);
    }
    }catch(err){
        console.log(err);
    }
}
views.bvnsetup =  function(urll, objj,sending){
    var obj = "step2";
    return new Promise(function(resolve, reject){
     if (!views.get('bvnstat')){
           console.dump(sending);
           console.log("Second stage sending..."); 
            views.processbvn(urll, obj,sending).then((data)=>{   
             if (obj == "step2"){
                 resolve(true);
             }   
             else{               
             if (obj == "step1"){
               views.add_recipient().then(()=>{
                console.log('recipient added');
                 resolve(true)
                }) .catch(()=>{ 
                views.set('loading',false)
                views.set("errortext", "Sorry we could not add you as a recipient, either your account already has being activated or its a server please contact customer care ");
                views.set("error", true);
                reject(false)
                 });
                }
             }
             			
				 }).catch((err)=>{
					 reject(err);
				 })
                }
                else{
                    resolve(true); 
                }
})

}

views.accounttoserver = function(){
return new Promise(function(resolve,reject) { 
  var obj = {}
  obj.account_number = storage.getString('account_number');
  obj._id = storage.getString("_id");
  obj.account_name = storage.getString('account_name');
  obj.bank_code = storage.getString('bank_code');
  views.geturl(config.accountinfo + '/'+ storage.getString("_id"))
  .then((data)=>{
   console.log('data to be put to url');   
  data['account_number'] = views.get('account'); 
  data['account_name'] = storage.getString('account_name');
  data['bank_code'] = storage.getString('bank_code'); 
  data['bank_name'] = views.get('selectedbank'); 
  data['accountVerified'] = 'verified'; 
  data["points"] = "10";
  views.set("points", 10); 
  console.dump(data);
  storage.setString('bank_name',views.get('selectedbank'));
  views.puttourl(config.accountinfo + '/'+ storage.getString("_id"), data).then((d)=>{ console.log('put to url response'); console.dump(d); storage.setString('accountVerified', 'verified'); resolve(true)}).catch((err)=>{ console.log(err); reject()})
  }).catch(()=>{
      views.gotourl(config.accountinfo,obj).then((dat)=>{ storage.setString('accountVerified', 'verified'); resolve(true)}).catch(()=>{reject()})
  })

});
}//accounttoserver
views.recipienttoserver = function(){
return new Promise(function(resolve,reject) { 
  var obj = {}
  obj.recipient_code = storage.getString('recipient_code');  
  obj._id = storage.getString("_id");
  views.geturl(config.accountinfo + '/'+ storage.getString("_id"))
  .then((data)=>{
   console.log('got cloudant data from db');
   console.dump(data);  
    data['recipient_code'] = storage.getString('recipient_code');  
    console.dump(data)
    console.log('that is modified data to be put') 
    views.puttourl(config.accountinfo + '/'+ storage.getString("_id"), data).then((dat)=>{console.dump(dat); console.log('push result'); storage.setString('recipientVerified', 'verified'); resolve(true)}).catch((err)=>{console.log(err);reject()})
  }).catch(()=>{
    views.gotourl(config.accountinfo,obj).then((dat)=>{resolve(true)}).catch(()=>{reject()})
  })
});
}//accounttoserver
views.processaccount = function (obj){
        var urll = "https://api.paystack.co/bank/resolve?account_number="+views.get('account')+"&bank_code="+obj.bank_code
        console.log(urll);
    	return new Promise(function(resolve,reject) { 
        http.request({
           url: urll,
           method: "GET",
           headers: {  authorization: "Bearer " + config.paystacktest }
          }).then((docs)=>{     
                console.log('.................processaccount');
                console.dump(docs);          
              var content = JSON.parse(docs.content);        
			  if (content.status || !content.status){ //edit this place paystack api end is down
                  var data = content['data']
                /*views.set('displayaccount', data["account_number"]);
                storage.setString('account_number',  data["account_number"] )
                storage.setString('account_name',  data["account_name"] )*/ 
                //this line is to replace preceeding one when stupid paystack edits there api end............................................................................/

                views.set('displayaccount', views.get('account'));
                storage.setString('account_number', views.get('account') )
                storage.setString('account_name', views.get('name') );

                //this line is only temprorary as a work around as paystack API is not working it contains error and it is so sossos soososos anoying...../

                views.set('accountstat',true)
                views.set('displaybank', obj.bank_code);
                storage.setString('bank_code',  obj.bank_code );
                views.set('bankstat',true);
                views.switchint();
                resolve(true);
				}else{console.dump(content.message);
				reject(content.message);	
				}
          }).catch(err=>{
              reject(err);
          })

 
        });
}
views.add_recipient = function(){
 var urll = "https://api.paystack.co/transferrecipient"
 return new Promise(function(resolve,reject) {  
 var tosend = {
   "type": "nuban",
   "name": storage.getString('account_name'),
   "description": "Customer",
   "account_number":storage.getString('account_number'),
   "bank_code": storage.getString('bank_code'),
   "currency": "NGN",
   "metadata": {
      "name": storage.getString('account_name'),
    } }//tosend
    http.request({
           url: urll,
           method: "POST",
           headers: { "Content-Type": "application/json", authorization: "Bearer " + config.paystacktest  },
           content: JSON.stringify( tosend )
          }).then((docs)=>{
                console.log('.................addrecipient');
                console.dump(docs);
                var content  = JSON.parse(docs.content);
                if (content.status){
                      console.log('recipien_added successfully');
                      var data = content['data']
                      views.set("recipient_code", data['recipient_code']);
                      storage.setString("recipient_code", data['recipient_code']);
                      views.recipienttoserver().then((doc)=>{
                          console.log(JSON.parse(doc).content);
                          views.switchint();
                          resolve(true);
                      }).catch(()=>{
                         reject(content['message']); 
                      })                  
                     
                }else{
                    reject(content['message']);
                }     
         

          }).catch(err=>{
              reject(err);
          })

 
});
}
views.processbvn = function(urll, objj,sending) { 
    var obj = "step2";
    console.log(urll);
    console.log("Getting request from paystack accross");
	return new Promise(function(resolve,reject) {    
          if ( !views.get('bvnverified') != "verified"){ 
              console.log('getting from paystack');
			   http.request({
                url:urll,
                method:"GET",
                headers: {  authorization: "Bearer " + config.paystacktest }
                 //headers: { 'content-type': 'application/x-www-form-urlencoded' },
                 //content:sending 
                }).then((docs)=>{
                console.dump(docs);
                var doc = JSON.parse(docs['content']);
                console.log('dumping response read here ..............................................................................................');
                console.dump(doc);
                 if (obj == "step1"){  
                    obj = "step2"             
                 /*if (doc['status'] == 'success'){
                  var dat = doc['data'];   
                  //storage.setString("bvnrefrence",dat['transactionReference']);
                  views.set('transactionReference', dat['transactionReference'] )
                  resolve(true);
                }else{
              views.set("errortext", "Sorry your request could not be completed at the moment");              
              views.set("error", true);
               views.set('loading',false);
              console.dump(err);
              reject(err);
                     }*/
              }else{ //step1 ends step2 begins
            if (doc['status']){                
                var dat = doc['data']
                console.log('loging dat in step2 ................................')
                console.dump(dat);
                views.gotourl(config.accountinfo, {_id :storage.getString('_id'), bvn:dat['bvn'],bvnVerified:'veirified' })
                .then((data)=>{
                console.log("returning data you heard");
                // console.dump(data);     
                views.set(' bvnstat', true)
                views.set('displaybvn', dat['bvn'] )          
                storage.setString("bvnVerified", "verified");
                storage.setString("bvn",dat['bvn']);
                views.setupvar();
                console.log('Exiting this bvn setup')
                resolve(true)
                }).catch((err)=>{
                views.set("errortext", "Sorry your request could not be completed at the moment");              
               views.set("error", true);
               views.set('loading',false);
               console.dump(err);
               reject(err)
                })
                
                   }else{
              views.set("errortext", "Sorry your request could not be completed at the moment");              
              views.set("error", true);
               views.set('loading',false);
              console.dump(err);
               reject(false);
                     }
              }//step2
            
             }).catch((err)=>{
              console.log('Error with flutterwave could not get parameters to send ');
              views.set("errortext", "Sorry your request could not be completed at the moment");              
              views.set("error", true);
               views.set('loading',false);
              console.dump(err);
              reject(err);
          }) 
          }else{
              resolve(true);
          }
		  
		  });
	
}    

views.selectbank = function(){
  return new Promise(function(resolve,reject){
	  var url = "https://api.paystack.co/bank"; 
	  views.getpaystack(url)
	  .then((dat)=>{
          /*var lis = ln;
          console.dump(lis)
          var lmf = lis.filter((it)=>{
             return it.name = dat;
       
          })
		  views.set("selectedbank", lmf[0].code);
          */
           views.set("banks",dat);
		  resolve(true)
	  }).catch((err)=>{
		  views.set("errortext", "Sorry please check your internet settings");
		   views.set("error", true);
           views.set('loading',false);
           console.log(err);
          reject(err);
	  })

  })//promise for selectbank  	
}//selectbank    
views.getpaystack = function(urll){
  return new Promise(function(resolve,reject){
         http.request({
           url: urll,
           method: "GET",
           headers: {  authorization: "Bearer " + config.paystackkey }
          }).then((docs)=>{               
              var content = JSON.parse(docs.content);        
			  if (content.status){
               var newlist = new Array();
                newlist = content.data.map((row)=>{
                      return row['name']
                })
                     var newlist2 = content.data.map((row)=>{
                      var obj = {}
                     var name = row['name'];
                     obj['name'] =  row['name'];
                     obj.code = row['code'];
                     return (obj); 
                      })
                 views.set('banklist', newlist2);
                 ln = newlist2;
                resolve(newlist);
				}else{
				console.dump(content.message)
				reject(content.message);	
				}
          }).catch(err=>{
              reject(err);
          })
		  
		  
  });
}

views.gotourl = function(urll,data){
  return new Promise(function(resolve,reject){
         http.request({
           url: urll,
           method: "POST",
           headers: { "Content-Type": "application/json" },
           content: JSON.stringify( data )
          }).then((docs)=>{
                resolve(JSON.parse(docs.content));
                console.log('from cloudant ....................................../')

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
views.geturl = function(urll){
  return new Promise(function(resolve,reject){
         http.request({
           url: urll,
           method: "GET",
           headers: { "Content-Type": "application/json" }         
          }).then((docs)=>{
              console.dump(JSON.parse(docs.content)); 
                resolve(JSON.parse(docs.content));
                console.log('from cloudant ....................................../')

          }).catch(err=>{
              reject(err);
          })

  });
}
views.reset = function(){
        views.set("profile", {main: false, child1 : false, child2 : false,child3:false, child4:false} );
        views.set('request', {main: false, child1: false, child2 : false});
        views.set('return', {main: false, child1: false, child2 : false});
        views.set("details", {main: true, child1 : false, child2 : false} );
        views.set('message', {main: false, child1: false, child2 : false});    
        views.set('settings', {main: false, child1: false, child2 : false});   


}
views.switchint = function(){
    views.set("loading", false);
    views.set("error", false);
    return new Promise(function(resolve, reject){
    if (views.get('submenu')){
        resolve(false);
       
    }else{
        resolve(true);
    }
    
    });
}
views.hidepin = function(){
 console.log("hidding")
 views.set("suppliedpin", "");
 views.set("pinshow",false)
}//
views.setupvar = function(){
    try{
           views.set('bvnstat', true);
           views.set('displaybvn', storage.getString('bvn'));
           views.set('accountstat', true);
           views.set('bankstat',true);
           views.set('displayaccount', storage.getString('account_number'));
            views.set('account', storage.getString('account_number'));
           views.set('displaybank', storage.getString('bank_code'));
           views.set('recipient_code',  storage.getString("recipient_code"));      
           views.set('selectedbank',  storage.getString("bank_name"));     
           views.set('displaybank', storage.getString("bank_name"));
           views.set('allverified', true);
           console.log('On show of the pin2')
           console.log(views.get('allverified2'));
    }catch(err){
        console.log(err)
    }
}//reset
views. encrypto = function(key, text) 
{
    return new Promise(function(resolve,reject){
	key  = CryptoJS.MD5(utf8.encode(key)).toString(CryptoJS.enc.Latin1);
	key     = key + key.substring(0, 8); 
	var cipher   = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
	cipher.start({iv:''});
	cipher.update(forge.util.createBuffer(text, 'utf-8'));
	cipher.finish();
	var encrypted = cipher.output; 
   // console.log(forge.util.encode64(encrypted.getBytes()));
	resolve ( forge.util.encode64(encrypted.getBytes())); 
    })
}
views.paystacktransfer = function(){
     return new Promise(function(resolve,reject){
    views.version('confirm');
    views.paystackrequest('one').then((d)=>{
    //console.log( 'authurl ' + d)
       //views.reset();
       //views.set("request", {main: true, child1 : false, child2 : true});
        var url =  d;
       resolve(url);       
    }).catch((err)=>{
       reject(err)
       console.log(err)

    })
      });
    
}
views.paystacktransfer2 = function(){
     return new Promise(function(resolve,reject){
    views.version('returnpage');
    views.paystackrequest('two').then((d)=>{
    //console.log( 'authurl ' + d)
       //views.reset();
       //views.set("request", {main: true, child1 : false, child2 : true});
        var url =  d;
       resolve(url);       
    }).catch((err)=>{
       reject(err)
       console.log(err)

    })
      });
    
}

views.verifytransact = function(){    
     return new Promise(function(resolve,reject){
         views.loading = true;
         var reference=  storage.getString('reference');
         http.request({
           url:'https://api.paystack.co/transaction/verify/'+ reference,
           method: "GET",
           headers: { authorization: 'Bearer '+ config.paystacktest}      
          }).then((docs)=>{ 
                views.loading = false;
                               
                var content2 = JSON.parse(docs.content); 
                var content = content2.data;             
                console.dump(docs.content);   
                if (content.status ) {
                    views.set('transactioninfo', content.message); 
                    
                    console.log(views.returnvalue);           
                    var returndata = content.data;
                 views.geturl(config.accountinfo + '/'+ storage.getString("_id"))
                   .then((data)=>{
                  data['havedetails'] =  'true'; 
                  data['owing'] = views.returnvalue;
                  data['returndate'] =views.returndate;
                  
                views.puttourl(config.accountinfo + '/'+ storage.getString("_id"), data).then((d)=>{ 
                    console.log('put to url response'); 
                    console.dump(d);
                    views.loading = false;
                   views.version('confirmpay'); 
                    storage.setString ('havedetails', 'true') 
                    storage.setString ('owing', views.returnvalue);
                    storage.setString ('returndate', views.returndate);
                    views.set('owing', views.returnvalue )
                    console.log('owing'+ views.returnvalue)
                    if (views.get('owing') != ""){
                       views.set('topay', true);
                       views.setowing();
                           console.log('this shows you are owing'+views.get('owing'));
                     }
                    resolve(true);
                    })
                    .catch((err)=>{ console.log(err); reject(err)})
                })   .catch((err)=>{ console.log(err); reject(err)})
                

                }else{
                    console.dump('could not get success');
                    reject(false);
                }
          }).catch(err=>{
              reject(err);
          })


     })

}

views.verifycharge = function(){

 return new Promise(function(resolve,reject){
         views.loading = true;
         var reference=  storage.getString('reference');                           
         views.geturl(config.accountinfo + '/'+ storage.getString("_id"))
                 .then((data)=>{
                data['owing'] = views.returnvalue;              
                views.puttourl(config.accountinfo + '/'+ storage.getString("_id"), data).then((d)=>{ 
                    console.log('put to url response'); 
                    console.dump(d);
                    views.loading = false;
                   views.version('confirmpay'); 
                    storage.setString ('havedetails', 'true')  
                    storage.setString ('owing', views.returnvalue);
                    views.set('owing', views.returnvalue )
                    views.set('returndate', views.returndate);
                    storage.setString ('returndate', views.returndate);
                    console.log('owing'+ views.returnvalue)
                    if (views.get('owing') != ""){
                       views.set('topay', true);
                       views.setowing();
                        console.log('this shows you are owing'+views.get('owing'));
                     }
                      views.loading = false;  
                    resolve(true);
                    })
                    .catch((err)=>{ console.log(err); reject(err)})  


              reject(err);
          })


     })



}


views.verifytransact2 = function(){    
     return new Promise(function(resolve,reject){
         views.loading = true;
         var reference=  storage.getString('reference');
         http.request({
           url:'https://api.paystack.co/transaction/verify/'+ reference,
           method: "GET",
           headers: { authorization: 'Bearer '+ config.paystacktest}      
          }).then((docs)=>{ 
                views.loading = false;                               
                var content2 = JSON.parse(docs.content); 
                var content = content2.data;             
                console.dump(docs.content);   
                if (content.status ) {
                    views.set('transactioninfo', content.message);                     
                    console.log(views.returnvalue);           
                    var returndata = content.data;
                 views.geturl(config.accountinfo + '/'+ storage.getString("_id"))
                   .then((data)=>{
                console.dump(data)                
                  data['owing'] = '';
                 data['returndate'] ='';
                  views.set('returnvalue', "");
                views.puttourl(config.accountinfo + '/'+ storage.getString("_id"), data).then((d)=>{ 
                    console.log('put to url response'); 
                    console.dump(d);
                    views.loading = false;
                   views.version('returnfinal');
                     //  views.version('confirmpay');                    
                    storage.setString ('owing', "");
                    views.set('owing', "" )
                    console.log('owing'+ views.returnvalue)
                    if (views.get('owing') == ""){
                       views.set('topay', false);
                          }
                    resolve(true);
                    })
                    .catch((err)=>{ console.log(err); reject(err)})
                })   .catch((err)=>{ console.log(err); reject(err)})
                

                }else{
                    console.dump('could not get success');
                    reject(false);
                }
          }).catch(err=>{
              reject(err);
          })


     })

}


views.paystackrequest = function(el){
     return new Promise(function(resolve,reject){         
         views.loading = true;
         views.proceed = false;
         if (el == "two"){
         var obj = {'email':storage.getString('email'), 'amount':views.get('owing') + '00'};
         }else{
              var obj = {'email':storage.getString('email'), 'amount':'1000'}
         }
        
         //'reference':storage.getString("recipient_code") 
        
         http.request({
           url:'https://api.paystack.co/transaction/initialize',
           method: "POST",
           headers: { "Content-Type": "application/json" ,  authorization: 'Bearer '+ config.paystacktest},
           content: JSON.stringify( obj )
          }).then((docs)=>{
                views.loading = false;
                var content = JSON.parse(docs.content);
                console.log('from paystackt ....................................../');
                console.dump(docs.content);                
                     
                var returndata = content.data;
            views.geturl(config.accountinfo + '/'+ storage.getString("_id"))
                   .then((data)=>{
                  data['reference'] =  returndata.reference; 
                views.puttourl(config.accountinfo + '/'+ storage.getString("_id"), data).then((d)=>{ 
                    console.log('put to url response'); 
                    console.dump(d);
                    views.loading = false;
                    storage.setString ('reference', returndata.reference) 
                    views.proceed = true;
                    resolve( returndata.authorization_url);
                    })
                    .catch((err)=>{ console.log(err); reject()})
                   }) .catch((err)=>{ console.log(err); reject()})


          }).catch(err=>{
              reject(err);
          })

  });

    
}


 return views;
}//signup

module.exports = checkstat;


