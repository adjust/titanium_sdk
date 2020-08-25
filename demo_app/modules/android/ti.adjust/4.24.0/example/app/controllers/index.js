var Adjust = require('ti.adjust');
// var AdjustConfig = require('adjust_config');
//
// Ti.App.addEventListener('resumed', function(e) {
// 	Adjust.onResume();
// });
//
// Ti.App.addEventListener('paused', function(e) {
// 	Adjust.onPause();
// });
//
// if (OS_IOS) {
// 	Ti.App.iOS.addEventListener('continueactivity', function(e) {
// 		if (e.activityType === "NSUserActivityTypeBrowsingWeb") {
// 			var deeplink = e.webpageURL;
// 			if (deeplink) {
// 				Ti.API.info("[AdjustExample]: URL = " + deeplink);
// 				Adjust.appWillOpenUrl(deeplink);
// 			}
// 		}
// 	});
//
// 	Ti.App.addEventListener('resumed', function() {
// 		var args = Ti.App.getArguments();
// 		if (args.url) {
// 			Ti.API.info("[AdjustExample]: URL = " + args.url);
// 			Adjust.appWillOpenUrl(args.url);
// 		}
// 	});
// } else if (OS_ANDROID) {
// 	var activity = Ti.Android.currentActivity;
// 	var url = activity.getIntent().getData();
// 	if (url) {
// 		Ti.API.info("[AdjustExample]: URL = " + url);
// 		Adjust.appWillOpenUrl(url);
// 	}
// }
//
// var adjustConfig = new AdjustConfig("2fm9gkqubvpc", AdjustConfig.EnvironmentSandbox);
// adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
// adjustConfig.setDelayStart(6.0);
// adjustConfig.setSendInBackground(true);
// adjustConfig.setShouldLaunchDeeplink(true);
// adjustConfig.setUserAgent("Adjust Custom UA");
// adjustConfig.setDeviceKnown(true);
// // adjustConfig.setEventBufferingEnabled(true);
//
// adjustConfig.setAttributionCallback(function(attribution) {
// 	Ti.API.info("[AdjustExample]: Attribution callback invoked!");
// 	Ti.API.info("[AdjustExample]: Tracker token = " + attribution.trackerToken);
// 	Ti.API.info("[AdjustExample]: Tracker name = " + attribution.trackerName);
// 	Ti.API.info("[AdjustExample]: Network = " + attribution.network);
// 	Ti.API.info("[AdjustExample]: Campaign = " + attribution.campaign);
// 	Ti.API.info("[AdjustExample]: Adgroup = " + attribution.adgroup);
// 	Ti.API.info("[AdjustExample]: Creative = " + attribution.creative);
// 	Ti.API.info("[AdjustExample]: Click label = " + attribution.clickLabel);
// 	Ti.API.info("[AdjustExample]: Adid = " + attribution.adid);
// });
//
// adjustConfig.setEventTrackingSuccessCallback(function(eventSuccess) {
// 	Ti.API.info("[AdjustExample]: Event tracking success callback invoked!");
// 	Ti.API.info("[AdjustExample]: Message: " + eventSuccess.message);
// 	Ti.API.info("[AdjustExample]: Timestamp: " + eventSuccess.timestamp);
// 	Ti.API.info("[AdjustExample]: Adid: " + eventSuccess.adid);
// 	Ti.API.info("[AdjustExample]: Event token: " + eventSuccess.eventToken);
// 	Ti.API.info("[AdjustExample]: Callback ID: " + eventSuccess.callbackId);
// 	Ti.API.info("[AdjustExample]: JSON response: " + eventSuccess.jsonResponse);
// });
//
// adjustConfig.setEventTrackingFailureCallback(function(eventFailure) {
// 	Ti.API.info("[AdjustExample]: Event tracking failure callback invoked!");
// 	Ti.API.info("[AdjustExample]: Message: " + eventFailure.message);
// 	Ti.API.info("[AdjustExample]: Timestamp: " + eventFailure.timestamp);
// 	Ti.API.info("[AdjustExample]: Adid: " + eventFailure.adid);
// 	Ti.API.info("[AdjustExample]: Event token: " + eventFailure.eventToken);
// 	Ti.API.info("[AdjustExample]: Callback ID: " + eventFailure.callbackId);
// 	Ti.API.info("[AdjustExample]: Will retry: " + eventFailure.willRetry);
// 	Ti.API.info("[AdjustExample]: JSON response: " + eventFailure.jsonResponse);
// });
//
// adjustConfig.setSessionTrackingSuccessCallback(function(sessionSuccess) {
// 	Ti.API.info("[AdjustExample]: Session tracking succeeded callback invoked!");
// 	Ti.API.info("[AdjustExample]: Message: " + sessionSuccess.message);
// 	Ti.API.info("[AdjustExample]: Timestamp: " + sessionSuccess.timestamp);
// 	Ti.API.info("[AdjustExample]: Adid: " + sessionSuccess.adid);
// 	Ti.API.info("[AdjustExample]: JSON response: " + sessionSuccess.jsonResponse);
// });
//
// adjustConfig.setSessionTrackingFailureCallback(function(sessionFailure) {
// 	Ti.API.info("[AdjustExample]: Session tracking failed callback invoked!");
// 	Ti.API.info("[AdjustExample]: Message: " + sessionFailure.message);
// 	Ti.API.info("[AdjustExample]: Timestamp: " + sessionFailure.timestamp);
// 	Ti.API.info("[AdjustExample]: Adid: " + sessionFailure.adid);
// 	Ti.API.info("[AdjustExample]: Will retry: " + sessionFailure.willRetry);
// 	Ti.API.info("[AdjustExample]: JSON response: " + sessionFailure.jsonResponse);
// });
//
// adjustConfig.setDeferredDeeplinkCallback(function(uri) {
// 	Ti.API.info("[AdjustExample]: Deferred deep link callback invoked!");
// 	Ti.API.info("[AdjustExample]: URL: " + uri.uri);
// 	Adjust.appWillOpenUrl(uri.uri);
// });
//
// Adjust.addSessionCallbackParameter("scp1", "scpv1");
// Adjust.addSessionCallbackParameter("scp2", "scpv2");
// Adjust.addSessionPartnerParameter("spp1", "sppv1");
// Adjust.addSessionPartnerParameter("spp2", "sppv2");
// Adjust.removeSessionCallbackParameter("scp1");
// Adjust.removeSessionPartnerParameter("spp1");
//
// // Adjust.resetSessionCallbackParameters();
// // Adjust.resetSessionPartnerParameters();
//
Adjust.start({
	appToken: "2fm9gkqubvpc"
});
// Adjust.sendFirstPackages();
//
//
//
// function btnTrackEventTapped(e) {
// 	var adjustEvent = new AdjustEvent("g3mfiw");
// 	adjustEvent.setRevenue(10.0, "USD");
// 	adjustEvent.setCallbackId("CUSTOM-CALLBACK-ID");
// 	adjustEvent.addCallbackParameter("DUMMY-KEY-1", "DUMMY-VALUE-1");
// 	adjustEvent.addCallbackParameter("DUMMY-KEY-2", "DUMMY-VALUE-2");
// 	adjustEvent.addPartnerParameter("DUMMY-KEY-1", "DUMMY-VALUE-1");
// 	adjustEvent.addPartnerParameter("DUMMY-KEY-2", "DUMMY-VALUE-2");
// 	Adjust.trackEvent(adjustEvent);
// }
//
// function btnEnableOfflineModeTapped(e) {
// 	Adjust.setOfflineMode(true);
// }
//
// function btnDisableOfflineModeTapped(e) {
// 	Adjust.setOfflineMode(false);
// }
//
// function btnEnableSdkTapped(e) {
// 	Adjust.setEnabled(true);
// }
//
// function btnDisableSdkTapped(e) {
// 	Adjust.setEnabled(false);
// }
//
// function btnGetIdsTapped(e) {
// 	Adjust.getAttribution(function(attribution) {
// 		Ti.API.info("[AdjustExample]: Tracker token = " + attribution.trackerToken);
// 		Ti.API.info("[AdjustExample]: Tracker name = " + attribution.trackerName);
// 		Ti.API.info("[AdjustExample]: Network = " + attribution.network);
// 		Ti.API.info("[AdjustExample]: Campaign = " + attribution.campaign);
// 		Ti.API.info("[AdjustExample]: Adgroup = " + attribution.adgroup);
// 		Ti.API.info("[AdjustExample]: Creative = " + attribution.creative);
// 		Ti.API.info("[AdjustExample]: Click label = " + attribution.clickLabel);
// 		Ti.API.info("[AdjustExample]: Adid = " + attribution.adid);
// 	});
// 	Adjust.getAdid(function(adid) {
// 		Ti.API.info("[AdjustExample]: Adid = " + adid);
// 	});
// 	Adjust.getIdfa(function(idfa) {
// 		Ti.API.info("[AdjustExample]: IDFA = " + idfa);
// 	});
// 	Adjust.getGoogleAdId(function(googleAdId) {
// 		Ti.API.info("[AdjustExample]: Google Ad Id = " + googleAdId);
// 	});
// 	Adjust.getAmazonAdId(function(amazonAdId) {
// 		Ti.API.info("[AdjustExample]: Amazon Ad Id = " + amazonAdId);
// 	});
// }
//
// function btnIsSdkEnabledTapped(e) {
// 	Adjust.isEnabled(function(isEnabled) {
// 		if (isEnabled) {
// 			alert("SDK is enabled!");
// 		} else {
// 			alert("SDK is disabled!");
// 		}
// 	});
// }

$.index.open();
