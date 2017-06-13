var observable = require("data/observable");
var pageModule = require("ui/page");
var appModule = require("application");
var gridModule = require("ui/layouts/grid-layout");
var labelModule = require("ui/label");
var topmost = require("ui/frame").topmost();

exports.Loaded = function (args) {
    var page = args.object;

    var gotData = page.navigationContext;
    var data = localStorage.getItem(gotData.table);

    var options = localStorage.getItem("Options");
    var lista = localStorage.getItem("list");

    var gridLayout = page.getViewById("testar");
    var labelTitle = [];

    for (i = 0; i < lista.length; i++) {
        labelTitle[i] = new labelModule.Label();
        labelTitle[i].text = lista[i];
        labelTitle[i].marginRight = "5";
        labelTitle[i].color = "Red";

        gridModule.GridLayout.setColumn(labelTitle[i], i);
        gridModule.GridLayout.setRow(labelTitle[i], 0);

        var column = new gridModule.ItemSpec(1, "auto");
        var row = new gridModule.ItemSpec(1, "auto");

        gridLayout.addColumn(column);
        gridLayout.addRow(row);
        gridLayout.addChild(labelTitle[i]);
    }

    var arr = Object.values(data);

    var labellist = [];
    for (i = 0; i < arr.length; i++) {
        for (x = 0; x < arr[i].length; x++) {
            labellist[i] = new labelModule.Label();
            labellist[i].text = arr[i][x];
            labellist[i].marginRight = "5";

            gridModule.GridLayout.setColumn(labellist[i], x);
            gridModule.GridLayout.setRow(labellist[i], i + 1);

            var column = new gridModule.ItemSpec(1, "auto");
            var row = new gridModule.ItemSpec(1, "auto");

            gridLayout.addColumn(column);
            gridLayout.addChild(labellist[i]);
        }
        gridLayout.addRow(row);
    }
    page.bindingContext = { title: "List View", backgroundColor: options.color_actionBar, textColor: options.color_text };
}

exports.homeButton = function () {
    var navigationOptions =
        {
            moduleName: "views/main-api-view/main-api",
            clearHistory: true
        }
    topmost.navigate(navigationOptions);
}

exports.infoButton = function () {
    topmost.navigate("views/Info/Info");
}

exports.optionsButton = function () {
    topmost.navigate("views/options-view/options");
}
