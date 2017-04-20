// modules
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
var toastModule = require("nativescript-toast");

// vars storage
var urlJson = localstorage.getItem("server_url");

// merda para isto ok

exports.mainMenu = function(args) {
    page = args.object;
    requestJson();
}

requestJson = function() {    
    fetch(urlJson).then(response => {
        return response.json();
    })
    .then(function (r) {
        var data = r;
        drawJson(data);
    });   
}

drawJson = function(data) {
    // var layout = new stackLayout.StackLayout();
    // var textfield = new textfieldModule.TextField();    
    // var checkbox = new checkboxModule.CheckBox();
    // var dropdown = new dropdownModule.DropDown(); 

    var layout = new gridLayout.GridLayout();
    var button = new Array();
    var num = data.length;
    var x = 0;
    var y = 0;
    
    for(i = 0; i < num; i++) {
        const cont = i;

        switch (data[i].Type) {
            case "button":
                var textSpan = new spansModule.Span();
                var iconSpan = new spansModule.Span();
                var formattedString = new formattedStringModule.FormattedString();
                iconSpan.text = String.fromCharCode(data[cont].icon);
                iconSpan.fontSize = 25;
                formattedString.spans.push(iconSpan);

                textSpan.text = "\n\n" + data[cont].text;;                
                formattedString.spans.push(textSpan);

                button[cont] = new buttonModule.Button();
                button[cont].id = data[i].id;
                button[cont].formattedText = formattedString;
                button[cont].className = "btnIcon";
                button[cont].on(buttonModule.Button.tapEvent, function() {
                    var toast = toastModule.makeText(data[cont].linkJson);
                    toast.show();
                });

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

            /*case "textfield":
                console.info("textfield");
                textfield.hint = data[i].hint;
                textfield.id = data[i].id;
                layout.addChild(textfield);
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
                break; */
        }
        page.content = layout;
    }
}

// functions of action bar
exports.options0 = function() {
    alert("OPTIONS 0");
}

exports.options1 = function() {
    alert("OPTIONS 1"); 
}