var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
var localstorage = require("nativescript-localstorage");
var frameModule = require("ui/frame");
var Connection = require("../../shared/DB_connection");
var con = new Connection();
var page;

exports.pageLoaded = function(args)
{
    // localstorage.clear();
    page = args.object;

    if(localstorage.getItem("isConfigured") == true)
    {
        var topmost = frameModule.topmost();
        topmost.navigate("views/main-api-view/main-api"); //Alterar para página correta mais tarde
    }
}

exports.scanQR = function()
{
    var barcodescanner = new BarcodeScanner();

    barcodescanner.scan(
    {
        formats: "QR_CODE",   // Pass in of you want to restrict scanning to certain types
        //cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        //cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        message: "Place a QR code inside the rectangle to scan it.", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        showFlipCameraButton: false,   // default false
        preferFrontCamera: false,     // default false
        showTorchButton: true,        // default false
        beepOnScan: true,             // Play or Suppress beep on scan (default true)
        torchOn: false,               // launch with the flashlight on (default false)
        resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        orientation: "landscape",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
        //openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    })
    .then(function(result)
    {
        page.getViewById("urlTextField").text = result.text;
    },
    function(error)
    {
        console.log("No scan: " + error);
    });
}

exports.confirmURL = function()
{
    var my_url = page.getViewById("urlTextField").text;

    if(my_url == "" || my_url == "https://" || my_url == "http://")
    {
        alert("Please insert or scan a valid URL");
    }
    else
    {
        // Initiate database connection
        con.init();
        // Starts ANONYMOUS connection to database
        con.login();

        con.load();

        localstorage.setItem("server_url",my_url);
        localstorage.setItem("isConfigured",true);
        var topmost = frameModule.topmost();
        var navigationOptions =
        {
             moduleName: "views/main-api-view/main-api",
             clearHistory: true
        }
        topmost.navigate(navigationOptions);
    }
}