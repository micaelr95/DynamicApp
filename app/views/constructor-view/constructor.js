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
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
var Connection = require("../../shared/DB_connection");
var con = new Connection();
var page;

function createRows(numbRows , arrayRows , gridLayout, RowHeight, RowMode) {

    for ( i = 0 ; i < numbRows ; i++ )
    {

        arrayRows[i] = new gridModule.ItemSpec(RowHeight, gridModule.GridUnitType[RowMode]);
        gridLayout.addRow(arrayRows[i]);


    }

}

function createColumns(numbColumns , arrayColumns , gridLayout, ColumnHeight, ColumnMode) {

    for ( i = 0 ; i < numbColumns ; i++ )
    {
            arrayColumns[i] = new gridModule.ItemSpec(ColumnHeight, gridModule.GridUnitType[ColumnMode]);

        gridLayout.addColumn(arrayColumns[i]);

    }

}

function drawList(data,viewGrid) {

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
    
    for( i = 0 ; i < numbColumns /* Numero de Campos */ ; i++ ){

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

    for( i = 0 ; i < numbColumns ; i++ ){

        if( i == 0 ){

            numbColumnsStars += "*";
            
        } else {

            numbColumnsStars += ",*";

        }
    }

    numbColumnsStars += ", auto'";

    var columnLabels = "<GridLayout " + numbColumnsStars + " rows='auto, *' >";

    for( i = 0 ; i < numbColumns ; i++ ){

        columnLabels += "<Label text='{{" + titleArray[i] + "}}' col='" + i + "' />";

    }

    columnLabels += "</GridLayout>";

    xList.itemTemplate = columnLabels;
    xList.className = "Info";

    var listArray = new Array();
    var listItems = {};

    for( i = 0 ; i < data.campsInfo[0].length ; i++ ){

        listItems = {};

        for( j = 0 ; j < numbColumns ; j++ ){

            listItems[titleArray[j]] = data.campsInfo[j][i];
            localStorage.setItem( "listItems" + j + i , data.campsInfo[j][i] );

        }

        listArray.push(listItems);

    }

    xList.items = listArray;
    

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

requestForm = function(constructorForm,viewGrid) {

    var urlForm = localStorage.getItem("server_url");

    if( constructorForm == "form" ){

        urlForm += "/constructForm.json";

    } else if( constructorForm == "list" ){

        urlForm += "/list.json"

    } else if( constructorForm == "webview" ){

        urlForm += "/webview.json"

    } else {

        urlForm += "/options.json"

    }

    fetch(urlForm).then(response => {
        return response.json();
    })
    .then(function (r) {
        var data = r;

        if( constructorForm == "form" ){

        drawForm(data,viewGrid);

        } else if( constructorForm == "list" ){

            drawList(data,viewGrid);

        } else if( constructorForm == "webview" ){

            drawWebView(data);

        } else {

            drawOptions(data);

        }

    });   
}

drawForm = function(data,viewGrid){
    var fieldsSize = data.length;

    var newStackLayout = new stackModule.StackLayout();

    var fieldsArray = new Array();
    
    for(i=0; i < fieldsSize; i++){
        switch(data[i].type){
            case "checkbox":
                fieldsArray[i] = new checkModule.CheckBox();
                fieldsArray[i].value = data[i].value;
                fieldsArray[i].id = data[i].id;
                fieldsArray[i].text = data[i].text;

                newStackLayout.addChild(fieldsArray[i]);
            break;

            case "dropdown":
                var arrayDados = new Array();
                fieldsArray[i] = new dropModule.DropDown();
                fieldsArray[i].items = data[i].items;
                fieldsArray[i].id = data[i].id;

                newStackLayout.addChild(fieldsArray[i]);
            break;

            case "radiogroup":
                fieldsArray[i] = new radioBtnModule.RadioGroup();
                fieldsArray[i].id = data[i].id;
                newStackLayout.addChild(fieldsArray[i]);
        
            break;

            case "radiobutton":
                fieldsArray[i] = new radioBtnModule.RadioButton();
                fieldsArray[i].id = data[i].id;
                fieldsArray[i].text = data[i].text;
                fieldsArray[i].value = data[i].value;

                newStackLayout.getViewById(data[i].group).addChild(fieldsArray[i]);
            break;

            case "label":
                fieldsArray[i] = new labelModule.Label();
                fieldsArray[i].id = data[i].id;
                fieldsArray[i].text = data[i].text;

                newStackLayout.addChild(fieldsArray[i]);
            break;

            case "textfield":
                fieldsArray[i] = new textFieldModule.TextField();
                fieldsArray[i].hint = data[i].hint;
                fieldsArray[i].id = data[i].id;

                newStackLayout.addChild(fieldsArray[i]);
            break;
            
            default:
            break;
        }
    }
    var verif = new buttonModule.Button();
    verif.text = "verif";
    newStackLayout.addChild(verif);

    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);

    gridModule.GridLayout.setColumn(newStackLayout,0);
    gridModule.GridLayout.setRow(newStackLayout,0);
    gridModule.GridLayout.setColumnSpan(newStackLayout,3);

    viewGrid.addChild(newStackLayout);

    page.content = viewGrid;

    verif.on(buttonModule.Button.tapEvent, function (){
        //fieldsArray[i].checkedButton
       // console.dump(fieldsArray[5]);
      //  console.dump(fieldsArray[5].checkedButton);
        console.dump(newStackLayout._childrenCount);
    });

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
                case "radiobutton":
                        submitInfo[i-cont] = fieldsArray[i].value;
                        varNames[i-cont] = data[i].varName;
                break;
                case "label":
                    cont +=1;
                break;
                default:
                break;
            }
        }

       con.add('/aasd', submitInfo);
    });
}


