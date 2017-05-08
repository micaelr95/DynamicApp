var config = require("../shared/config");
var firebase = require("nativescript-plugin-firebase");
var Observable = require("data/observable").Observable;

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
                url: config.apiUrl
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

    // Add data to database
    viewModel.add = function(table, data)
    {
        return firebase.push(table,
            {
                data,
                'UID': config.uid
            }
        )
    };

    viewModel.addListInfo = function(table, data)
    {
        return firebase.setValue(table,data)
    };

    return viewModel;
}

module.exports = Connection;
