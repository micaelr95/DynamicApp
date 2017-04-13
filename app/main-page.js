var frameModule = require("ui/frame");

function onNavigatingTo(args) {
    
    var page = args.object;
    var topmost= frameModule.topmost();

    topmost.navigate("constructor/constructor.js");

}