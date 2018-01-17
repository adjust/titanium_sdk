var Adjust = require('ti.adjust');
var AdjustEvent = require('adjust_event');

 function btnTrackSimpleEventTapped(e) {
    var adjustEvent = new AdjustEvent("g3mfiw");
    Adjust.trackEvent(adjustEvent);
 }

function btnTrackRevenueEventTapped(e) {
    var adjustEvent = new AdjustEvent("a4fd35");
    adjustEvent.setRevenue(10.0, "USD");
    adjustEvent.setTransactionId("DUMMY_TRANSACTION_ID");
    Adjust.trackEvent(adjustEvent);
}

function btnTrackCallbackEventTapped(e) {
    var adjustEvent = new AdjustEvent("34vgg9");

    adjustEvent.addCallbackParameter("DUMMY_KEY_1", "DUMMY_VALUE_1");
    adjustEvent.addCallbackParameter("DUMMY_KEY_2", "DUMMY_VALUE_2");

    Adjust.trackEvent(adjustEvent);
}

function btnTrackPartnerEventTapped(e) {
    var adjustEvent = new AdjustEvent("w788qs");

    adjustEvent.addPartnerParameter("DUMMY_KEY_1", "DUMMY_VALUE_1");
    adjustEvent.addPartnerParameter("DUMMY_KEY_2", "DUMMY_VALUE_2");

    Adjust.trackEvent(adjustEvent);
}

function btnEnableOfflineModeTapped(e) {
    Adjust.setOfflineMode(true);
    alert("Offline mode enabled!");
}

function btnDisableOfflineModeTapped(e) {
	Adjust.setOfflineMode(false);
    alert("Offline mode is disabled!");
}

function btnEnableSdkTapped(e) {
	Adjust.isEnabled(function(isEnabled) {
        if (isEnabled) {
            alert("SDK is ALREADY enabled!");
        } else {
        	Adjust.setEnabled(true);
            alert("SDK is enabled!");
        }
    });
}

function btnDisableSdkTapped(e) {
	Adjust.isEnabled(function(isEnabled) {
        if (isEnabled) {
        	Adjust.setEnabled(false);
            alert("SDK is disabled!");
        } else {
        	alert("SDK is ALREADY disabled!");
        }
    });
}

function btnGetIdsTapped(e) {
	Adjust.getAttribution(function(attribution) {
        Ti.API.info("Tracker token = " + attribution.trackerToken);
        Ti.API.info("Tracker name = " + attribution.trackerName);
        Ti.API.info("Network = " + attribution.network);
        Ti.API.info("Campaign = " + attribution.campaign);
        Ti.API.info("Adgroup = " + attribution.adgroup);
        Ti.API.info("Creative = " + attribution.creative);
        Ti.API.info("Click label = " + attribution.clickLabel);
        Ti.API.info("Attribution Adid = " + attribution.adid);
    });
    
    Adjust.getAdid(function(adid) {
        Ti.API.info("Adid = " + adid);
    });

    Adjust.getIdfa(function(idfa) {
        Ti.API.info("IDFA = " + idfa);
    });

    Adjust.getGoogleAdId(function(googleAdId) {
        Ti.API.info("Google Ad Id = " + googleAdId);
    });

    Adjust.getAmazonAdId(function(amazonAdId) {
        Ti.API.info("Amazon Ad Id = " + amazonAdId);
    });
}

function btnIsSdkEnabledTapped(e) {
	Adjust.isEnabled(function(isEnabled) {
		if (isEnabled) {
			alert("SDK is enabled!");
		} else {
			alert("SDK is disabled!");
		}
 	});
}

$.index.open();
