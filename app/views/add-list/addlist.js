var textFieldModule = require("ui/text-field");
var stackModule = require("ui/layouts/stack-layout");
var buttonModule = require("ui/button");
var frameModule = require("ui/frame");
var topmost = frameModule.topmost();
var Connection = require("../../shared/DB_connection");
var con = new Connection();

exports.addlistLoad = function(args)
{

    localStorage.setItem("addlist" , "true");
    localStorage.setItem("currentPage" , "addlist");

    var page = args.object;
    var gotData = page.navigationContext;

    var targetTable = localStorage.getItem("targetTable");

    var options = localStorage.getItem("Options");
    var data = localStorage.getItem(targetTable);


    page.actionBar.backgroundColor = options.color_actionBar;
    page.actionBar.color = options.color_text;
    
    var stackView = new stackModule.StackLayout();
    var numberX = data.camps.length;
    var textboxArray = new Array();
    var submitBtn = new buttonModule.Button();

    submitBtn.className = "submitBtn";
    submitBtn.backgroundColor = options.color_button;
    submitBtn.color = options.color_text;

    for(i = 0 ; i < data.camps.length ; i ++ )
    {
        textboxArray[i] = new textFieldModule.TextField();
        textboxArray[i].hint = data.camps[i];
        stackView.addChild(textboxArray[i]);
    }

    if( gotData == undefined )
    {

        submitBtn.text = "Adicionar";

        submitBtn.on(buttonModule.Button.tapEvent , function()
        {
            var stuff = [];
            var infoArray = [];

            for(i = 0 ; i < data.camps.length ; i++)
            {
                infoArray = [];
                for(j = 0 ; j < data.campsInfo[0].length ; j++)
                {
                    infoArray.push(data.campsInfo[i][j]);
                }
                infoArray.push(textboxArray[i].text);
                stuff[i] = infoArray;
            }

            for(i = 0 ; i < data.camps.length; i++)
            {
                con.addListInfo('/list/campsInfo/' + i , stuff[i]);
            }

            data.campsInfo = stuff;

            localStorage.setItem(localStorage.getItem("targetTable") , data);

            alert("Registo adicionado");

            topmost.goBack();
        });

    }
    else
    {

        var tappedItem = gotData.info;

        for(i = 0 ; i < data.camps.length ; i ++ )
        {
            textboxArray[i].text = data.campsInfo[i][tappedItem];
        }

        submitBtn.text = "Alterar";

        submitBtn.on(buttonModule.Button.tapEvent , function()
        {
            var stuff = [];
            var infoArray = [];

            for(i = 0 ; i < data.camps.length ; i++)
            {
                infoArray = [];
                for(j = 0 ; j < data.campsInfo[0].length ; j++)
                {
                    if(j == tappedItem)
                    {
                        infoArray.push(textboxArray[i].text);
                    }
                    else
                    {
                        infoArray.push(data.campsInfo[i][j]);
                    }
                }
                stuff[i] = infoArray;
            }

            for(i = 0 ; i < data.camps.length; i++)
            {
                con.addListInfo('/list/campsInfo/' + i , stuff[i]);
            }

            data.campsInfo = stuff;

            localStorage.setItem(localStorage.getItem("targetTable") , data);

            alert("Registo alterado");

            topmost.goBack();
        });

    }
    
    stackView.addChild(submitBtn);
    
    page.content = stackView;
}