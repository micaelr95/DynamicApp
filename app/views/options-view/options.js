var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var viewModel = new observableModule.Observable();

exports.options = function(args)
{   
    page = args.object;
    var options = localStorage.getItem("Options");
    page.actionBar.title = "Options";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;
    localStorage.setItem("currentPage", "options");

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
