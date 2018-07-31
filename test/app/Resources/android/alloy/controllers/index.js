var Alloy = require('/alloy'),
Backbone = Alloy.Backbone,
_ = Alloy._;




function __processArg(obj, key) {
  var arg = null;
  if (obj) {
    arg = obj[key] || null;
  }
  return arg;
}

function Controller() {

  require('/alloy/controllers/' + 'BaseController').apply(this, Array.prototype.slice.call(arguments));
  this.__controllerPath = 'index';
  this.args = arguments[0] || {};

  if (arguments[0]) {
    var __parentSymbol = __processArg(arguments[0], '__parentSymbol');
    var $model = __processArg(arguments[0], '$model');
    var __itemTemplate = __processArg(arguments[0], '__itemTemplate');
  }
  var $ = this;
  var exports = {};
  var __defers = {};







  $.__views.index = Ti.UI.createWindow(
  { backgroundColor: "white", id: "index" });

  $.__views.index && $.addTopLevelView($.__views.index);
  exports.destroy = function () {};




  _.extend($, $.__views);


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
    Adjust.getAttribution(function (attribution) {
      Ti.API.info("Tracker token = " + attribution.trackerToken);
      Ti.API.info("Tracker name = " + attribution.trackerName);
      Ti.API.info("Network = " + attribution.network);
      Ti.API.info("Campaign = " + attribution.campaign);
      Ti.API.info("Adgroup = " + attribution.adgroup);
      Ti.API.info("Creative = " + attribution.creative);
      Ti.API.info("Click label = " + attribution.clickLabel);
      Ti.API.info("Attribution Adid = " + attribution.adid);
    });

    Adjust.getAdid(function (adid) {
      Ti.API.info("Adid = " + adid);
    });

    Adjust.getIdfa(function (idfa) {
      Ti.API.info("IDFA = " + idfa);
    });

    Adjust.getGoogleAdId(function (googleAdId) {
      Ti.API.info("Google Ad Id = " + googleAdId);
    });

    Adjust.getAmazonAdId(function (amazonAdId) {
      Ti.API.info("Amazon Ad Id = " + amazonAdId);
    });
  }

  function btnIsSdkEnabledTapped(e) {
    Adjust.isEnabled(function (isEnabled) {
      if (isEnabled) {
        alert("SDK is enabled!");
      } else {
        alert("SDK is disabled!");
      }
    });
  }

  $.index.open();









  _.extend($, exports);
}

module.exports = Controller;