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
	var data = activity.getIntent().getData();

	if (data) {
		Adjust.appWillOpenUrl(data);
	}
}

(function() {
	var adjustConfig = new AdjustConfig("2fm9gkqubvpc", AdjustConfig.EnvironmentSandbox);
    adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
    adjustConfig.setDelayStart(6.0);
    adjustConfig.setSendInBackground(true);
    adjustConfig.setShouldLaunchDeeplink(false);
    // adjustConfig.setEventBufferingEnabled(true);
    // adjustConfig.setUserAgent("little_bunny_foo_foo");

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

    adjustConfig.setEventTrackingFailureCallback(function(eventFailed) {
        Ti.API.info(">>> Event tracking failed callback received");

        Ti.API.info("Message: " + eventFailed.message);
        Ti.API.info("Timestamp: " + eventFailed.timestamp);
        Ti.API.info("Adid: " + eventFailed.adid);
        Ti.API.info("Event token: " + eventFailed.eventToken);
        Ti.API.info("Will retry: " + eventFailed.willRetry);
        Ti.API.info("JSON response: " + eventFailed.jsonResponse);
    });

    adjustConfig.setSessionTrackingSuccessCallback(function(sessionSuccess) {
        Ti.API.info(">>> Session tracking succeeded callback received");

        Ti.API.info("Message: " + sessionSuccess.message);
        Ti.API.info("Timestamp: " + sessionSuccess.timestamp);
        Ti.API.info("Adid: " + sessionSuccess.adid);
        Ti.API.info("JSON response: " + sessionSuccess.jsonResponse);
    });

    adjustConfig.setSessionTrackingFailureCallback(function(sessionFailed) {
        Ti.API.info(">>> Session tracking failed callback received");

        Ti.API.info("Message: " + sessionFailed.message);
        Ti.API.info("Timestamp: " + sessionFailed.timestamp);
        Ti.API.info("Adid: " + sessionFailed.adid);
        Ti.API.info("Will retry: " + sessionFailed.willRetry);
        Ti.API.info("JSON response: " + sessionFailed.jsonResponse);
    });

    adjustConfig.setDeferredDeeplinkCallback(function(uri) {
        Ti.API.info(">>> Deferred Deeplink Callback received");

        Ti.API.info("URL: " + uri.uri);
        
        Adjust.appWillOpenUrl(uri.uri);
    });

    Adjust.addSessionCallbackParameter("dummy_foo", "dummy_bar");
    Adjust.addSessionCallbackParameter("dummy_foo_foo", "dummy_bar");

    Adjust.addSessionPartnerParameter("dummy_foo", "dummy_bar");
    Adjust.addSessionPartnerParameter("dummy_foo_foo", "dummy_bar");

    Adjust.removeSessionCallbackParameter("dummy_foo");
    Adjust.removeSessionPartnerParameter("dummy_foo");

    Adjust.resetSessionCallbackParameters();
    Adjust.resetSessionPartnerParameters();

    Adjust.setPushToken("bunny_foo_foo");

    Adjust.start(adjustConfig);

    Adjust.sendFirstPackages();
})();
