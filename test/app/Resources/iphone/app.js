




var Alloy = require('/alloy'),
_ = Alloy._,
Backbone = Alloy.Backbone;

var Adjust = require('ti.adjust');
var AdjustTest = require('ti.adjust.test');
var CommandExecutor = require('command_executor');

if (false) {
    var platformTools = require('bencoding.android.tools').createPlatform(),wasInForeground = true;
    setInterval(function () {
        var isInForeground = platformTools.isInForeground();
        if (wasInForeground !== isInForeground) {
            Ti.App.fireEvent(isInForeground ? 'resumed' : 'paused');
            wasInForeground = isInForeground;
        }
    }, 1000);
}

if (true) {
    Ti.App.iOS.addEventListener('continueactivity', function (e) {
        if (e.activityType === "NSUserActivityTypeBrowsingWeb") {
            var deeplink = e.webpageURL;
            if (deeplink) {
                Ti.API.info("[AdjustTest]: URL = " + deeplink);
                Adjust.appWillOpenUrl(deeplink);
            }
        }
    });
    Ti.App.addEventListener('resumed', function () {
        var args = Ti.App.getArguments();
        if (args.url) {
            Ti.API.info("[AdjustTest]: URL = " + args.url);
            Adjust.appWillOpenUrl(args.url);
        }
    });
} else if (false) {
    var activity = Ti.Android.currentActivity;
    var url = activity.getIntent().getData();
    if (url) {
        Ti.API.info("[AdjustTest]: URL = " + url);
        Adjust.appWillOpenUrl(url);
    }
}

(function () {
    var baseUrl = "";
    var gdprUrl = "";

    if (false) {




        baseUrl = "https://192.168.8.114:8443";
        gdprUrl = "https://192.168.8.114:8443";
    } else if (true) {




        baseUrl = "http://192.168.8.114:8080";
        gdprUrl = "http://192.168.8.114:8080";
    }

    var commandExecutor = new CommandExecutor(baseUrl, gdprUrl);




    AdjustTest.initialize(baseUrl, function (json, order) {
        var jsonObject = JSON.parse(json);
        const className = jsonObject["className"];
        const functionName = jsonObject["functionName"];
        const params = jsonObject["params"];
        commandExecutor.scheduleCommand(className, functionName, params, order);
    });

    if (false) {
        AdjustTest.startTestSession("titanium4.14.0@android4.14.0");
    } else if (true) {
        AdjustTest.startTestSession("titanium4.14.0@ios4.14.1");
    }
})();

Alloy.createController('index');