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
var Connection = require("../../shared/DB_connection");
var con = new Connection();

// vars storage
var urlJson = localstorage.getItem("server_url") + "/form.json";

exports.mainMenu = function(args) {    
    page = args.object;

    /*var stack = new stackLayout.StackLayout();
        
  
    x.on(buttonModule.Button.tapEvent, function() {
        image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSes5bRVvn-xkiDHTOtXi4yzXkccSO2Ugo0JtHZP2D54GsC6yeZ1g";    
    });
    
    var y = new radioModule.RadioButton();
    y.on(buttonModule.Button.tapEvent, function() {
        image.src = "http://www.clickgratis.com.br/fotos-imagens/imagem/aHR0cDovL3d3dy5jbGlja2dyYXRpcy5jb20uYnIvZm90b3MtaW1hZ2Vucy9pbWFnZW0vYUhSMGNEb3ZMM2QzZHk1aGNISmxibVJsY21WNFkyVnNMbU52YlM1aWNpOHZhVzFoWjJWdWN5OXViM1JwWTJsaEx6TTROUzh5T1RBeExURXVhbkJuLmpwZw==.jpg";
    });
    
    radioGroup.addChild(x);    
    radioGroup.addChild(y);
    
    stack.addChild(image);
    stack.addChild(radioGroup); */

    // page.content = stack;

    // Initiate database connection
    con.init();
    // Starts ANONYMOUS connection to database
    con.login();

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


drawImage = function(s, path) {
    console.info("PAAAAAAAAAATH:" + path);
    var image = new imageModule.Image();
    image.src = path;                 
    // console.info(radiobutton[cont].linkImg)
    s.addChild(image);
    
}

drawJson = function(data) {
    // var layout = new stackLayout.StackLayout();
    // var textfield = new textfieldModule.TextField();    
    // var checkbox = new checkboxModule.CheckBox();
    // var dropdown = new dropdownModule.DropDown(); 

    var radioGroup = new radioModule.RadioGroup();
    var glayout = new gridLayout.GridLayout();
    var slayout = new stackLayout.StackLayout();
    var image = new imageModule.Image();
    var savePathImage = new Array();
    var button = new Array();
    var radiobutton = new Array();
    var num = data.length;

    var x = 0;
    var y = 1;
    var xRadio = 0;
    var pathImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSes5bRVvn-xkiDHTOtXi4yzXkccSO2Ugo0JtHZP2D54GsC6yeZ1g";
    drawImage(slayout, pathImage);
    console.info("NUMEro: " + num);
    for(i = 0; i < num; i++) {
        const cont = i;
        
        console.info(data[i].Type);
        switch (data[i].Type) {
            case "button":
            console.info("entrou no botao");
                var formattedString = new formattedStringModule.FormattedString();
                var iconSpan = new spansModule.Span();
                iconSpan.text = String.fromCharCode(data[cont].icon);
                iconSpan.fontSize = 25;
                formattedString.spans.push(iconSpan);

                var textSpan = new spansModule.Span();
                textSpan.text = "\n\n" + data[cont].text;;   
                formattedString.spans.push(textSpan);   

                button[cont] = new buttonModule.Button();
                button[cont].id = data[i].id;
                button[cont].formattedText = formattedString;
                button[cont].className = "btnIcon";
                button[cont].value = data[i].typeview;
                button[cont].on(buttonModule.Button.tapEvent, function() {
                    var navigationOptions = {
                        moduleName: "views/constructor-view/constructor",
                        context:{
                            typeView: button[cont].value
                        }
                    }
                    topmost.navigate(navigationOptions);
                });

                if (x >= 1) {
                    x = 0;
                    y += 1;
                } 
                else {
                    x += 1;
                }

                gridLayout.GridLayout.setColumn(button[cont], x);
                gridLayout.GridLayout.setRow(button[cont], y);
                console.info("X DO BUTTON: " + x);
                console.info("Y DO BUTTON: " + y);                
                               
                var column = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                var row = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                glayout.addColumn(column);
                glayout.addRow(row);
                glayout.addChild(button[cont]);              
                break;
           case "radiobutton":
                console.info("entrou no radio");
                radiobutton[cont] = new radioModule.RadioButton();
                radiobutton[cont].id = data[i].id;
                // radiobutton[cont].text = data[i].text;
                radiobutton[cont].on(buttonModule.Button.tapEvent, function() {
                    savePathImage[cont] = data[cont].linkImg;
                    console.info(data[cont].linkImg);
                    drawImage(slayout, savePathImage[cont]);
                });
                
                gridLayout.GridLayout.setColumn(radiobutton[cont], x);
                gridLayout.GridLayout.setRow(radiobutton[cont], y);
                console.info("X: DO RADIO: " + x);
                console.info("Y: DO RADIO: " + y);
                x += 1;
                y += 1;          
                var column = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                var row = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                glayout.addColumn(column);
                glayout.addRow(row);
                radioGroup.addChild(radiobutton[cont]);
                
                if (x > 1) {
                    glayout.addChild(radioGroup);
                    slayout.addChild(glayout);
                }
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
       
    page.content = slayout;
    }
}

// functions of action bar
exports.options0 = function() {
    alert("OPTIONS 0");
}

exports.options1 = function() {
    alert("OPTIONS 1"); 
}