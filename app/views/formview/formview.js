var stackModule = require("ui/layouts/stack-layout");
var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var scrollModule = require("ui/scroll-view");
var textFieldModule = require("ui/text-field");
var textViewModule = require("ui/text-view");
var dropModule = require("nativescript-drop-down");
var topmost = require("ui/frame").topmost();
var http = require("http");

var options = localStorage.getItem("Options");

exports.Loaded = function (args) {
    var page = args.object;

    var gotData = page.navigationContext;
    var data = localStorage.getItem(gotData.table);

    var container = page.getViewById("Container");
    if (container._childrenCount == 0) {
        var fieldsArray = [];       // save objects
        var submitInfo = [];        // save info to submit
        var saveInputText = [];     // save number of objects with input
        var q = 0;

        for (cont = 0; cont < data.length; cont++) {
            const i = cont;
            const p = q;
            switch (data[i].type) {
                case "dropdown":
                    var arrayDados = new Array();
                    fieldsArray[i] = new dropModule.DropDown();
                    fieldsArray[i].items = data[i].items;
                    fieldsArray[i].id = data[i].id;
                    fieldsArray[i].selectedIndex = 0;
                    fieldsArray[i].name = data[i].name;
                    container.addChild(fieldsArray[cont]);
                    saveInputText[p] = i;
                    q += 1;
                    break;
                case "label":
                    fieldsArray[i] = new labelModule.Label();
                    fieldsArray[i].id = data[i].id;
                    fieldsArray[i].text = data[i].text;
                    fieldsArray[i].name = data[i].name;
                    container.addChild(fieldsArray[cont]);
                    break;
                case "textfield":
                    fieldsArray[i] = new textFieldModule.TextField();
                    fieldsArray[i].hint = data[i].hint;
                    fieldsArray[i].id = data[i].id;
                    fieldsArray[i].name = data[i].name;
                    container.addChild(fieldsArray[cont]);
                    saveInputText[p] = i;
                    q += 1;
                    break;
                case "textview":
                    fieldsArray[i] = new textViewModule.TextView();
                    fieldsArray[i].hint = data[i].hint;
                    fieldsArray[i].id = data[i].id;
                    fieldsArray[i].name = data[i].name;
                    container.addChild(fieldsArray[i]);
                    saveInputText[p] = i;
                    q += 1;
                    break;
            }
        }

        // button submit
        var submitBtn = new buttonModule.Button();
        submitBtn.text = "submit";
        submitBtn.on(buttonModule.Button.tapEvent, function () {
            var submit = {} // empty Object
            var key = gotData.table;

            let cena = "cena";
            for (i = 0; i < saveInputText.length; i++) {
                var x = saveInputText[i];
                if (data[x].type == 'dropdown') {
                    submit[fieldsArray[x].name] = fieldsArray[x].items[fieldsArray[x].selectedIndex];
                }
                else {
                    submit[fieldsArray[x].name] = fieldsArray[x].text;
                }
            }
            console.log(JSON.stringify(submit));
            http.request({
                url: localStorage.getItem("server_url"),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                content: JSON.stringify(submit)
            }).then(function (response) {
                result = response.content.toJSON();
                console.log(result);
            }, function (e) {
                console.log("Error occurred " + e);
            });
            var navigationOptions =
                {
                    moduleName: "views/main-api-view/main-api",
                    clearHistory: true
                }
            topmost.navigate(navigationOptions);
        });
        container.addChild(submitBtn);
    }
    page.bindingContext = { title: "Form View", backgroundColor: options.color_actionBar, textColor: options.color_text };
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
