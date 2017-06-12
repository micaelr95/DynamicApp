var topmost = require("ui/frame").topmost();

exports.Loaded = function(args)
{
    page = args.object;
    var options = localStorage.getItem("Options");
    page.actionBar.title = "WebView";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;

    var webview = page.getViewById("webview");
    webview.android.getSettings().setBuiltInZoomControls(false);

    var link = localStorage.getItem("webview");
    page.bindingContext = { url: link.defaultUrl };
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
