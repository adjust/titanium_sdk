var Adjust = require('ti.adjust');
var AdjustTest = require('ti.adjust.test');
var CommandExecutor = require('command_executor');

if (OS_IOS) {
    Ti.App.iOS.addEventListener('continueactivity', function(e) {
        if (e.activityType === "NSUserActivityTypeBrowsingWeb"){
            var deeplink = e.webpageURL;
            if (deeplink) {
                Ti.API.info("[AdjustTest]: URL = " + deeplink);
                Adjust.appWillOpenUrl(deeplink);
            }
        }
    });
    Ti.App.addEventListener('resumed', function() {
        var args = Ti.App.getArguments();
        if (args.url) {
            Ti.API.info("[AdjustTest]: URL = " + args.url);
            Adjust.appWillOpenUrl(args.url);
        }
    });
} else if (OS_ANDROID) {
    var activity = Ti.Android.currentActivity;
    var url = activity.getIntent().getData(); 
    if (url) {
        Ti.API.info("[AdjustTest]: URL = " + url);
        Adjust.appWillOpenUrl(url);
    }
}

(function() {
    var baseUrl = "";
    var gdprUrl = "";
    var subscriptionUrl = "";
    var controlUrl = "ws://192.168.86.32:1987";

    if (OS_ANDROID) {
        baseUrl = "https://192.168.86.32:8443";
        gdprUrl = "https://192.168.86.32:8443";
        subscriptionUrl = "https://192.168.86.32:8443";
    } else if (OS_IOS) {
        baseUrl = "http://192.168.86.32:8080";
        gdprUrl = "http://192.168.86.32:8080";
        subscriptionUrl = "http://192.168.86.32:8080";
    }

    Ti.API.info('[AdjustTest]: Connecting to: ' + baseUrl);
    var commandExecutor = new CommandExecutor(baseUrl, gdprUrl, subscriptionUrl)

    Ti.API.info('[AdjustTest]: Initializing Adjust Test Library ...');
    AdjustTest.initialize(baseUrl, controlUrl, function(json, order) {
        var jsonObject = JSON.parse(json);
        const className = jsonObject["className"];
        const functionName = jsonObject["functionName"];
        const params = jsonObject["params"];
        commandExecutor.scheduleCommand(className, functionName, params, order);
    });

    // AdjustTest.addTestDirectory("current/deeplink-deferred/");
    // AdjustTest.addTestDirectory("current/event-callbacks");
    // AdjustTest.addTest("Test_iOs_Subscription_subscription");
    // AdjustTest.addTest("current/event-callbacks/Test_EventCallback_success_callbackId_persistence");

    Adjust.getSdkVersion(function(sdkVersion) {
        AdjustTest.startTestSession(sdkVersion);
    });
})();
