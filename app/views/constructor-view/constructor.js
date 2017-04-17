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

function createRows(numbRows , arrayRows , gridLayout) {

    for ( i = 0 ; i < numbRows ; i++ )
    {

        arrayRows[i] = new gridModule.ItemSpec(1, gridModule.GridUnitType.star);
        gridLayout.addRow(arrayRows[i]);

    }

}

function createColumns(numbColumns , arrayColumns , gridLayout) {

    for ( i = 0 ; i < numbColumns ; i++ )
    {
        if(i == 1){

            arrayColumns[i] = new gridModule.ItemSpec(300, gridModule.GridUnitType.pixel);

        } else {

            arrayColumns[i] = new gridModule.ItemSpec(1, gridModule.GridUnitType.star);

        }

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
    pagerino = page;
    var viewModule = new observable.Obeservable();


    var myJSON = '{"form":[{"Type":"textfield","id":"textfield1","hint":"click me","value":"email"},{"Type":"button","id":"button1","text":"click me","value":"coiso"},{"Type":"checkbox","id":"checkbox","text":"click me","value":"coisito"},{"Type":"dropdown","id":"dropdown","items":["Escolha uma opção","as","oi"],"value":"coisado"},{"Type":"radiobutton","id":"radiobutton","text":"radio","value"="coisital"}]}';
    var jaaason = JSON.parse(myJSON);
    var fieldsSize = jaaason.form.length;

    for(i=0;i<fieldsSize;i++){
        if(jaaason.form[i].value == ""){}
        else{
            viewModule[jaaason.form[i].value] = "";
        }
    }
    
    var newStackLayout = new stackLayout.StackLayout();

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

                sourceProperty: jaaason.form[i].value,
                targetProperty: "",
                twoWay: true

        }
        fieldsArray[i].bind(fieldBindOptions,viewModule);
        newStackLayout.addChild(fieldsArray[i]);
            
    }
    var submitBtn = new buttonModule.Button();
    newStackLayout.addChild(submitBtn);
    pagerino.content = newStackLayout;

    /*subtim btn {
        for
         viewModule[jaaason.form[i].value];

         array viewModuleinjo += ikeiiko

         return arra
    }*/
    console.dump()
}

exports.constructorLoad = function(args) {

    var page = args.object
    //info = button value; JSON constructor comes from the button JSON parameter
    var Info = "FORM";
   if( Info.toLowerCase() == "list" ){

        createList();

   } else if ( Info.toLowerCase() == "form" ) {

        createForm(page);

   } else if ( Info.toLowerCase() == "webview" ) {

        createWebView();

   } else if ( Info.toLowerCase() == "options" ) {

        createOptions();

   } else {

        alert("NOPE!");

   }

}