var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var stackLayout = require("ui/layouts/stack-layout");

var formattedStringModule = require("text/formatted-string");
var spansModule = require("text/span");

exports.mainMenu = function(args) {
    page = args.object;
    
    // simulating JSON
    dataPropertys();
}

dataPropertys = function() {
    var textObject = ["Label Working", "Create form", "Display ListView", "Open WebView", "Options"];
    var tapButton = ["", "You just created a new form", "You just opened a ListView", "You just opened a WebView", "You just opened an Options"];
    var typeObject = ["Label", "Button", "Button", "Button", "Button"];
    var iconObject = ["", "0xef0fe", "0xef022", "0xef26b", "0xef013"];

    drawForm(textObject, tapButton, typeObject, iconObject);
}

drawForm = function(txt, tp, typeObj, icon) {
    var layout = new stackLayout.StackLayout();
    var button = new Array();
    var label = new Array();
    var num = typeObj.length;
    
    for (i = 0; i <= num; i++) {
        const cont = i;       

        switch (typeObj[i]) {
            case "Label":
                label[cont] = new labelModule.Label();
                label[cont].text = txt[cont];
                layout.addChild(label[cont]);
                break;

            case "Button":
                var textSpan = new spansModule.Span();
                var formattedString = new formattedStringModule.FormattedString();
                textSpan.text = String.fromCharCode(icon[cont]) + "\n" + txt[cont];
                formattedString.spans.push(textSpan);

                button[cont] = new buttonModule.Button();
                button[cont].className = "btnIcon";               
                button[cont].formattedText = formattedString;

                layout.addChild(button[cont]);
                break;
        }        
    }

    page.content = layout;
}

// functions of action bar
exports.options0 = function() {
    alert("OPTIONS 0");
}

exports.options1 = function() {
    alert("OPTIONS 1");
}