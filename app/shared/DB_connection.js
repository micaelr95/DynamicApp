var config = require("../shared/config");
var firebase = require("nativescript-plugin-firebase");
var Observable = require("data/observable").Observable;
var localStorage = require("nativescript-localstorage");

// Handles all database related stuff
function Connection()
{
    // You can add properties to observables on creation
    var viewModel = new Observable();

    // Starts database connection
    viewModel.init = function()
    {
        return firebase.init(
            {
                url: localStorage.getItem("server_url"),
                persist: true
            }
            ).then(function (instance)
            {
                console.log("firebase.init done");
            },
            function (error)
            {
                console.log("firebase.init error: " + error);
            }
        );
    };

    // Login to database
    viewModel.login = function()
    {
        return firebase.login(
        {
            type: firebase.LoginType.ANONYMOUS
        }
        ).then(function (result)
        {
            config.uid = result.uid;
            console.log("firebase logged in");
        },
        function (errorMessage)
        {
            console.log(errorMessage);
        })
    };

    viewModel.load = function() {
        console.log("firebase load start");
        var onChildEvent = function(result) {
            localStorage.setItem(result.key, result.value);
            if (localStorage.getItem("Options") && localStorage.getItem("MainApi"))
            {
                localStorage.setItem("canStart", true);
                var topmost = require("ui/frame").topmost();
                var navigationOptions =
                {
                    moduleName: "views/main-api-view/main-api",
                    clearHistory: true
                }
                topmost.navigate(navigationOptions);
            }
            config.mainapiOpen = false;
        };
        return firebase.addChildEventListener(onChildEvent, "/").then(
        function()
        {
            console.log("firebase.addChildEventListener added");
        },
        function(error)
        {
            console.log("firebase.addChildEventListener error: " + error);
        });
    }

    // Add data to database
    viewModel.add = function(table, data)
    {
        return firebase.push(table, data)
    };

    viewModel.addListInfo = function(table, data)
    {
        return firebase.setValue(table,data)
    };

    return viewModel;
}

module.exports = Connection;
