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
