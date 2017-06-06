var observable = require("data/observable");
var pageModule = require("ui/page");
var localStorage = require("nativescript-localstorage");
var appModule = require("application");


exports.listView = function(args) {
    var page = args.object;

    var data = localStorage.getItem("aasd");
    console.info(JSON.stringify(data));
    console.info(data["-Klt66wfJYSCkf21DRfe"]);
    var a='';
    data["-Klt66wfJYSCkf21DRfe"].forEach(function(element) {
        a+=element+ " ";
    }       
    , this);
    
        console.info(a);

}