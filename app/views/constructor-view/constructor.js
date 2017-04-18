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
var localStorage = require("nativescript-localstorage");

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

function createList(page) {
    var viewModule = new observable.Observable();
    
    var thatboi = ["Oi","Ola","Feito"];
    var layout = new stackModule.StackLayout();
    var headerGrid = new gridModule.GridLayout();
    var arrayColumns = Array();
    var arrayRows = Array();
    var numbColumns = 3;
    var numbRows = 1;
    
    createRows(numbRows , arrayRows , headerGrid);
    createColumns(numbColumns , arrayColumns , headerGrid);

    //for( i = 0 ; i < numbColumns ; i++ ){
//
  //      headerGrid.GridLayout.setColumn(thatboi[i], i );
    //    headerGrid.GridLayout.setRow(thatboi[i], 0 );
      //  headerGrid.addChild(thatboi[i]);
//
  //  }

    layout.addChild(headerGrid);

    page.content = layout;

}

function createForm(page){
    pageForm = page;
    var viewModule = new observable.Observable();

    var myJSON = '{"form":[{"Type":"textfield","id":"textfield1","text":"","hint":"write your email","varName":"email"},{"Type":"button","id":"button1","text":"click me","varName":"buttaooo","value":"coiso"},{"Type":"checkbox","id":"checkbox","text":"click me","varName":"checkvalue","value":"coisito"},{"Type":"dropdown","id":"dropdown","items":["Escolha uma opção","as","oi"],"varName":"dropDown"},{"Type":"radiobutton","id":"radiobutton","text":"radio","varName":"radiobuttton","value":"coisital"}]}';

    var jaaason = JSON.parse(myJSON);
    var fieldsSize = jaaason.form.length;
    
    var newStackLayout = new stackModule.StackLayout();

    var fieldsArray = new Array();

    for(i=0; i < fieldsSize; i++){
        switch(jaaason.form[i].Type){
            case "checkbox":
                fieldsArray[i] = new checkModule.CheckBox();
            break;
            case "dropdown":
                fieldsArray[i] = new dropModule.DropDown();
                fieldsArray[i].items = jaaason.form[i].items;
            break;
            case "radiobutton":
                fieldsArray[i] = new radioBtnModule.RadioButton();
                fieldsArray[i].radioGroup = jaaason.form[i].group;
            break;
            case "button":
                fieldsArray[i] = new buttonModule.Button();
            break;
            case "label":
                fieldsArray[i] = new labelModule.Label();
            break;
            case "textfield":
                fieldsArray[i] = new textFieldModule.TextField();
                fieldsArray[i].hint = jaaason.form[i].hint;
            break;
        }
        fieldsArray[i].id = jaaason.form[i].id;
        fieldsArray[i].text = jaaason.form[i].text;
        fieldsArray[i].value = jaaason.form[i].value;
            var fieldBindOptions = {

                sourceProperty: jaaason.form[i].varName,
                targetProperty: jaaason.form[i].defaultValue,
                twoWay: true
        }
        
        fieldsArray[i].bind(fieldBindOptions,viewModule);
        newStackLayout.addChild(fieldsArray[i]);
            
    }
    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);
    pageForm.content = newStackLayout;

    submitBtn.on(buttonModule.Button.tapEvent, function (){
        var submitInfo = "";
        for(i = 0; i < fieldsSize; i++)
        {
            switch(jaaason.form[i].Type)
            {
                case "textfield":
                    viewModule[jaaason.form[i].varName] = fieldsArray[i].text;
                    console.log(viewModule[jaaason.form[i].varName]);

                break;
                case "dropdown":
                    viewModule[jaaason.form[i].varName] = fieldsArray[i].items[fieldsArray[i].selectedIndex];
                    console.log(viewModule[jaaason.form[i].varName]);

                break;
                case "checkbox":
                    viewModule[jaaason.form[i].varName] = fieldsArray[i].checked;
                    console.log(viewModule[jaaason.form[i].varName]);

                break;
                case "radiobutton":
                    viewModule[jaaason.form[i].varName] = fieldsArray[i].checked;
                    console.log(viewModule[jaaason.form[i].varName]);
                break;
                case "button":
                    //pedro QR code;
                break;
            }
        }
        for(j = 0; j < fieldsSize; j++){
            if (j == 0){
                submitInfo = viewModule[jaaason.form[j].varName];
            }
            else{
                submitInfo = submitInfo + "," + viewModule[jaaason.form[j].varName];
            }
        }

    console.log(submitInfo);
    });
}


function createWebView(page){
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

    if(localStorage.getItem("default_url") == null){
        myweb.url = "";
        txt1.text = "http://";
        alert("URL is not defined");
    }else{
        myweb.url = localStorage.getItem("default_url");
        txt1.text = localStorage.getItem("default_url");
    }
    
    btnsearch.on(buttonModule.Button.tapEvent, function (){
        myweb.url = txt1.text;
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

    var page = args.object
    //info = button value; JSON constructor comes from the button JSON parameter
    var Info = "webview";
    //localStorage.setItem("default_url","http://www.google.com");
    //localStorage.clear();
   if( Info.toLowerCase() == "list" ){

        createList();

   } else if ( Info.toLowerCase() == "form" ) {

        createForm(page);

   } else if ( Info.toLowerCase() == "webview" ) {

        createWebView(page);

   } else if ( Info.toLowerCase() == "options" ) {

        createOptions();

   } else {

        alert("NOPE!");

   }

}