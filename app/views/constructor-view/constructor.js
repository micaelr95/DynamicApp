var app = require("application");
var stackModule = require("ui/layouts/stack-layout");
var gridModule = require("ui/layouts/grid-layout");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var checkModule = require("nativescript-checkbox");
var dropModule = require("nativescript-drop-down");
var radioBtnModule = require("nativescript-radiobutton");
var buttonModule = require("ui/button");
var labelModule = require("ui/label");
var listViewModule = require("ui/list-view");
var scrollModule = require("ui/scroll-view");
var textFieldModule = require("ui/text-field");
var webModule = require("ui/web-view");
var frameModule = require("ui/frame");
var topmost = frameModule.topmost();
var localStorage = require("nativescript-localstorage");
var spansModule = require("text/span");
var formattedStringModule = require("text/formatted-string");
var dialogs = require("ui/dialogs");
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
var Connection = require("../../shared/DB_connection");
var con = new Connection();
var page;

function createRows(numbRows , arrayRows , gridLayout, RowHeight, RowMode)
{
    for(i = 0 ; i < numbRows ; i++)
    {
        arrayRows[i] = new gridModule.ItemSpec(RowHeight, gridModule.GridUnitType[RowMode]);
        gridLayout.addRow(arrayRows[i]);
    }
}

function createColumns(numbColumns , arrayColumns , gridLayout, ColumnHeight, ColumnMode)
{
    for(i = 0 ; i < numbColumns ; i++)
    {
        arrayColumns[i] = new gridModule.ItemSpec(ColumnHeight, gridModule.GridUnitType[ColumnMode]);
        gridLayout.addColumn(arrayColumns[i]);
    }
}

function drawList(data,viewGrid)
{
    page.actionBar.backgroundColor = "brown";
    page.actionBar.color = "white";
    page.actionBar.title = "ListView"

    var viewLayout = new gridModule.GridLayout();

    var arrayRows = new Array();
    var arrayColumns = new Array();

    var numbColumns = data.camps.length; //        <---| Numero de Campos
    var titleArray = data.camps; //                <---| Informação dada pelo JSON
    createColumns(numbColumns,arrayColumns,viewLayout,1,"star");
    createRows(1,arrayRows,viewLayout,50,"pixel"); //  |
    createRows(1,arrayRows,viewLayout,1,"auto");   //  |
                                                   //  |
                                          //       ____|
    var xLabels = new Array(numbColumns); //  <---| Numero de Campos
    var xList = new listViewModule.ListView();
    
    for(i = 0 ; i < numbColumns /* Numero de Campos */ ; i++)
    {
        xLabels[i] = new labelModule.Label();
        xLabels[i].text = titleArray[i];
        xLabels[i].className = "Title";

        localStorage.setItem("camp" + i , titleArray[i]);

        gridModule.GridLayout.setColumn(xLabels[i],i);
        gridModule.GridLayout.setRow(xLabels[i],0);
        viewLayout.addChild(xLabels[i]);
    }

    localStorage.setItem("campsNumber" , numbColumns);
    localStorage.setItem("numberItems" , data.campsInfo[0].length);

    var numbColumnsStars = "columns='";

    for(i = 0 ; i < numbColumns ; i++)
    {
        if(i == 0)
        {
            numbColumnsStars += "*";
        }
        else
        {
            numbColumnsStars += ",*";
        }
    }

    numbColumnsStars += ", auto'";

    var columnLabels = "<GridLayout " + numbColumnsStars + " rows='auto, *' >";

    for(i = 0 ; i < numbColumns ; i++)
    {
        columnLabels += "<Label text='{{" + titleArray[i] + "}}' col='" + i + "' />";
    }

    columnLabels += "</GridLayout>";

    xList.itemTemplate = columnLabels;
    xList.className = "Info";

    var listArray = new Array();
    var listItems = {};

    for(i = 0 ; i < data.campsInfo[0].length ; i++)
    {
        listItems = {};
        for(j = 0 ; j < numbColumns ; j++)
        {
            listItems[titleArray[j]] = data.campsInfo[j][i];
            localStorage.setItem( "listItems" + j + i , data.campsInfo[j][i] );
        }
        listArray.push(listItems);
    }

    xList.items = listArray;

    xList.on(listViewModule.ListView.itemTapEvent, function (args) {

        var tappedItemIndex = args.index;

        dialogs.confirm({

            title: "Remover",
            message: "Pretende remover este registo?",
            okButtonText: "OK",
            cancelButtonText: "CANCEL",

        }).then(function (result) {
            
            if( result == true)
            {

                var stuff = [];
                var infoArray = [];
                var removedItem = false;

                var i = 0;
                var j = 0;

                for(i = 0 ; i < localStorage.getItem("campsNumber"); i++)
                {

                    infoArray = [];

                    for(j = 0 ; j < localStorage.getItem("numberItems"); j++)
                    {

                        if( j == tappedItemIndex ){

                            if( j == (localStorage.getItem("numberItems") - 1 )){

                            } else {

                                j++;

                                infoArray.push(localStorage.getItem("listItems" + i + j ));

                            }

                        } else {

                            infoArray.push(localStorage.getItem("listItems" + i + j ));

                        }

                    }

                    stuff[i] = infoArray;

                }    

                for(i = 0 ; i < parseInt(localStorage.getItem("campsNumber")); i++)
                {

                    con.addListInfo('/list/campsInfo/' + i , stuff[i]);

                }

                var navigationOptions = {

                    moduleName: "views/constructor-view/constructor",
                    context: {
                                typeView: "list"
                             }
                    }
                
                topmost.navigate(navigationOptions);

            } else {}
            
        });

    });
    

    // Add ListView to View
    gridModule.GridLayout.setColumn(xList,0);
    gridModule.GridLayout.setRow(xList,1);
    gridModule.GridLayout.setColumnSpan(xList,numbColumns);
    
    viewLayout.addChild(xList);

    gridModule.GridLayout.setColumn(viewLayout,0);
    gridModule.GridLayout.setRow(viewLayout,0);
    gridModule.GridLayout.setColumnSpan(viewLayout,3);

    viewGrid.addChild(viewLayout);
    
    page.content = viewGrid;
}

