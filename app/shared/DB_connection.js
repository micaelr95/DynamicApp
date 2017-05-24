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
        firebase.init(
            {
                url: config.apiUrl,
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
        firebase.login(
        {
            type: firebase.LoginType.ANONYMOUS
        }
        ).then(function (result)
        {
            config.uid = response.uid;
        },
        function (errorMessage)
        {
            console.log(errorMessage);
        })
    };

    viewModel.load = function() {
        var onChildEvent = function(result) {
            localStorage.setItem(result.key, result.value);
        };
        return firebase.addChildEventListener(onChildEvent, "/").then(
            function() {
                console.log("firebase.addChildEventListener added");
            },
            function(error) {
                console.log("firebase.addChildEventListener error: " + error);
            }
        )
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
