var textFieldModule = require("ui/text-field");
var stackModule = require("ui/layouts/stack-layout");
var buttonModule = require("ui/button");
var frameModule = require("ui/frame");
var topmost = frameModule.topmost();
var Connection = require("../../shared/DB_connection");
var con = new Connection();

exports.addlistLoad = function(args) {
    var page = args.object;

    var stackView = new stackModule.StackLayout();
    var items = [];
    var numberX = parseInt(localStorage.getItem("campsNumber"));

    for( i = 0 ; i < numberX ; i++ ){

        items[i] = localStorage.getItem("camp" + i );

    }

    var textboxArray = new Array();

    for( i = 0 ; i < items.length ; i ++ ){

        textboxArray[i] = new textFieldModule.TextField();
        textboxArray[i].hint = items[i];

        stackView.addChild(textboxArray[i]);

    }

    var submitBtn = new buttonModule.Button();
    submitBtn.text = "Submit";
    submitBtn.className = "submitBtn";

    submitBtn.on(buttonModule.Button.tapEvent , function() {
        
        var stuff = [];
        var infoArray = [];


        for( i = 0 ; i < parseInt(localStorage.getItem("campsNumber")) ; i++ ){
            
            infoArray = [];

            for( j = 0 ; j < parseInt(localStorage.getItem("numberItems")) ; j++ ){

                infoArray.push( localStorage.getItem( "listItems" + i + j ) )

            }

            infoArray.push(textboxArray[i].text);
            stuff[i] = infoArray;

        }



        for( i = 0 ; i < parseInt(localStorage.getItem("campsNumber")) ; i++ ){

            con.addListInfo('/list/campsInfo/' + i , stuff[i] );

        }

        topmost.goBack();

    });
    
    stackView.addChild(submitBtn);
    
    page.content = stackView;

}