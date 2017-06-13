var application = require("application");
var topmost = require("ui/frame").topmost();
var buttonModule = require("ui/button");
var formattedStringModule = require("text/formatted-string");
var spansModule = require("text/span");
var toastModule = require("nativescript-toast");
var config = require("../../shared/config");

var options = localStorage.getItem("Options");
var mainApi = localStorage.getItem("form");

exports.Loaded = function(args)
{
    var page = args.object;

    if (!config.mainapiOpen) {
        var container = page.getViewById("Container");
        var object_field = [];
        if (mainApi.length > 0 && container._childrenCount == 0) {
            for (i = 0; i < mainApi.length; i++) {
                const cont = i;
                switch (mainApi[i].Type) {
                    case "button":
                        var formattedString = new formattedStringModule.FormattedString();
                        var iconSpan = new spansModule.Span();
                        iconSpan.text = String.fromCharCode(mainApi[i].icon);
                        iconSpan.fontSize = 25;
                        formattedString.spans.push(iconSpan);

                        var textSpan = new spansModule.Span();
                        textSpan.text = "\n\n" + mainApi[i].text;
                        formattedString.spans.push(textSpan);

                        object_field[i] = new buttonModule.Button();
                        object_field[i].id = mainApi[i].id;
                        object_field[i].formattedText = formattedString;
                        object_field[i].className = "btnIcon";
                        object_field[i].value = mainApi[i].typeview;
                        object_field[i].backgroundColor = options.color_button;
                        object_field[i].on(buttonModule.Button.tapEvent, function () {
                            switch (object_field[cont].value) {
                                case "options":
                                    topmost.navigate("views/options-view/options");
                                    break;
                                case "list":
                                    topmost.navigate("views/listview/listview");
                                    break;
                                case "form":
                                    topmost.navigate("views/formview/formview");
                                    break;
                                case "webview":
                                    topmost.navigate("views/webview/webview");
                                    break;
                            }
                        });
                        break;
                }
                container.addChild(object_field[i]);
            }
        }
    }
    page.bindingContext = {title: "Main Api", backgroundColor: options.color_actionBar, textColor: options.color_text};
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
