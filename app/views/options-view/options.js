var frameModule = require("ui/frame");
var localstorage = require("nativescript-localstorage");
var observableModule = require("data/observable");
var viewModel = new observableModule.Observable();

exports.options = function(args)
{   
    page = args.object;
    page.actionBar.title = "Options";
    page.actionBar.backgroundColor = localstorage.getItem("color_actionBar");
    page.actionBar.color = "white";
    localstorage.setItem("currentPage" , "options");

    page.bindingContext = { ButtonColor: localstorage.getItem("color_buttons")};
}

exports.changeServer = function()
{
    localstorage.clear();
    var topmost = frameModule.topmost();
    var navigationOptions =
    {
        moduleName: "views/Start-Page/Start-Page",
        clearHistory: true
    }
    topmost.navigate(navigationOptions);
}
