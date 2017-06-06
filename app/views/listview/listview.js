var observable = require("data/observable");
var pageModule = require("ui/page");
var localStorage = require("nativescript-localstorage");
var appModule = require("application");
var gridModule= require("ui/layouts/grid-layout");
var labelModule = require("ui/label");

exports.listView = function(args) {
    var page = args.object;

    localStorage.setItem("currentPage", "listview");

    var lista = localStorage.getItem("list");
    var data = localStorage.getItem("aasd");
    var arr = Object.values(data);
    console.info(JSON.stringify(arr));

    console.info(lista.length);

    var label = [];

    // var gridLayout = new gridModule.GridLayout();
    var gridLayout = page.getViewById("testar");

    var merdaQualquer = page.getViewById("bueda");
    for(index = 0; index < lista.length; index++) {
        label[index] = new labelModule.Label();
        label[index].text = "merda";
        // merdaQualquer.push(label[index]);
    }


    for(i = 0; i < lista.length; i++) {
        label[i] = new labelModule.Label();
        label[i].text = lista[i];
        console.info(label[i].text);

        gridModule.GridLayout.setColumn(label[i], i);
        gridModule.GridLayout.setRow(label[i], 0);

        var column = new gridModule.ItemSpec(1, "auto");
        var row = new gridModule.ItemSpec(1, "auto");

        gridLayout.addColumn(column);
        gridLayout.addRow(row);    
        gridLayout.addChild(label[i]);
    }  
    
   // page.content = gridLayout;
}