requestForm = function(constructorForm,viewGrid)
{
    var urlForm = localStorage.getItem("server_url");

    if(constructorForm == "form")
    {
        urlForm += "/constructForm.json";
    }
    else if(constructorForm == "list")
    {
        urlForm += "/list.json"
    }
    else if(constructorForm == "webview")
    {
        urlForm += "/webview.json"
    }
    else
    {
        urlForm += "/options.json"
    }

    fetch(urlForm).then(response =>
    {
        return response.json();
    })
    .then(function (r)
    {
        var data = r;

        if(constructorForm == "form")
        {
            drawForm(data,viewGrid);
        }
        else if(constructorForm == "list")
        {
            drawList(data,viewGrid);
        }
        else if(constructorForm == "webview")
        {
            drawWebView(data,viewGrid);
        }
        else
        {
            drawOptions(data);
        }
    });   
}

drawForm = function(data,viewGrid){

    page.actionBar.backgroundColor = "brown";
    page.actionBar.color = "white";
    page.actionBar.title = "FormView"

    var fieldsSize = data.length;

    var newStackLayout = new stackModule.StackLayout();
    var scrollView = new scrollModule.ScrollView();

    var fieldsArray = new Array();

    for(i=0; i < fieldsSize; i++){
        const cont = i;
        switch(data[cont].type){
            case "checkbox":
                fieldsArray[cont] = new checkModule.CheckBox();
                fieldsArray[cont].value = data[cont].value;
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;

                newStackLayout.addChild(fieldsArray[cont]);
            break;

            case "dropdown":
                var arrayDados = new Array();
                fieldsArray[cont] = new dropModule.DropDown();
                fieldsArray[cont].items = data[cont].items;
                fieldsArray[cont].id = data[cont].id;

                newStackLayout.addChild(fieldsArray[cont]);
            break;

            case "radiogroup":
                fieldsArray[cont] = new radioBtnModule.RadioGroup();
                fieldsArray[cont].id = data[cont].id;
                newStackLayout.addChild(fieldsArray[cont]);
        
            break;

            case "radiobutton":
                fieldsArray[cont] = new radioBtnModule.RadioButton();
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;
                fieldsArray[cont].value = data[cont].value;

                newStackLayout.getViewById(data[cont].group).addChild(fieldsArray[cont]);
            break;

            case "label":
                fieldsArray[cont] = new labelModule.Label();
                fieldsArray[cont].id = data[cont].id;
                fieldsArray[cont].text = data[cont].text;

                newStackLayout.addChild(fieldsArray[cont]);
            break;

            case "textfield":
                fieldsArray[cont] = new textFieldModule.TextField();
                fieldsArray[cont].hint = data[cont].hint;
                fieldsArray[cont].id = data[cont].id;

                newStackLayout.addChild(fieldsArray[cont]);
            break;
            
            default:
            break;
        }
    }

    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);
    scrollView.content = newStackLayout;

    gridModule.GridLayout.setColumn(scrollView,0);
    gridModule.GridLayout.setRow(scrollView,0);
    gridModule.GridLayout.setColumnSpan(scrollView,3);

    viewGrid.addChild(scrollView);

    page.content = viewGrid;

    submitBtn.on(buttonModule.Button.tapEvent, function (){
        var submitInfo = new Array();
        var varNames = new Array();
        var cont = 0;
        for(i = 0; i < fieldsSize; i++)
        {
            switch(data[i].type)
            {
                case "textfield":
                        submitInfo[i-cont] = fieldsArray[i].text;
                        varNames[i-cont] = data[i].varName;
                break;
                case "dropdown":
                        submitInfo[i-cont] = fieldsArray[i].items[fieldsArray[i].selectedIndex];
                        varNames[i-cont] = data[i].varName;
                break;
                case "checkbox":
                        submitInfo[i-cont] = fieldsArray[i].checked;
                        varNames[i-cont] = data[i].varName;
                break;
                case "radiogroup":
                        var countt = fieldsArray[i]._childrenCount;
                        for(j = 0;j < countt; j ++){
                            if(fieldsArray[i]._subViews[j].checked == true){
                                submitInfo[i-cont] = fieldsArray[i]._subViews[j].value;
                                varNames[i-cont] = data[i].varName;
                            }
                        }
                break;
                case "label":
                    cont +=1;
                break;
                default:
                    cont +=1;
                break;
            }
        }

       con.add('/aasd', submitInfo);
    });
}

