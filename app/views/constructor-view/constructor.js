exports.constructor = function(args) {

   if( Info.toLowerCase() == "list" ){

        createList();

   } else if ( Info.toLowerCase() == "form" ) {

        createForm();

   } else if ( Info.toLowerCase() == "webview" ) {

        createWebView();

   } else if ( Info.toLowerCase() == "options" ) {

        createOptions();

   } else {

        alert("NOPE!");

   }

}