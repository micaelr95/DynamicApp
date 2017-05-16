// modules
var frameModule = require("ui/frame");
var topmost = frameModule.topmost();
var labelModule = require("ui/label");
var checkboxModule = require("nativescript-checkbox");
var dropdownModule = require("nativescript-drop-down/drop-down");
var buttonModule = require("ui/button");
var radioModule = require("nativescript-radiobutton");
var textfieldModule = require("ui/text-field");
var stackLayout = require("ui/layouts/stack-layout");
var gridLayout = require("ui/layouts/grid-layout");
var localstorage = require("nativescript-localstorage");
var formattedStringModule = require("text/formatted-string");
var spansModule = require("text/span");
var toastModule = require("nativescript-toast");
var imageModule = require("ui/image")
var actionBarModule = require("ui/action-bar");
var application = require("application");
var Connection = require("../../shared/DB_connection");
var con = new Connection();
var id;
var timer = require("timer");
var page;

// vars storage
var urlJson;
var dataJsonStorage = localstorage.getItem("dados_json");

var data = "";

var condicaoJson = "options";

var activity = application.android.startActivity ||
        application.android.foregroundActivity ||
        frameModule.topmost().android.currentActivity ||
        frameModule.topmost().android.activity;

activity.onBackPressed = function()
{
    if (localstorage.getItem("currentPage") == "mainAPI")
    {
        var startMain = new android.content.Intent(android.content.Intent.ACTION_MAIN);
        startMain.addCategory(android.content.Intent.CATEGORY_HOME);
        startMain.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        activity.startActivity(startMain);
    }
    else if(localstorage.getItem("currentPage") == "options" )
    {
        topmost.navigate("views/main-api-view/main-api");
    }
    else
    {
        frameModule.topmost().goBack();
    }
}

exports.mainMenu = function(args)
{
    page = args.object;
    localstorage.setItem("currentPage" , "mainAPI");
    page.actionBar.title = "Menu - Api View";
    // verifica se há registo nos storage 
    var verifyStorage = localstorage.getItem("verify_storage");

    if (verifyStorage == null || verifyStorage == 0) {
        // primeiro faz request das options e depois do form
        // https://newapp-e758c.firebaseio.com/Options
        urlJson = "https://newapp-e758c.firebaseio.com/Options.json";
        condicaoJson = "options";
        requestJson(urlJson);
    }
    else if (verifyStorage == 1) {
        drawStorage();
    }   
    
    
}

requestJson = function(linkJson)
{    
    fetch(linkJson).then(response =>
    {
        return response.json();
    })
    .then(function (r)
    {
        if (condicaoJson == "options") {
            localstorage.setItem("color_actionBar", r.color_actionBar);
            localstorage.setItem("color_buttons", r.color_button);
            condicaoJson = "form";
            linkJson = localstorage.getItem("server_url") + "/form.json";
            requestJson(linkJson);
        }
        else if (condicaoJson == "form") {
            getJson(r);
        }
    });   
}

getJson = function(data) {
    var num = data.length;
    localstorage.setItem("num_object_json", num);
    localstorage.setItem("verify_storage", 1);

    for(i = 0; i < num; i++) {        
        switch(data[i].Type) {
            case "button":             
                localstorage.setItem("object_icon" + i, data[i].icon);
                localstorage.setItem("object_text" + i, data[i].text);
                localstorage.setItem("object_linkJson" + i, data[i].linkJson);
                localstorage.setItem("object_className" + i, "btnIcon");
                break;
            case "radiobutton":
                localstorage.setItem("object_linkImg" + i, data[i].linkImg);
                break; 
        }
        // storage saves
        localstorage.setItem("object_type" + i, data[i].Type);
        localstorage.setItem("object_id" + i, data[i].id);
        localstorage.setItem("object_value" + i, data[i].typeview);
    }
    drawStorage();
}


drawStorage = function() {
    page.actionBar.backgroundColor = localstorage.getItem("color_actionBar");

    // layout
    var glayout = new gridLayout.GridLayout();
    var slayout = new stackLayout.StackLayout();
    var num = data.length;
    var x = 0;
    var y = 0;

    // objects
    var radioGroup = new radioModule.RadioGroup();
    var image = new imageModule.Image();

    // array to get data of objects
    var object_field = new Array();

    // quant of objects
    var num = localstorage.getItem("num_object_json");

    for(i = 0; i < num; i++) {
        const cont = i;
        var type_object = localstorage.getItem("object_type" + i);

        switch (type_object) {
            case "button":
                var formattedString = new formattedStringModule.FormattedString();
                var iconSpan = new spansModule.Span();
                iconSpan.text = String.fromCharCode(localstorage.getItem("object_icon" + i));
                iconSpan.fontSize = 25;
                formattedString.spans.push(iconSpan);

                var textSpan = new spansModule.Span();
                textSpan.text = "\n\n" + localstorage.getItem("object_text" + i); 
                formattedString.spans.push(textSpan);   

                object_field[cont] = new buttonModule.Button();
                object_field[cont].id = localstorage.getItem("object_id" + i);
                object_field[cont].formattedText = formattedString;
                object_field[cont].className = "btnIcon";
                object_field[cont].value = localstorage.getItem("object_value" + i);
                object_field[cont].backgroundColor = localstorage.getItem("color_buttons");

                object_field[cont].on(buttonModule.Button.tapEvent, function() {
                     timer.clearInterval(id);
                    
                    // verifica se é options
                    if(object_field[cont].value == "options")
                    {
                        topmost.navigate("views/options-view/options");
                    }
                    else
                    {
                        var navigationOptions =
                        {
                            moduleName: "views/constructor-view/constructor",
                            context:
                            {
                                typeView: object_field[cont].value
                            }
                    }
                        topmost.navigate(navigationOptions);
                    }
                 });

                // add button to layout
                gridLayout.GridLayout.setColumn(object_field[cont], x);
                gridLayout.GridLayout.setRow(object_field[cont], y);
                var column = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                var row = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                glayout.addColumn(column);
                glayout.addRow(row);
                glayout.addChild(object_field[cont]);
                
                // columns and rows of datagrid
                if(x >= 1) {
                    x = 0;
                    y += 1;
                } 
                else {
                    x += 1;
                }
                break;

            case "radiobutton":
                break;
        }
        page.content = glayout;       
    }
}