function drawWebView(data,viewGrid)
{
    page.actionBar.backgroundColor = "brown";
    page.actionBar.color = "white";
    page.actionBar.title = "WebView"

    var mygrid = new gridModule.GridLayout();
    var myweb = new webModule.WebView();

    var colunas = new Array();
    var linhas = new Array();

    if(data.defaultUrl == "" || data.url_prefix == "")
    {
        myweb.url = "";
        alert("Default URL or prefix is not defined");
    }
    else
    {
        myweb.url = data.url_prefix + data.defaultUrl;
    }

    createRows(1,linhas,mygrid,1,"star");
    createColumns(1,colunas,mygrid,1,"star");

    gridModule.GridLayout.setColumn(myweb,0);
    gridModule.GridLayout.setRow(myweb,0);
    mygrid.addChild(myweb);

    gridModule.GridLayout.setColumn(mygrid,0);
    gridModule.GridLayout.setRow(mygrid,0);
    gridModule.GridLayout.setColumnSpan(mygrid,3);
    viewGrid.addChild(mygrid);

    page.content = viewGrid;
}

exports.constructorLoad = function(args)
{
    page = args.object;

    page.actionBar.actionItems._items[0].visibility = "collapse";

    var gotData = page.navigationContext;
    var Info = gotData.typeView;

    var viewGrid = new gridModule.GridLayout();
    var arrayRows = new Array();
    var arrayColumns = new Array();

    createRows(1,arrayRows,viewGrid,1,"star");
    createRows(1,arrayRows,viewGrid,45,"pixel");
    createColumns(3,arrayColumns,viewGrid,1,"star");

    var textSpan = new spansModule.Span();

    var button1 = new buttonModule.Button();
    var button2 = new buttonModule.Button();
    var button3 = new buttonModule.Button();

    button1.className = "btnIcon";
    var formattedString1 = new formattedStringModule.FormattedString();
    var iconSpan1 = new spansModule.Span();
    iconSpan1.fontSize = 25;
    iconSpan1.text = String.fromCharCode("0xef015");
    formattedString1.spans.push(iconSpan1);
    button1.formattedText = formattedString1;
    button1.on(buttonModule.Button.tapEvent , function()
    {
        var navigationOptions =
        {
            moduleName: "views/main-api-view/main-api",
            clearHistory: true
        }
        
        topmost.navigate(navigationOptions);
    });

    button2.className = "btnIcon";
    var formattedString2 = new formattedStringModule.FormattedString();
    var iconSpan2 = new spansModule.Span();
    iconSpan2.fontSize = 25;
    iconSpan2.text = String.fromCharCode("0xef15c");
    formattedString2.spans.push(iconSpan2);
    button2.formattedText = formattedString2;
    button2.on(buttonModule.Button.tapEvent , function()
    {
        var navigationOptions =
        {
            moduleName: "views/main-api-view/main-api",
            clearHistory: true
        }
        
        topmost.navigate(navigationOptions);
    });

    button3.className = "btnIcon";
    var formattedString3 = new formattedStringModule.FormattedString();
    var iconSpan3 = new spansModule.Span();
    iconSpan3.fontSize = 25;
    iconSpan3.text = String.fromCharCode("0xef013");
    formattedString3.spans.push(iconSpan3);
    button3.formattedText = formattedString3;
    button3.on(buttonModule.Button.tapEvent , function()
    {
        var navigationOptions =
        {
            moduleName: "views/options-view/options"
        }
        topmost.navigate(navigationOptions);
    });

    gridModule.GridLayout.setColumn(button1,0);
    gridModule.GridLayout.setRow(button1,1);
    viewGrid.addChild(button1);
    
    gridModule.GridLayout.setColumn(button2,1);
    gridModule.GridLayout.setRow(button2,1);
    viewGrid.addChild(button2);

    gridModule.GridLayout.setColumn(button3,2);
    gridModule.GridLayout.setRow(button3,1);
    viewGrid.addChild(button3);

   if(Info.toLowerCase() == "list")
   {
        requestForm("list",viewGrid);
        page.actionBar.actionItems._items[0].visibility = "visible";
   }
   else if(Info.toLowerCase() == "form")
   {
        requestForm("form",viewGrid);
   }
   else if(Info.toLowerCase() == "webview")
   {
        requestForm("webview",viewGrid);
   }
   else if(Info.toLowerCase() == "options")
   {
        // requestForm("options",viewGrid);
   }
   else
   {
        alert("NOPE!");
   }
}

exports.onAdd = function(args)
{
    page = args.object;
    
    var navigationOptions =
    {
            moduleName: "views/add-list/addlist"
    }
    topmost.navigate(navigationOptions);
}
