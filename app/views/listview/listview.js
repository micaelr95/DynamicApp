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

    var gridLayout = page.getViewById("testar");
    var labelTitle = [];
    for(i = 0; i < lista.length; i++) {
        labelTitle[i] = new labelModule.Label();
        labelTitle[i].text = lista[i];

        gridModule.GridLayout.setColumn(labelTitle[i], i);
        gridModule.GridLayout.setRow(labelTitle[i], 0);

        var column = new gridModule.ItemSpec(1, "auto");
        var row = new gridModule.ItemSpec(1, "auto");

        gridLayout.addColumn(column);
        gridLayout.addRow(row);    
        gridLayout.addChild(labelTitle[i]);
    }

    var data = localStorage.getItem("aasd");
    var arr = Object.values(data);

    
    var merdaQualquer = page.getViewById("bueda");
    var labellist = [];
    for(i = 0; i < arr.length; i++) {
        labellist[i] = new labelModule.Label();
        labellist[i].text = "cenas";

        gridModule.GridLayout.setColumn(labellist[i], i);
        gridModule.GridLayout.setRow(labellist[i], 0);

        var column = new gridModule.ItemSpec(1, "auto");
        var row = new gridModule.ItemSpec(1, "auto");

        gridLayout.addColumn(column);
        gridLayout.addRow(row);    
        gridLayout.addChild(labellist[i]);
    }

   // page.content = gridLayout;
}
