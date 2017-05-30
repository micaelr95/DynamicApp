var frameModule = require("ui/frame");
var localStorage = require("nativescript-localstorage");
var page;

exports.Loaded = function(args)
{
    page = args.object;

    var options = localStorage.getItem("Options");
    page.actionBar.title = "Info";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;
    localStorage.setItem("currentPage" , "info");

    var info = localStorage.getItem("Info");

    page.bindingContext = { Text: info.text, ButtonTextColor: options.color_text};
}