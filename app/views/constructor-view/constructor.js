var app = require("application");
var stackModule = require("ui/layouts/stack-layout");
var gridModule = require("ui/layouts/grid-layout");
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

function createView(finalView , drawView , formName)
{
    page.actionBar.title = formName;

    gridModule.GridLayout.setColumn(drawView,0);
    gridModule.GridLayout.setRow(drawView,0);
    gridModule.GridLayout.setColumnSpan(drawView,3);

    finalView.addChild(drawView);

}

function createBottomNavButton(viewGrid,iconString,navTo,booleanClear,row,col)
{
    var xButton = new buttonModule.Button();
    var textSpan = new spansModule.Span();
    var xFormattedString = new formattedStringModule.FormattedString();
    var xIconSpan = new spansModule.Span();

    var xButton_bgColor = localStorage.getItem("color_actionBar");

    xButton.className = "btnIcon";
    xButton.backgroundColor = xButton_bgColor;
    xButton.color = localStorage.getItem("color_textColor")

    xButton.borderColor = "black"
    
    xIconSpan.fontSize = 25;
    xIconSpan.text = String.fromCharCode(iconString);

    xFormattedString.spans.push(xIconSpan);

    xButton.formattedText = xFormattedString;
    xButton.on(buttonModule.Button.tapEvent , function()
    {
        var navigationOptions =
        {
            moduleName: navTo,
            clearHistory: booleanClear
        }
        
        topmost.navigate(navigationOptions);
    });

    gridModule.GridLayout.setColumn(xButton,col);
    gridModule.GridLayout.setRow(xButton,row);
    viewGrid.addChild(xButton);

}

function drawList(data,viewGrid)
{

    var viewLayout = new gridModule.GridLayout();

    var arrayRows = new Array();
    var arrayColumns = new Array();

    var numbColumns = data.camps.length; //        <---| Numero de Campos
    var titleArray = data.camps; //                <---| Informação dada pelo JSON
    var toShowCamps = data.showCamps.campLocation.length;
    createColumns(toShowCamps,arrayColumns,viewLayout,1,"star");
    createRows(1,arrayRows,viewLayout,50,"pixel"); //  |
    createRows(1,arrayRows,viewLayout,1,"auto");   //  |
                                                   //  |
                                          //       ____|
    var xLabels = new Array(toShowCamps); //  <---| Numero de Campos
    var xList = new listViewModule.ListView();
    
    // Adicionar titulos e guardar localmente variaveis com o numbCamps etc...

    for(i = 0 ; i < numbColumns /* Numero de Campos */ ; i++)
    {
        localStorage.setItem("camp" + i , titleArray[i]);
    }

    for(i = 0 ; i < toShowCamps ; i++)
    {
        xLabels[i] = new labelModule.Label();
        xLabels[i].text = titleArray[data.showCamps.campLocation[i]];
        xLabels[i].className = "Title";

        localStorage.setItem("toShowCamp" + i , titleArray[data.showCamps.campLocation[i]]);
        localStorage.setItem("locationCamp" + i , "0");
        
        gridModule.GridLayout.setColumn(xLabels[i],i);
        gridModule.GridLayout.setRow(xLabels[i],0);
        viewLayout.addChild(xLabels[i]);
    }

    localStorage.setItem("campsNumber" , numbColumns);
    localStorage.setItem("numberItems" , data.campsInfo[0].length);
    localStorage.setItem("toShowCamps" , toShowCamps);

    localStorage.setItem("xList_itemTemplate" , data.itemTemplate);
    xList.itemTemplate = data.itemTemplate;
    xList.className = "Info";

    var listArray = new Array();
    var listItems = {};

    // Guardar dados localmente

    for(i = 0 ; i < data.campsInfo[0].length ; i++)
    {
        for(j = 0 ; j < numbColumns ; j++)
        {
            localStorage.setItem( "listItems" + j + i , data.campsInfo[j][i] );
        }
    }

    for(i = 0 ; i < data.campsInfo[0].length ; i++)
    {
        listItems = {};
        for(j = 0 ; j < toShowCamps ; j++)
        {
            listItems[titleArray[j]] = data.campsInfo[data.showCamps.campLocation[j]][i];
        }
        listArray.push(listItems);
    }

    xList.items = listArray;

    // Remove Item

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

                    for(j = 0 ; j < (localStorage.getItem("numberItems") - 1 ); j++)
                    {

                        if( j == tappedItemIndex ){

                            if( j == localStorage.getItem("numberItems")){

                            } else {

                                j++;

                                infoArray.push(localStorage.getItem("listItems" + i + j ));

                            }

                        } else {

                            infoArray.push(localStorage.getItem("listItems" + i + j ));

                        }

                    }

                    stuff[i] = infoArray;

                    localStorage.removeItem("listItems" + i + j );

                }   

                for(i = 0 ; i < parseInt(localStorage.getItem("campsNumber")); i++)
                {

                    con.addListInfo('/list/campsInfo/' + i , stuff[i]);

                }

                alert("Removido");

                var navigationOptions = {

                    moduleName: "views/constructor-view/constructor",
                    context: { typeView: "list" }
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

    createView(viewGrid , viewLayout , "ListView");
    
    page.content = viewGrid;
};

