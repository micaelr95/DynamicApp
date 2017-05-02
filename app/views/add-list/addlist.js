var textFieldModule = require("ui/text-field");
var stackModule = require("ui/layouts/stack-layout");

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
    
    page.content = stackView;

}