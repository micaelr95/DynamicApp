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
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
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

function drawList(data) {

    console.dump(data);
    console.dump(data.camps);
    console.dump(data.campsInfo);
    console.log("CARALHO: " + data.camps.length);

   var viewLayout = new gridModule.GridLayout();

    var arrayRows = new Array();
    var arrayColumns = new Array();

    var numbColumns = data.camps.length; //        <---| Numero de Campos
    var titleArray = data.camps; //                <---| Informação dada pelo JSON                                                //     |
    createColumns(numbColumns,arrayColumns,viewLayout,1,"star");
    createRows(1,arrayRows,viewLayout,50,"pixel"); //  |
    createRows(1,arrayRows,viewLayout,1,"auto");   //  |
                                                   //  |
                                //       ______________|
    var xLists = new Array(3);  //  <---| Numero de Campos
    var xLabels = new Array(3); //  <---| Numero de Campos
    
    for( i = 0 ; i < numbColumns /* Numero de Campos */ ; i++ ){

        xLabels[i] = new labelModule.Label();
        xLabels[i].text = titleArray[i];
        xLabels[i].className = "Title";

        gridModule.GridLayout.setColumn(xLabels[i],i);
        gridModule.GridLayout.setRow(xLabels[i],0);
        viewLayout.addChild(xLabels[i]);

    }

    for( i = 0 ; i < numbColumns /* Numero de Campos */ ; i++ ){

        xLists[i] = new listViewModule.ListView();
        xLists[i].items = [];
        xLists[i].items = data.campsInfo[i];
        xLists[i].className = "Info";

        gridModule.GridLayout.setColumn(xLists[i],i);
        gridModule.GridLayout.setRow(xLists[i],1);
        //if( i == 0 ){
         
           // gridModule.GridLayout.setColumnSpan(xLists[i], 9999 /* Numero de Campos */)
        
         //}
        viewLayout.addChild(xLists[i]);

    }
    
    page.content = viewLayout;

}

requestForm = function(constructorForm) {

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

        drawForm(data);

        } else if( constructorForm == "list" ){

            drawList(data);

        } else if( constructorForm == "webview" ){

            drawWebView(data);

        } else {

            drawOptions(data);

        }

    });   
}

drawForm = function(data){
    var fieldsSize = data.length;

    var newStackLayout = new stackModule.StackLayout();

    var fieldsArray = new Array();
    
    for(i=0; i < fieldsSize; i++){
        switch(data[i].type){
            case "checkbox":
                fieldsArray[i] = new checkModule.CheckBox();
                fieldsArray[i].value = data[i].value;
            break;
            case "dropdown":
                var arrayDados = new Array();
                fieldsArray[i] = new dropModule.DropDown();
                fieldsArray[i].items = data[i].items;
            break;
            case "radiobutton":
                // radiogroupd (luis help)
                fieldsArray[i] = new radioBtnModule.RadioButton();
                fieldsArray[i].radioGroup = data[i].group;
                fieldsArray[i].value = data[i].value;
            break;
            case "button":
                fieldsArray[i] = new buttonModule.Button();
               /* fieldsArray[i].on(buttonModule.Button.tapEvent, function() {
                    navigate
                    var barcodescanner = new BarcodeScanner();
                    barcodescanner.scan({
                        formats: "QR_CODE",   // Pass in of you want to restrict scanning to certain types
                        //cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
                        //cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                        message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                        showFlipCameraButton: true,   // default false
                        preferFrontCamera: false,     // default false
                        showTorchButton: true,        // default false
                        beepOnScan: true,             // Play or Suppress beep on scan (default true)
                        torchOn: false,               // launch with the flashlight on (default false)
                        resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                        orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
                        //openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
                    }).then(
                        function(result) {
                            console.log("Scan format: " + result.format);
                            console.log("Scan text:   " + result.text);
                            localStorage.setItem("merda",result.text);
                        },
                        function(error) {
                            console.log("No scan: " + error);
                        }
                    );
                });*/
            break;
            case "label":
                fieldsArray[i] = new labelModule.Label();
            break;
            case "textfield":
                fieldsArray[i] = new textFieldModule.TextField();
                fieldsArray[i].hint = data[i].hint;
            break;
        }
        fieldsArray[i].id = data[i].id;
        fieldsArray[i].text = data[i].text;
        
        newStackLayout.addChild(fieldsArray[i]);
            
    }
    var submitBtn = new buttonModule.Button();
    submitBtn.text = "submit";
    newStackLayout.addChild(submitBtn);
    page.content = newStackLayout;

    submitBtn.on(buttonModule.Button.tapEvent, function (){
        var submitInfo = new Array();
        var cont = 0;
        for(i = 0; i < fieldsSize; i++)
        {
            switch(data[i].type)
            {
                case "textfield":
                        submitInfo[i-cont] = fieldsArray[i].text;
                break;
                case "dropdown":
                        submitInfo[i-cont] = fieldsArray[i].items[fieldsArray[i].selectedIndex];
                break;
                case "checkbox":
                        submitInfo[i-cont] = fieldsArray[i].checked;
                break;
                case "radiobutton":
                        submitInfo[i-cont] = fieldsArray[i].value;
                break;
              /*  case "button":
                    if(i == 0){
                        submitInfo = fieldsArray[i].value
                    }
                    else{
                        submitInfo = submitInfo + "," + fieldsArray[i].value;
                    }
                break;*/
                case "label":
                    cont +=1;
                break;
            }
        }
        console.log(submitInfo);
    //codigo micael aqui <----------------------------------------------------------------------------------
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

    if(data.defaultUrl == ""){
        myweb.url = "";
        txt1.text = "http://";
        alert("Default URL is not defined");
    }else{
        myweb.url = data.defaultUrl;
        txt1.text = data.defaultUrl;
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
    page = args.object;
    var gotData = page.navigationContext;
    var Info = gotData.typeView;

    //localStorage.setItem("default_url","http://www.google.com");
    //localStorage.clear();
   if( Info.toLowerCase() == "list" ){

        requestForm("list");

   } else if ( Info.toLowerCase() == "form" ) {

        requestForm("form");

   } else if ( Info.toLowerCase() == "webview" ) {

        requestForm("webview");

   } else if ( Info.toLowerCase() == "options" ) {

        requestForm("options");

   } else {

        alert("NOPE!");
        //error

   }

}