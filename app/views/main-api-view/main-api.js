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

    // function to draw FORM according of propertys on JSON
    drawForm(textObject, tapButton, typeObject);
}

drawForm = function(txt, tp, typeObj) {
    var layout = new stackLayout.StackLayout();
    
    // var button = new Array();
    var label = new Array();
    var num = typeObj.length;

    var formattedString = new formattedStringModule.FormattedString();

    var textSpan1 = new spansModule.Span();
    textSpan1.text= String.fromCharCode(0xef013) + "\n" + "Options";
    textSpan1.fontSize = 25;

    formattedString.spans.push(textSpan1);

    var button = new buttonModule.Button(); 
    button.formattedText = formattedString;
    button.className = "btnIcon";

    var buttonMerda = new buttonModule.Button();
    buttonMerda.text = String.fromCharCode(0xef013) + "\n" + "xisde";
    buttonMerda.className = "btnIcon";
    
    layout.addChild(buttonMerda);
    layout.addChild(button);

    /*for (i = 0; i <= num; i++) {
        const cont = i;
        switch (typeObj[i]) {
            case "Label":
                console.info("LABEL CRL CRL CRL CRL");
                label[cont] = new labelModule.Label();
                label[cont].text = txt[cont];
                layout.addChild(label[cont]);
                break;

            case "Button":
                console.info("BUTTON CRL CRL CRL CRL");
                button[cont] = new buttonModule.Button();
                button[cont].className = "btnIcon";
                // button[cont].text = txt[cont];
                button[cont].text = "merda; coco";

                layout.addChild(button[cont]);
                break;
        }        
    } */

    page.content = layout;
}

// functions of action bar
exports.options0 = function() {
    alert("OPTIONS 0");
}

exports.options1 = function() {
    alert("OPTIONS 1");
}