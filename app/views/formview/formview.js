var localStorage = require("nativescript-localstorage");
var stackModule = require("ui/layouts/stack-layout");
var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var scrollModule = require("ui/scroll-view");
var frameModule = require("ui/frame");
var textFieldModule = require("ui/text-field");
var textViewModule = require("ui/text-view");
var dropModule = require("nativescript-drop-down");
var Connection = require("../../shared/DB_connection");
var con = new Connection();

var data = localStorage.getItem("constructForm");

exports.formView = function(args) {
    var page = args.object;

    var newStackLayout = new stackModule.StackLayout();
    var scrollView = new scrollModule.ScrollView();
    var fieldsArray = [];

    var saveInputText = [];
    var q = 0;
    
    for(cont=0; cont < data.length; cont++)
    {
        const i = cont;
        const p = q;
        switch(data[i].type){
            case "checkbox":
                /*fieldsArray[cont] = new checkModule.CheckBox();
                fieldsArray[cont].value = data[cont].value;
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;

                newStackLayout.addChild(fieldsArray[cont]);*/
                break;
            case "dropdown":
                var arrayDados = new Array();
                fieldsArray[i] = new dropModule.DropDown();
                fieldsArray[i].items = data[i].items;
                fieldsArray[i].id = data[i].id;
                fieldsArray[i].selectedIndex = 0;

                //console.info("coco: " + i);
                //saveInputText[p] = i;
                //q += 1;
                break;
            case "radiogroup":
                /*fieldsArray[cont] = new radioBtnModule.RadioGroup();
                fieldsArray[cont].id = data[cont].id;
                newStackLayout.addChild(fieldsArray[cont]);*/
                break;
            case "radiobutton":
                /*fieldsArray[cont] = new radioBtnModule.RadioButton();
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;
                fieldsArray[cont].value = data[cont].value;
                newStackLayout.getViewById(data[cont].group).addChild(fieldsArray[cont]);*/
                break;
            case "label":
                fieldsArray[i] = new labelModule.Label();
                fieldsArray[i].id = data[i].id;
                fieldsArray[i].text = data[i].text;
                newStackLayout.addChild(fieldsArray[cont]);
                break;
            case "textfield":
                fieldsArray[i] = new textFieldModule.TextField();
                fieldsArray[i].hint = data[i].hint;
                fieldsArray[i].id = data[i].id;
                newStackLayout.addChild(fieldsArray[cont]);
                saveInputText[p] = i;
                q += 1;
                console.info("textfield: " + i);
                break;
            case "textview":
                fieldsArray[i] = new textViewModule.TextView();
                fieldsArray[i].hint = data[i].hint;
                fieldsArray[i].id = data[i].id;
                newStackLayout.addChild(fieldsArray[i]);
                saveInputText[p] = i;
                q += 1;
                console.info("textview: " + i);
                break;
            default:
                break;
        }
    }

    // button submit
    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";  
    submitBtn.on(buttonModule.Button.tapEvent, function (){

        for (i = 0; i < saveInputText.length; i++) {
            var x = saveInputText[i];
            console.info(fieldsArray[x].text);
            con.add('/aasd', fieldsArray[x].text);
        }   
    });

    newStackLayout.addChild(submitBtn);
    scrollView.content = newStackLayout;
    page.content = scrollView;
}