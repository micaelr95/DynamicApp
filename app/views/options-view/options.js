var stackLayout = require("ui/layouts/stack-layout");
var actionBarModule = require("ui/action-bar");
var dropModule = require("nativescript-drop-down");
var localstorage = require("nativescript-localstorage");
var buttonModule = require("ui/button");
var radioModule = require("nativescript-radiobutton");

var selectedOption = 0;
var selectedForm = 0;

var colorActionBar = localstorage.getItem("color_actionBar");
var colorButtons = localstorage.getItem("color_buttons");

exports.options = function(args) {   
    page = args.object;

    var layout = new stackLayout.StackLayout();
    
    drawActionBar(page);
    drawRadioButton(layout);
    drawDropDown(layout);

    page.content = layout;
}

drawActionBar = function(p) {
    var bar = new actionBarModule.ActionBar();
    bar.title = "Options";
    bar.backgroundColor = colorActionBar;
    p.actionBar = bar;
}

drawDropDown = function(l) {
    var dropForms = new dropModule.DropDown();
    dropForms.items = ["Forms", "Main Api", "Options"];
    dropForms.selectedIndex = 0;

    var dropColors = new dropModule.DropDown();
    dropColors.items = ["Cores", "Brown", "Yellow", "Red", "Orange", "Blue", "Green"];
    dropColors.selectedIndex = 0;

    var saveButton = new buttonModule.Button();
    saveButton.backgroundColor = colorButtons;
    saveButton.text = "save";
    saveButton.on(buttonModule.Button.tapEvent, function() {
        if (dropColors.selectedIndex != 0) {
            switch (selectedOption) {
                case "buttons":
                    localStorage.setItem("color_buttons", dropColors.items[dropColors.selectedIndex]);                    
                    break;
                case "actionBar":
                    localstorage.setItem("color_actionBar", dropColors.items[dropColors.selectedIndex]);
                    break;
            }
        }
    });

    l.addChild(dropForms);
    l.addChild(dropColors);
    l.addChild(saveButton);
}

drawRadioButton = function(l) {
    var radioGroup = new radioModule.RadioGroup();
    var radioButton1 = new radioModule.RadioButton();
    radioButton1.text = "Buttons";   
    radioButton1.on(buttonModule.Button.tapEvent, function() {
        selectedOption = "buttons";
    });

    var radioButton2 = new radioModule.RadioButton();
    radioButton2.text = "Action Bar";
    radioButton2.on(buttonModule.Button.tapEvent, function() {
        selectedOption = "actionBar";
    });

    radioGroup.addChild(radioButton1);
    radioGroup.addChild(radioButton2);
    l.addChild(radioGroup);
}