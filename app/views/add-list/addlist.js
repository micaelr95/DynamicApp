var textFieldModule = require("ui/text-field");
var stackModule = require("ui/layouts/stack-layout");
var buttonModule = require("ui/button");
var frameModule = require("ui/frame");
var topmost = frameModule.topmost();
var Connection = require("../../shared/DB_connection");
var con = new Connection();

exports.addlistLoad = function(args)
{
    var page = args.object;
    page.actionBar.backgroundColor = localStorage.getItem("color_actionBar");
    page.actionBar.color = "white"; // change to localstorage when u get text color from server

    var stackView = new stackModule.StackLayout();
    var items = [];
    var numberX = parseInt(localStorage.getItem("campsNumber"));

    for(i = 0 ; i < numberX ; i++ )
    {
        items[i] = localStorage.getItem("camp" + i );
    }

    var textboxArray = new Array();

    for(i = 0 ; i < items.length ; i ++ )
    {
        textboxArray[i] = new textFieldModule.TextField();
        textboxArray[i].hint = items[i];
        stackView.addChild(textboxArray[i]);
    }

    var submitBtn = new buttonModule.Button();
    submitBtn.text = "Submit";
    submitBtn.className = "submitBtn";
    submitBtn.backgroundColor = localStorage.getItem("color_buttons");

    submitBtn.on(buttonModule.Button.tapEvent , function()
    {
        var stuff = [];
        var infoArray = [];

        for(i = 0 ; i < parseInt(localStorage.getItem("campsNumber")); i++)
        {
            infoArray = [];

            for(j = 0 ; j < parseInt(localStorage.getItem("numberItems")); j++)
            {
                infoArray.push(localStorage.getItem("listItems" + i + j));
            }
            localStorage.setItem("listItems" + i + j , textboxArray[i].text );
            infoArray.push(textboxArray[i].text);
            stuff[i] = infoArray;
        }

        for(i = 0 ; i < parseInt(localStorage.getItem("campsNumber")); i++)
        {
            con.addListInfo('/list/campsInfo/' + i , stuff[i]);
        }
        localStorage.setItem("numberItems" , (localStorage.getItem("numberItems") + 1));
        topmost.goBack();
    });
    
    stackView.addChild(submitBtn);
    
    page.content = stackView;
}