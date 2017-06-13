var frameModule = require("ui/frame");
var topmost = require("ui/frame").topmost();
var config = require("../../shared/config");

exports.options = function (args) {
    page = args.object;
    var options = localStorage.getItem("Options");

    page.bindingContext = { title: "Options", backgroundColor: options.color_actionBar, textColor: options.color_text, ButtonBackgroundColor: options.color_button, ButtonTextColor: options.color_text };
}

exports.changeServer = function () {
    localStorage.clear();
    var topmost = frameModule.topmost();
    var navigationOptions =
        {
            moduleName: "views/Start-Page/Start-Page",
            clearHistory: true
        }
    config.mainapiOpen = false;
    topmost.navigate(navigationOptions);
}

exports.homeButton = function () {
    var navigationOptions =
        {
            moduleName: "views/main-api-view/main-api",
            clearHistory: true
        }
    topmost.navigate(navigationOptions);
}

exports.infoButton = function () {
    topmost.navigate("views/Info/Info");
}

exports.optionsButton = function () {
    topmost.navigate("views/options-view/options");
}
