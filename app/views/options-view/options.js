var frameModule = require("ui/frame");
var localstorage = require("nativescript-localstorage");
var observableModule = require("data/observable");
var viewModel = new observableModule.Observable();

exports.options = function(args)
{   
    page = args.object;
    var options = localstorage.getItem("Options");
    page.actionBar.title = "Options";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;
    localstorage.setItem("currentPage" , "options");

    page.bindingContext = { ButtonBackgroundColor: options.color_button, ButtonTextColor: options.color_text};;

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