function drawWebView(data){
    var mygrid = new gridModule.GridLayout();
    var txt1 = new textFieldModule.TextField();
    var btnsearch = new buttonModule.Button();
    var myweb = new webModule.WebView();

    var colunas = new Array();
    var linhas = new Array();

    //txt1.height = 30;
    txt1.id = "txtsearch";

    //btnsearch.height = 30;
    btnsearch.text = "Search";
    btnsearch.id = "btnsearch";

    if(data.defaultUrl == "" || data.url_prefix == ""){
        myweb.url = "";
        txt1.text = "";
        alert("Default URL or prefix is not defined");
    }else{
        myweb.url = data.url_prefix + data.defaultUrl;
        txt1.text = data.defaultUrl;
    }
    
    btnsearch.on(buttonModule.Button.tapEvent, function (){
        myweb.url = data.url_prefix + txt1.text;
    });

    createRows(1,linhas,mygrid,50,"pixel");
    createRows(1,linhas,mygrid,500,"pixel");
    createColumns(1,colunas,mygrid,230,"pixel");
    createColumns(1,colunas,mygrid,90,"pixel");

    gridModule.GridLayout.setColumn(txt1,0);
    gridModule.GridLayout.setRow(txt1,0);
    mygrid.addChild(txt1);

    gridModule.GridLayout.setColumn(btnsearch,1);
    gridModule.GridLayout.setRow(btnsearch,0);
    mygrid.addChild(btnsearch);

    gridModule.GridLayout.setColumn(myweb,0);
    gridModule.GridLayout.setRow(myweb,1);
    gridModule.GridLayout.setColumnSpan(myweb, 2)
    mygrid.addChild(myweb);

    page.content = mygrid;

}

exports.constructorLoad = function(args) {
    page = args.object;

    /*page.actionBar.backgroundColor = "brown";
    page.actionBar.color = "white";
    page.actionBar.title = "ListView";*/


    var gotData = page.navigationContext;
    var Info = gotData.typeView;

    var viewGrid = new gridModule.GridLayout();
    var arrayRows = new Array();
    var arrayColumns = new Array();

    createRows(1,arrayRows,viewGrid,1,"star");
    createRows(1,arrayRows,viewGrid,50,"pixel");
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
    button1.on(buttonModule.Button.tapEvent , function() {

        var navigationOptions = {

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
    button2.on(buttonModule.Button.tapEvent , function() {

        var navigationOptions = {

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
    button3.on(buttonModule.Button.tapEvent , function() {

        var navigationOptions = {

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

   if( Info.toLowerCase() == "list" ){

        requestForm("list",viewGrid);

   } else if ( Info.toLowerCase() == "form" ) {

        requestForm("form",viewGrid);

   } else if ( Info.toLowerCase() == "webview" ) {

        requestForm("webview",viewGrid);

   } else if ( Info.toLowerCase() == "options" ) {

        // requestForm("options",viewGrid);

   } else {

        alert("NOPE!");
        //error

   }
}

exports.onAdd = function(args) {

    page = args.object;
    
    var navigationOptions = {

            moduleName: "views/add-list/addlist"

    }
        
    topmost.navigate(navigationOptions);

}
