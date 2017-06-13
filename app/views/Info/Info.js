var topmost = require("ui/frame").topmost();

exports.Loaded = function (args) {
    page = args.object;

    var options = localStorage.getItem("Options");

    var info = localStorage.getItem("Info");

    page.bindingContext = { title: "Info", backgroundColor: options.color_actionBar, textColor: options.color_text, Text: info.text, ButtonTextColor: options.color_text };
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
