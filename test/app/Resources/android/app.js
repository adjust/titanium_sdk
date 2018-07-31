




var Alloy = require('/alloy'),
_ = Alloy._,
Backbone = Alloy.Backbone;

var Adjust = require('ti.adjust');
var AdjustTest = require('ti.adjust.test');
var AdjustConfig = require('adjust_config');
var CommandExecutor = require('command_executor');









if (true) {
    var platformTools = require('bencoding.android.tools').createPlatform(),
    wasInForeGround = true;

    setInterval(function () {
        var isInForeground = platformTools.isInForeground();

        if (wasInForeGround !== isInForeground) {
            Ti.App.fireEvent(isInForeground ? 'resumed' : 'paused');

            wasInForeGround = isInForeground;
        }
    }, 1000);
}

if (false) {
    Ti.App.iOS.addEventListener('continueactivity', function (e) {
        if (e.activityType === "NSUserActivityTypeBrowsingWeb") {
            var deeplink = e.webpageURL;

            if (deeplink) {
                Ti.API.info("URL = " + deeplink);
                Adjust.appWillOpenUrl(deeplink);
            }
        }
    });

    Ti.App.addEventListener('resumed', function () {
        var args = Ti.App.getArguments();

        if (args.url) {
            Ti.API.info("URL = " + args.url);
            Adjust.appWillOpenUrl(args.url);
        }
    });
} else if (true) {
    var activity = Ti.Android.currentActivity;
    var url = activity.getIntent().getData();

    if (url) {
        Ti.API.info("URL = " + url);
        Adjust.appWillOpenUrl(url);
    }
}

(function () {
    var baseUrl = "";
    var gdprUrl = "";

    if (true) {



        baseUrl = "https://192.168.8.226:8443";
        gdprUrl = "https://192.168.8.226:8443";
    } else if (false) {
        baseUrl = "http://127.0.0.1:8080";
        gdprUrl = "http://127.0.0.1:8080";
    }

    const commandExecutor = new CommandExecutor(baseUrl, gdprUrl);



    AdjustTest.initialize(baseUrl, function (json) {
        Ti.API.info("[AdjustTest] JSON command received in JS world: " + json);
        const className = json["className"];
        const functionName = json["functionName"];
        const params = json["params"];
        const order = json["order"];
        commandExecutor.scheduleCommand(className, functionName, params, order);
    });
    AdjustTest.startTestSession("titanium4.14.0@android4.14.0");
})();

Alloy.createController('index');