localDrawList = function(viewGrid){

    var viewLayout = new gridModule.GridLayout();

    var arrayRows = new Array();
    var arrayColumns = new Array();

    var toShowCamps = localStorage.getItem("toShowCamps");
    var titleArray = [];

    for( i = 0 ; i < toShowCamps ; i++ )
    {
        titleArray[i] = localStorage.getItem("toShowCamp"+i);
    }

    createColumns(toShowCamps,arrayColumns,viewLayout,1,"star");
    createRows(1,arrayRows,viewLayout,50,"pixel");
    createRows(1,arrayRows,viewLayout,1,"auto");
   
    var xLabels = new Array();
    var xList = new listViewModule.ListView();
    
    // Adicionar titulos e guardar localmente variaveis com o numbCamps etc...

    for(i = 0 ; i < toShowCamps /* Numero de Campos */ ; i++)
    {
        xLabels[i] = new labelModule.Label();
        xLabels[i].text = titleArray[i];
        xLabels[i].className = "Title";

        gridModule.GridLayout.setColumn(xLabels[i],i);
        gridModule.GridLayout.setRow(xLabels[i],0);
        viewLayout.addChild(xLabels[i]);
    }

    xList.itemTemplate = localStorage.getItem("xList_itemTemplate");
    xList.className = "Info";

    var listArray = new Array();
    var listItems = {};

    // Guardar dados localmente

    for(i = 0 ; i < localStorage.getItem("numberItems") ; i++)
    {
        listItems = {};
        for(j = 0 ; j < toShowCamps ; j++)
        {
            listItems[titleArray[j]] = localStorage.getItem("listItems" + localStorage.getItem("locationCamp"+j) + i);
        }
        listArray.push(listItems);
    }

    xList.items = listArray;

    gridModule.GridLayout.setColumn(xList,0);
    gridModule.GridLayout.setRow(xList,1);
    gridModule.GridLayout.setColumnSpan(xList,toShowCamps);
    
    viewLayout.addChild(xList);

    createView(viewGrid , viewLayout , "ListView");
    
    page.content = viewGrid;
};

requestForm = function(constructorForm,viewGrid)
{
    var urlForm = localStorage.getItem("server_url");

    if(constructorForm == "form")
    {
        urlForm += "/constructForm.json";
            localStorage.setItem("currentPage" , "form");
    }
    else if(constructorForm == "list")
    {
        urlForm += "/list.json"
            localStorage.setItem("currentPage" , "list");
    }
    else if(constructorForm == "webview")
    {
        urlForm += "/webview.json"
            localStorage.setItem("currentPage" , "webView");
    }

    fetch(urlForm).then(response =>
    {
        localStorage.setItem("formLocal" , response._bodyText);
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
    }).catch(function(error){

        if(constructorForm == "list")
        {
            page.actionBar.actionItems._items[0].visibility = "collapse";
            localDrawList(viewGrid);
        }
        else if(constructorForm == "form")
        {
            drawForm(JSON.parse(localStorage.getItem("formLocal")) , viewGrid);
        }

    });   
}

drawForm = function(data,viewGrid){

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

    createView(viewGrid , scrollView , "FormView");

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
        alert("Sended to database");
        var navigationOptions =
        {
            moduleName: "views/main-api-view/main-api",
            clearHistory: true
        }
        topmost.navigate(navigationOptions);
    });
}

function drawWebView(data,viewGrid)
{
    page.actionBar.title = "WebView"

    var mygrid = new gridModule.GridLayout();
    var myweb = new webModule.WebView();
    myweb.id = "cenas";

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

    createView(viewGrid , mygrid , "WebView");


    page.content = viewGrid
    var coco = page.getViewById("cenas");
    coco.android.getSettings().setBuiltInZoomControls(false);
}

exports.constructorLoad = function(args)
{
    page = args.object;

    page.bindingContext = { ActionColor: localStorage.getItem("color_actionBar")};
    page.actionBar.actionItems._items[0].visibility = "collapse";
    page.actionBar.color = localStorage.getItem("color_textColor");

    var gotData = page.navigationContext;
    var Info = gotData.typeView;

    var viewGrid = new gridModule.GridLayout();
    var arrayRows = new Array();
    var arrayColumns = new Array();

    createRows(1,arrayRows,viewGrid,1,"star");
    createRows(1,arrayRows,viewGrid,45,"pixel");
    createColumns(3,arrayColumns,viewGrid,1,"star");

    createBottomNavButton(viewGrid,"0xef015","views/main-api-view/main-api",true,1,0);
    createBottomNavButton(viewGrid,"0xef015","views/main-api-view/main-api",true,1,1);
    createBottomNavButton(viewGrid,"0xef013","views/options-view/options",false,1,2);

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
