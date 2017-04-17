var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var checkboxModule = require("nativescript-checkbox");
var dropdownModule = require("nativescript-drop-down/drop-down");
var textfieldModule = require("ui/text-field");
var stackLayout = require("ui/layouts/stack-layout");
var gridLayout = require("ui/layouts/grid-layout");
var localstorage = require("nativescript-localstorage");
var formattedStringModule = require("text/formatted-string");
var spansModule = require("text/span");

var urlJson = localstorage.getItem("server_url");

exports.mainMenu = function(args) {
    page = args.object;
 
    requestJson();
}

requestJson = function() {    
    fetch(urlJson).then(response => {
        return response.json();
    })
    .then(function (r) {
        // console.info(JSON.stringify(r));

        var data = r;
        // console.info(JSON.stringify(data[0].Type));
        drawJson(data);
    });   
}

drawJson = function(data) {
    var layout = new stackLayout.StackLayout();

    var textfield = new textfieldModule.TextField();
    var button = new buttonModule.Button();
    var checkbox = new checkboxModule.CheckBox();
    var dropdown = new dropdownModule.DropDown(); 

    num = data.length;
    console.info(num);

    for(i = 0; i < num; i++) {
        switch (data[i].Type) {
            case "textfield":
                console.info("textfield");
                textfield.hint = data[i].hint;
                textfield.id = data[i].id;
                layout.addChild(textfield);
                break;
            case "button":
                console.info("button");
                button.id = data[i].id;
                button.text = data[i].text;
                layout.addChild(button);
                break;
            case "checkbox":
                console.info("checkbox");
                checkbox.id = data[i].id;
                checkbox.text = data[i].text;
                layout.addChild(checkbox);
                break;
            case "dropdown":
                console.info("dropdown");
                dropdown.id = data[i].id;
                dropdown.items = data[i].items;
                dropdown.selectedIndex = 0;
                layout.addChild(dropdown);
                break;
        }
        page.content = layout;
    }
}

dataPropertys = function() {
    var textObject = ["Label Working", "Create form", "Display ListView", "Open WebView", "Options"];
    var tapButton = ["", "You just created a new form", "You just opened a ListView", "You just opened a WebView", "You just opened an Options"];
    var typeObject = ["Label", "Button", "Button", "Button", "Button"];
    var iconObject = ["", "0xef0fe", "0xef022", "0xef26b", "0xef013"];

    drawForm(textObject, tapButton, typeObject, iconObject);
}

drawForm = function(txt, tp, typeObj, icon) {
    // var layout = new stackLayout.StackLayout();
    var layout = new gridLayout.GridLayout();

    var button = new Array();
    var label = new Array();
    var num = typeObj.length;

    var x = 0;
    var y = 0;

    for (i = 0; i <= num; i++) {
        const cont = i;  

        switch (typeObj[i]) {
            case "Label":
                label[cont] = new labelModule.Label();
                label[cont].text = txt[cont];
                // layout.addChild(label[cont]);
                break;

            case "Button":   
                var textSpan = new spansModule.Span();
                var iconSpan = new spansModule.Span();
                var formattedString = new formattedStringModule.FormattedString();
                iconSpan.text = String.fromCharCode(icon[cont]);
                iconSpan.fontSize = 25;
                formattedString.spans.push(iconSpan);

                textSpan.text = "\n\n" + txt[cont];                
                formattedString.spans.push(textSpan);

                button[cont] = new buttonModule.Button();
                button[cont].className = "btnIcon";            
                button[cont].formattedText = formattedString;

                // draw grid
                if (x <= 1) {
                    gridLayout.GridLayout.setColumn(button[cont], x);
                }
                else {
                    gridLayout.GridLayout.setRow(button[cont], 1);
                    gridLayout.GridLayout.setColumn(button[cont], y);
                    y += 1;
                }
                x += 1;

                var column = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                var row = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                layout.addColumn(column);
                layout.addRow(row);
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