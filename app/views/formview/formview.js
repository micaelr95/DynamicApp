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

    for(cont=0; cont < data.length; cont++)
    {
        const i = cont;
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
                newStackLayout.addChild(fieldsArray[i]);
               // testarArray[i] = data[i].type;
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
                break;
            case "textview":
                fieldsArray[i] = new textViewModule.TextView();
                fieldsArray[i].hint = data[i].hint;
                fieldsArray[i].id = data[i].id;
                newStackLayout.addChild(fieldsArray[i]);
                break;
            default:
                break;
        }
    }

    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);
    scrollView.content = newStackLayout;
    page.content = scrollView;

    // event button
    submitBtn.on(buttonModule.Button.tapEvent, function (){
        var submitInfo = new Array();
        var varNames = new Array();

        for(cont = 0; cont < inputObject.length; cont++)
        {
            var i = cont;
            switch(inputObject)
            {
                case "textfield":
                    testarArray[i] = fieldsArray[i].text;
                    varNames[i] = data[i].varName;
                    break;
                case "dropdown":
                    testarArray[i] = fieldsArray[i].items[fieldsArray[i].selectedIndex];
                    varNames[i] = data[i].varName;
                break;
               /* case "checkbox":
                        submitInfo[i] = fieldsArray[i].checked;
                        varNames[i] = data[i].varName;
                break;
                case "radiogroup":
                        var countt = fieldsArray[i]._childrenCount;
                        for(j = 0;j < countt; j ++){
                            if(fieldsArray[i]._subViews[j].checked == true){
                                submitInfo[i-cont] = fieldsArray[i]._subViews[j].value;
                                varNames[i-cont] = data[i].varName;
                            }
                            else{
                                submitInfo[i-cont] = "null";
                                varNames[i-cont] = data[i].varNames;
                            }
                        }
                break; */
                case "textview":
                    testarArray[i] = fieldsArray[i].text;
                    varNames[i] = data[i].varName;
                    break;
                case "label":
                    break;
                default:
                    break;
            }
        }

        // con.add('/aasd', submitInfo);
        // alert("Sended to database");
        // var navigationOptions =
        // {
        //     moduleName: "views/main-api-view/main-api",
        //     clearHistory: true
        // }
        // var topmost = frameModule.topmost();
        // topmost.navigate(navigationOptions);
    });
}