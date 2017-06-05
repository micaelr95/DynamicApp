var localStorage = require("nativescript-localstorage");

exports.Loaded = function(args)
{
    page = args.object;
    page.actionBar.title = "WebView";

    var webview = page.getViewById("webview");
    webview.android.getSettings().setBuiltInZoomControls(false);

    var link = localStorage.getItem("webview");
    page.bindingContext = { url: link.defaultUrl };
}
