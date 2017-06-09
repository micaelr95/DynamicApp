exports.Loaded = function(args)
{
    page = args.object;

    var options = localStorage.getItem("Options");
    page.actionBar.title = "Info";
    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;

    var info = localStorage.getItem("Info");

    page.bindingContext = { Text: info.text, ButtonTextColor: options.color_text};
}