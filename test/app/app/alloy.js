var Adjust = require('ti.adjust');
var AdjustTest = require('ti.adjust.test');
var CommandExecutor = require('command_executor');

if (OS_ANDROID) {
    var platformTools = require('bencoding.android.tools').createPlatform(), wasInForeground = true;
    setInterval(function() {
        var isInForeground = platformTools.isInForeground();
        if (wasInForeground !== isInForeground) {
            Ti.App.fireEvent(isInForeground ? 'resumed' : 'paused');
            wasInForeground = isInForeground;
        }
    }, 1000);
}

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

    if (OS_ANDROID) {
        // Emulator
        // baseUrl = "https://10.0.2.2:8443";
        // gdprUrl = "https://10.0.2.2:8443";
        // Device
        baseUrl = "https://192.168.8.114:8443";
        gdprUrl = "https://192.168.8.114:8443";
    } else if (OS_IOS) {
        // Emulator
        // baseUrl = "http://127.0.0.1:8080";
        // gdprUrl = "http://127.0.0.1:8080";
        // Device
        baseUrl = "http://192.168.8.114:8080";
        gdprUrl = "http://192.168.8.114:8080";
    }

    var commandExecutor = new CommandExecutor(baseUrl, gdprUrl);

    // AdjustTest.addTestDirectory("current/deeplink-deferred/");
    // AdjustTest.addTest("current/deeplink-deferred/Test_DeferredDeeplink");

    AdjustTest.initialize(baseUrl, function(json, order) {
        var jsonObject = JSON.parse(json);
        const className = jsonObject["className"];
        const functionName = jsonObject["functionName"];
        const params = jsonObject["params"];
        commandExecutor.scheduleCommand(className, functionName, params, order);
    });

    if (OS_ANDROID) {
        AdjustTest.startTestSession("titanium4.14.0@android4.14.0");
    } else if (OS_IOS) {
        AdjustTest.startTestSession("titanium4.14.0@ios4.14.1");
    }
})();
