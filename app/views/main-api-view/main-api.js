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
var Connection = require("../../shared/DB_connection");
var con = new Connection();
var id;
var timer = require("timer");

// vars storage
var urlJson = localstorage.getItem("server_url") + "/form.json";
var colorActionBar = localstorage.getItem("color_actionBar");
var colorButtons = localstorage.getItem("color_buttons");

var pathImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSes5bRVvn-xkiDHTOtXi4yzXkccSO2Ugo0JtHZP2D54GsC6yeZ1g";
var data = "";
var changeImg = 0;
exports.mainMenu = function(args)
{    
    page = args.object;
    
    // action bar
    var bar = new actionBarModule.ActionBar();
    bar.title = "Menu - Api View";
    bar.backgroundColor = colorActionBar;
    page.actionBar = bar;

    // Initiate database connection
    con.init();
    // Starts ANONYMOUS connection to database
    con.login();

    requestJson(); 

    // timer para mudar imagem
	id = timer.setInterval(function() {       
        if (changeImg == 0) {
            changeImg = 1;
            pathImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSes5bRVvn-xkiDHTOtXi4yzXkccSO2Ugo0JtHZP2D54GsC6yeZ1g";
        }
        else if (changeImg == 1) {
            changeImg = 0;
            pathImage = "http://www.clickgratis.com.br/fotos-imagens/imagem/aHR0cDovL3d3dy5jbGlja2dyYXRpcy5jb20uYnIvZm90b3MtaW1hZ2Vucy9pbWFnZW0vYUhSMGNEb3ZMM2QzZHk1aGNISmxibVJsY21WNFkyVnNMbU52YlM1aWNpOHZhVzFoWjJWdWN5OXViM1JwWTJsaEx6TTROUzh5T1RBeExURXVhbkJuLmpwZw==.jpg";
        }
        drawJson(data);        
    }, 5000);  // a cada 15 segundos muda de imagem
}

requestJson = function()
{    
    fetch(urlJson).then(response =>
    {
        return response.json();
    })
    .then(function (r)
    {
        data = r;
        drawJson(data);
    });   
}

drawImage = function(s, path)
{
    // draw image
    var image = new imageModule.Image();
    image.src = path;                 
    s.addChild(image);
}

drawJson = function(data)
{
    var radioGroup = new radioModule.RadioGroup();
    var glayout = new gridLayout.GridLayout();
    var slayout = new stackLayout.StackLayout();
    var image = new imageModule.Image();
    savePathImage = new Array();
    var button = new Array();
    var radiobutton = new Array();
    var num = data.length;
    var x = 0;
    var y = 1;
    drawImage(slayout, pathImage);
    for(i = 0; i < num; i++)
    {
        const cont = i;
        
        switch(data[i].Type)
        {
            case "button":
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
                button[cont].backgroundColor = colorButtons;
                button[cont].formattedText = formattedString;
                button[cont].className = "btnIcon";
                button[cont].value = data[i].typeview;
                button[cont].on(buttonModule.Button.tapEvent, function()
                {

                    timer.clearInterval(id);
                    
                    // verifica se é options
                    if(button[cont].value == "options")
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
                                typeView: button[cont].value
                            }
                    }
                        topmost.navigate(navigationOptions);
                    }
                });

                // columns and rows of datagrid
                if(x >= 1)
                {
                    x = 0;
                    y += 1;
                } 
                else
                {
                    x += 1;
                }

                gridLayout.GridLayout.setColumn(button[cont], x);
                gridLayout.GridLayout.setRow(button[cont], y);             
                               
                var column = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                var row = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                glayout.addColumn(column);
                glayout.addRow(row);
                glayout.addChild(button[cont]);              
            break;
            case "radiobutton":
                radiobutton[cont] = new radioModule.RadioButton();
                radiobutton[cont].id = data[i].id;
                radiobutton[cont].on(buttonModule.Button.tapEvent, function()
                {
                    savePathImage[cont] = data[cont].linkImg;
                    pathImage = data[cont].linkImg;
                    drawJson(data);
                });
                
                gridLayout.GridLayout.setColumn(radiobutton[cont], x);
                gridLayout.GridLayout.setRow(radiobutton[cont], y);
                x += 1;
                y += 1;          
                var column = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                var row = new gridLayout.ItemSpec(1, gridLayout.GridUnitType.auto);
                glayout.addColumn(column);
                glayout.addRow(row);
                radioGroup.addChild(radiobutton[cont]);
                
                if(x > 1)
                {
                    glayout.addChild(radioGroup);
                    slayout.addChild(glayout);
                }
            break; 
        }
    page.content = slayout;
    }
}

// functions of action bar
exports.options0 = function()
{
    alert("OPTIONS 0");
}

exports.options1 = function()
{
    alert("OPTIONS 1"); 
}