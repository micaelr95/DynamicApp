# Dynamic App

## Required Views

+ Starting View;
+ API View ( better not use the actual API name [ may be a keyword ] );
+ Constructor View --> Switch type of View Options [ Form , List , Options ].

## Application Start

### 1st Time Application Run

1. Choose the WebService by reading a QRCode or the reading textfield value; ( save info in localstorage and change starting View ) , and may choose to identify who is using the APP ( "Login" );

2. Navigate to "API" View which is built through the data you recieve from the WebService;

3. Jump into "App Start".

## App Start ( Ignore if its 1st time running the APP )

1. Create View content based on WebService data ( JSON );

2. While reading the data you must check what type of button will it be ( Create Form , Display ListView , Open WebView , Open Options );

3. Define all Buttons to navigate to the Constructor View by sending their JSON data and their type of Button.

### Create Form

If the button type is "form" it means that the View will be a Form to submit some values to a specific URL that comes in the "form" JSON.

After you know its a "form" do the following steps :

+ Create the form's objects and also the properties of each object ( the properties will come through the WebService );

+ Set all the values to Observable so you can send all the info to the URL given;

+ Finally set the button to send the data you gathered to the URL.

### List

If the button type is "list" it means that the View will be a List so it display certaint data from the given URL to the ListView.

After you know its a "list" do the following steps :

+ Create the header and give the title you receive from the JSON passed and then create the ListView with their items.

### WebView

If the button type is "webview" it means that the View will display a choosen Webpage from the JSON received.

### Options

Do be thinked off;