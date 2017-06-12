var frameModule = require("ui/frame");
var topmost = require("ui/frame").topmost();

exports.options = function(args)
{   
    page = args.object;
    var options = localStorage.getItem("Options");
    page.actionBar.title = "Options";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;

    page.bindingContext = { ButtonBackgroundColor: options.color_button, ButtonTextColor: options.color_text };
}

exports.changeServer = function()
{
    localStorage.clear();
    var topmost = frameModule.topmost();
    var navigationOptions =
    {
        moduleName: "views/Start-Page/Start-Page",
        clearHistory: true
    }
    topmost.navigate(navigationOptions);
}

exports.homeButton = function()
{
    var navigationOptions =
    {
        moduleName: "views/main-api-view/main-api",
        clearHistory: true
    }
    topmost.navigate(navigationOptions);
}

exports.infoButton = function()
{
    topmost.navigate("views/Info/Info");
}

exports.optionsButton = function()
{
    topmost.navigate("views/options-view/options");
}
