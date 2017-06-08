var application = require("application");
var topmost = require("ui/frame").topmost();
var buttonModule = require("ui/button");
var formattedStringModule = require("text/formatted-string");
var spansModule = require("text/span");
var toastModule = require("nativescript-toast");

var options = localStorage.getItem("Options");
var mainApi = localStorage.getItem("form");

var activity = application.android.startActivity ||
        application.android.foregroundActivity ||
        frameModule.topmost().android.currentActivity ||
        frameModule.topmost().android.activity;

activity.onBackPressed = function()
{
    if (localStorage.getItem("currentPage") == "mainAPI")
    {
        var startMain = new android.content.Intent(android.content.Intent.ACTION_MAIN);
        startMain.addCategory(android.content.Intent.CATEGORY_HOME);
        startMain.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(startMain);
    }
    else if(localStorage.getItem("currentPage") == "options" || localStorage.getItem("currentPage") == "formview" || localStorage.getItem("currentPage") == "info" ||localStorage.getItem("currentPage") == "webview" || localStorage.getItem("currentPage") == "listview")
    {
        topmost.navigate("views/main-api-view/main-api");
    }
    else if(localStorage.getItem("addlist") == "true" )
    {
        localStorage.setItem("addlist" , "false");
        var navigationOptions =
        {
            moduleName: "views/constructor-view/constructor",
            context:
            {
                typeView: "list",
                targetTable: localStorage.getItem("targetTable")
            }
        }
            topmost.navigate(navigationOptions);
    } else {
        frameModule.topmost().goBack();
    }
}

exports.Loaded = function(args)
{
    var page = args.object;
    localStorage.setItem("currentPage" , "mainAPI");
 
    page.actionBar.title = "Main Api";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;

    var container = page.getViewById("Container");
    var object_field = new Array();

    for(i = 0; i < mainApi.length; i++)
    {
        const cont = i;
        switch (mainApi[i].Type)
        {
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
                object_field[i].on(buttonModule.Button.tapEvent, function()
                {
                    switch (object_field[cont].value) 
                    {
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
