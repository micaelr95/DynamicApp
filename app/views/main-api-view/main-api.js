var topmost = require("ui/frame").topmost();
var Button = require("ui/button").Button;
var FormattedString = require("text/formatted-string").FormattedString;
var Span = require("text/span").Span;

var options = localStorage.getItem("Options");
var mainApi = localStorage.getItem("MainApi");
var MainApiLayout = localStorage.getItem("MainApiLayout");

exports.Loaded = function (args) {
    var page = args.object;

    var container = page.getViewById("Container");
    if (mainApi.length > 0 && container._childrenCount == 0) {
        switch (MainApiLayout.type) {
            case "StackLayout":
                var StackLayout = require("ui/layouts/stack-layout").StackLayout;
                var layoutType = new StackLayout();
                for (index = 0; index < mainApi.length; index++) {
                    const cont = index;
                    switch (mainApi[index].Type) {
                        case "button":
                            var formattedString = new FormattedString();
                            var iconSpan = new Span();
                            iconSpan.text = String.fromCharCode(mainApi[index].icon);
                            iconSpan.fontSize = 25;
                            formattedString.spans.push(iconSpan);

                            var textSpan = new Span();
                            textSpan.text = "\n\n" + mainApi[index].text;
                            formattedString.spans.push(textSpan);

                            var button = new Button();
                            button.id = mainApi[index].id;
                            button.formattedText = formattedString;
                            button.className = "btnIcon";
                            button.value = mainApi[index].typeview;
                            button.backgroundColor = options.color_button;
                            button.on(Button.tapEvent, function () {
                                switch (mainApi[cont].typeview) {
                                    case "list":
                                        var navigationOptions = {
                                            moduleName: "views/listview/listview",
                                            context: {
                                                table: mainApi[cont].targetTable
                                            }
                                        }
                                        topmost.navigate(navigationOptions);
                                        break;
                                    case "form":
                                        var navigationOptions = {
                                            moduleName: "views/formview/formview",
                                            context: {
                                                table: mainApi[cont].targetTable,
                                                submitTable: mainApi[cont].submitTable
                                            }
                                        }
                                        topmost.navigate(navigationOptions);
                                        break;
                                    case "webview":
                                        var navigationOptions = {
                                            moduleName: "views/webview/webview",
                                            context: {
                                                table: mainApi[cont].targetTable
                                            }
                                        }
                                        topmost.navigate(navigationOptions);
                                        break;
                                }
                            });
                            layoutType.addChild(button);
                            break;
                    }
                }
                break;
            case "GridLayout":
                var gridLayout = require("ui/layouts/grid-layout");
                var layoutType = new gridLayout.GridLayout();
                for (index = 0; index < mainApi.length; index++) {
                    const cont = index;
                    switch (mainApi[index].Type) {
                        case "button":
                            var formattedString = new FormattedString();
                            var iconSpan = new Span();
                            iconSpan.text = String.fromCharCode(mainApi[index].icon);
                            iconSpan.fontSize = 25;
                            formattedString.spans.push(iconSpan);

                            var textSpan = new Span();
                            textSpan.text = "\n\n" + mainApi[index].text;
                            formattedString.spans.push(textSpan);

                            var button = new Button();
                            button.id = mainApi[index].id;
                            button.formattedText = formattedString;
                            button.className = "btnIcon";
                            button.value = mainApi[index].typeview;
                            button.backgroundColor = options.color_button;
                            button.on(Button.tapEvent, function () {
                                switch (mainApi[cont].typeview) {
                                    case "list":
                                        var navigationOptions = {
                                            moduleName: "views/listview/listview",
                                            context: {
                                                table: mainApi[cont].targetTable
                                            }
                                        }
                                        topmost.navigate(navigationOptions);
                                        break;
                                    case "form":
                                        var navigationOptions = {
                                            moduleName: "views/formview/formview",
                                            context: {
                                                table: mainApi[cont].targetTable,
                                                submitTable: mainApi[cont].submitTable
                                            }
                                        }
                                        topmost.navigate(navigationOptions);
                                        break;
                                    case "webview":
                                        var navigationOptions = {
                                            moduleName: "views/webview/webview",
                                            context: {
                                                table: mainApi[cont].targetTable
                                            }
                                        }
                                        topmost.navigate(navigationOptions);
                                        break;
                                }
                            });
                            gridLayout.GridLayout.setColumn(button, mainApi[index].posColumn);
                            gridLayout.GridLayout.setRow(button, mainApi[index].posRow);
                            gridLayout.GridLayout.setColumnSpan(button, mainApi[index].colSpan);
                            gridLayout.GridLayout.setRowSpan(button, mainApi[index].rowSpan);
                            var column = new gridLayout.ItemSpec(1, "auto");
                            var row = new gridLayout.ItemSpec(1, "auto");
                            layoutType.addColumn(column);
                            layoutType.addRow(row);
                            layoutType.addChild(button);
                            break;
                    }
                }
                break;
        }
        container._addView(layoutType);
    }
    page.bindingContext = { title: "Main Api", backgroundColor: options.color_actionBar, textColor: options.color_text };
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
