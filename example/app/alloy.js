var Adjust = require('ti.adjust');
var AdjustConfig = require('adjust_config');

Ti.App.addEventListener('resumed', function(e) {
    Adjust.onResume();
});

Ti.App.addEventListener('paused', function(e) {
    Adjust.onPause();
});

if (OS_ANDROID) {
    var platformTools = require('bencoding.android.tools').createPlatform(),
        wasInForeGround = true;

    setInterval(function() {
        var isInForeground = platformTools.isInForeground();

        if (wasInForeGround !== isInForeground) {
            Ti.App.fireEvent(isInForeground ? 'resumed' : 'paused');

            wasInForeGround = isInForeground;
        }
    }, 1000);
}

 if (OS_IOS) {
     Ti.App.iOS.addEventListener('continueactivity', function(e) {
         if (e.activityType === "NSUserActivityTypeBrowsingWeb"){
             var deeplink = e.webpageURL;
     
             if (deeplink) {
                 Ti.API.info("URL = " + deeplink);
                 Adjust.appWillOpenUrl(deeplink);
             }
           }
     });
 
     Ti.App.addEventListener('resumed', function() {
         var args = Ti.App.getArguments();
 
         if (args.url) {
             Ti.API.info("URL = " + args.url);
             Adjust.appWillOpenUrl(args.url);
         }
     });
 } else if (OS_ANDROID) {
     var activity = Ti.Android.currentActivity;
     var url = activity.getIntent().getData();
 
     if (url) {
         Ti.API.info("URL = " + url);
         Adjust.appWillOpenUrl(url);
     }
 }

(function() {
    var adjustConfig = new AdjustConfig("2fm9gkqubvpc", AdjustConfig.EnvironmentSandbox);
    adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
    adjustConfig.setDelayStart(6.0);
    adjustConfig.setSendInBackground(true);
    adjustConfig.setShouldLaunchDeeplink(true);
    adjustConfig.setUserAgent("Adjust Custom UA");
    adjustConfig.setDeviceKnown(true);
    // adjustConfig.setEventBufferingEnabled(true);

    adjustConfig.setAttributionCallback(function(attribution) {
        Ti.API.info(">>> Attribution callback received");

        Ti.API.info("Tracker token = " + attribution.trackerToken);
        Ti.API.info("Tracker name = " + attribution.trackerName);
        Ti.API.info("Network = " + attribution.network);
        Ti.API.info("Campaign = " + attribution.campaign);
        Ti.API.info("Adgroup = " + attribution.adgroup);
        Ti.API.info("Creative = " + attribution.creative);
        Ti.API.info("Click label = " + attribution.clickLabel);
        Ti.API.info("Adid = " + attribution.adid);
    });

    adjustConfig.setEventTrackingSuccessCallback(function(eventSuccess) {
        Ti.API.info(">>> Event tracking succeeded callback received");

        Ti.API.info("Message: " + eventSuccess.message);
        Ti.API.info("Timestamp: " + eventSuccess.timestamp);
        Ti.API.info("Adid: " + eventSuccess.adid);
        Ti.API.info("Event token: " + eventSuccess.eventToken);
        Ti.API.info("JSON response: " + eventSuccess.jsonResponse);
    });

    adjustConfig.setEventTrackingFailureCallback(function(eventFailure) {
        Ti.API.info(">>> Event tracking failed callback received");

        Ti.API.info("Message: " + eventFailure.message);
        Ti.API.info("Timestamp: " + eventFailure.timestamp);
        Ti.API.info("Adid: " + eventFailure.adid);
        Ti.API.info("Event token: " + eventFailure.eventToken);
        Ti.API.info("Will retry: " + eventFailure.willRetry);
        Ti.API.info("JSON response: " + eventFailure.jsonResponse);
    });

    adjustConfig.setSessionTrackingSuccessCallback(function(sessionSuccess) {
        Ti.API.info(">>> Session tracking succeeded callback received");

        Ti.API.info("Message: " + sessionSuccess.message);
        Ti.API.info("Timestamp: " + sessionSuccess.timestamp);
        Ti.API.info("Adid: " + sessionSuccess.adid);
        Ti.API.info("JSON response: " + sessionSuccess.jsonResponse);
    });

    adjustConfig.setSessionTrackingFailureCallback(function(sessionFailure) {
        Ti.API.info(">>> Session tracking failed callback received");

        Ti.API.info("Message: " + sessionFailure.message);
        Ti.API.info("Timestamp: " + sessionFailure.timestamp);
        Ti.API.info("Adid: " + sessionFailure.adid);
        Ti.API.info("Will retry: " + sessionFailure.willRetry);
        Ti.API.info("JSON response: " + sessionFailure.jsonResponse);
    });

    adjustConfig.setDeferredDeeplinkCallback(function(uri) {
        Ti.API.info(">>> Deferred Deeplink Callback received");

        Ti.API.info("URL: " + uri.uri);
        
        Adjust.appWillOpenUrl(uri.uri);
    });

    Adjust.addSessionCallbackParameter("scp1", "scpv1");
    Adjust.addSessionCallbackParameter("scp2", "scpv2");

    Adjust.addSessionPartnerParameter("spp1", "sppv1");
    Adjust.addSessionPartnerParameter("spp2", "sppv2");

    Adjust.removeSessionCallbackParameter("scp1");
    Adjust.removeSessionPartnerParameter("spp1");

    // Adjust.resetSessionCallbackParameters();
    // Adjust.resetSessionPartnerParameters();

    Adjust.start(adjustConfig);

    Adjust.sendFirstPackages();
})();
