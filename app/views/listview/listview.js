var observable = require("data/observable");
var pageModule = require("ui/page");
var localStorage = require("nativescript-localstorage");
var appModule = require("application");


exports.listView = function(args) {
    var page = args.object;

    localStorage.setItem("currentPage", "listview");

    var data = localStorage.getItem("aasd");
    var arr = Object.values(data);
    for (var index = 0; index < arr.length; index++) {
        arr.forEach(function(element) {
            console.log(arr[index]);
        }       
        , this);
    }
    page.bindingContext = { myItems: arr };
}
