var Adjust = require('ti.adjust');
var AdjustEvent = require('adjust_event');

 function btnTrackEventTapped(e) {
    var adjustEvent = new AdjustEvent("g3mfiw");
    adjustEvent.setRevenue(10.0, "USD");
    adjustEvent.setTransactionId("DUMMY_TRANSACTION_ID");
    adjustEvent.addCallbackParameter("DUMMY_KEY_1", "DUMMY_VALUE_1");
    adjustEvent.addCallbackParameter("DUMMY_KEY_2", "DUMMY_VALUE_2");
    adjustEvent.addPartnerParameter("DUMMY_KEY_1", "DUMMY_VALUE_1");
    adjustEvent.addPartnerParameter("DUMMY_KEY_2", "DUMMY_VALUE_2");
    Adjust.trackEvent(adjustEvent);
 }

function btnEnableOfflineModeTapped(e) {
    Adjust.setOfflineMode(true);
}

function btnDisableOfflineModeTapped(e) {
    Adjust.setOfflineMode(false);
}

function btnEnableSdkTapped(e) {
    Adjust.setEnabled(true);
}

function btnDisableSdkTapped(e) {
    Adjust.setEnabled(false);
}

function btnGetIdsTapped(e) {
    Adjust.getAttribution(function(attribution) {
        Ti.API.info("[AdjustExample]: Tracker token = " + attribution.trackerToken);
        Ti.API.info("[AdjustExample]: Tracker name = " + attribution.trackerName);
        Ti.API.info("[AdjustExample]: Network = " + attribution.network);
        Ti.API.info("[AdjustExample]: Campaign = " + attribution.campaign);
        Ti.API.info("[AdjustExample]: Adgroup = " + attribution.adgroup);
        Ti.API.info("[AdjustExample]: Creative = " + attribution.creative);
        Ti.API.info("[AdjustExample]: Click label = " + attribution.clickLabel);
        Ti.API.info("[AdjustExample]: Adid = " + attribution.adid);
    });
    Adjust.getAdid(function(adid) {
        Ti.API.info("[AdjustExample]: Adid = " + adid);
    });
    Adjust.getIdfa(function(idfa) {
        Ti.API.info("[AdjustExample]: IDFA = " + idfa);
    });
    Adjust.getGoogleAdId(function(googleAdId) {
        Ti.API.info("[AdjustExample]: Google Ad Id = " + googleAdId);
    });
    Adjust.getAmazonAdId(function(amazonAdId) {
        Ti.API.info("[AdjustExample]: Amazon Ad Id = " + amazonAdId);
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
