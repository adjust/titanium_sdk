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
    var sdkPrefix = "titanium4.15.0";

    // var baseAddress = "10.0.2.2"; // Emulator iOS
    // var baseAddress = "127.0.0.1"; // Emulator Andriod
    var baseAddress = "192.168.8.189"; // Device

    if (OS_ANDROID) {
        baseUrl = "https://" + baseAddress + ":8443";
        gdprUrl = "https://" + baseAddress + ":8443";
    } else if (OS_IOS) {
        baseUrl = "http://" + baseAddress + ":8080";
        gdprUrl = "http://" + baseAddress + ":8080";
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
        AdjustTest.startTestSession(sdkPrefix + "@android4.15.0");
    } else if (OS_IOS) {
        AdjustTest.startTestSession(sdkPrefix + "@ios4.15.0");
    }
})();
