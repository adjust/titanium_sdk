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
  $.__views.btnTrackSimpleEvent = Ti.UI.createButton(
  { title: 'Track Simple Event', top: "10%", left: "15%", width: "70%", id: "btnTrackSimpleEvent" });

  $.__views.index.add($.__views.btnTrackSimpleEvent);
  btnTrackSimpleEventTapped ? $.addListener($.__views.btnTrackSimpleEvent, 'click', btnTrackSimpleEventTapped) : __defers['$.__views.btnTrackSimpleEvent!click!btnTrackSimpleEventTapped'] = true;$.__views.btnTrackRevenueEvent = Ti.UI.createButton(
  { title: 'Track Revenue Event', top: "18%", left: "15%", width: "70%", id: "btnTrackRevenueEvent" });

  $.__views.index.add($.__views.btnTrackRevenueEvent);
  btnTrackRevenueEventTapped ? $.addListener($.__views.btnTrackRevenueEvent, 'click', btnTrackRevenueEventTapped) : __defers['$.__views.btnTrackRevenueEvent!click!btnTrackRevenueEventTapped'] = true;$.__views.btnTrackCallbackEvent = Ti.UI.createButton(
  { title: 'Track Callback Event', top: "26%", left: "15%", width: "70%", id: "btnTrackCallbackEvent" });

  $.__views.index.add($.__views.btnTrackCallbackEvent);
  btnTrackCallbackEventTapped ? $.addListener($.__views.btnTrackCallbackEvent, 'click', btnTrackCallbackEventTapped) : __defers['$.__views.btnTrackCallbackEvent!click!btnTrackCallbackEventTapped'] = true;$.__views.btnTrackPartnerEvent = Ti.UI.createButton(
  { title: 'Track Partner Event', top: "34%", left: "15%", width: "70%", id: "btnTrackPartnerEvent" });

  $.__views.index.add($.__views.btnTrackPartnerEvent);
  btnTrackPartnerEventTapped ? $.addListener($.__views.btnTrackPartnerEvent, 'click', btnTrackPartnerEventTapped) : __defers['$.__views.btnTrackPartnerEvent!click!btnTrackPartnerEventTapped'] = true;$.__views.btnEnableOfflineMode = Ti.UI.createButton(
  { title: 'Enable Offline Mode', top: "42%", left: "15%", width: "70%", id: "btnEnableOfflineMode" });

  $.__views.index.add($.__views.btnEnableOfflineMode);
  btnEnableOfflineModeTapped ? $.addListener($.__views.btnEnableOfflineMode, 'click', btnEnableOfflineModeTapped) : __defers['$.__views.btnEnableOfflineMode!click!btnEnableOfflineModeTapped'] = true;$.__views.btnDisableOfflineMode = Ti.UI.createButton(
  { title: 'Disable Offline Mode', top: "50%", left: "15%", width: "70%", id: "btnDisableOfflineMode" });

  $.__views.index.add($.__views.btnDisableOfflineMode);
  btnDisableOfflineModeTapped ? $.addListener($.__views.btnDisableOfflineMode, 'click', btnDisableOfflineModeTapped) : __defers['$.__views.btnDisableOfflineMode!click!btnDisableOfflineModeTapped'] = true;$.__views.btnEnableSdk = Ti.UI.createButton(
  { title: 'Enable SDK', top: "58%", left: "15%", width: "70%", id: "btnEnableSdk" });

  $.__views.index.add($.__views.btnEnableSdk);
  btnEnableSdkTapped ? $.addListener($.__views.btnEnableSdk, 'click', btnEnableSdkTapped) : __defers['$.__views.btnEnableSdk!click!btnEnableSdkTapped'] = true;$.__views.btnDisableSdk = Ti.UI.createButton(
  { title: 'Disable SDK', top: "66%", left: "15%", width: "70%", id: "btnDisableSdk" });

  $.__views.index.add($.__views.btnDisableSdk);
  btnDisableSdkTapped ? $.addListener($.__views.btnDisableSdk, 'click', btnDisableSdkTapped) : __defers['$.__views.btnDisableSdk!click!btnDisableSdkTapped'] = true;$.__views.btnGetIds = Ti.UI.createButton(
  { title: 'Get IDs', top: "74%", left: "15%", width: "70%", id: "btnGetIds" });

  $.__views.index.add($.__views.btnGetIds);
  btnGetIdsTapped ? $.addListener($.__views.btnGetIds, 'click', btnGetIdsTapped) : __defers['$.__views.btnGetIds!click!btnGetIdsTapped'] = true;$.__views.btnIsSdkEnabled = Ti.UI.createButton(
  { title: 'Is SDK Enabled?', top: "82%", left: "15%", width: "70%", id: "btnIsSdkEnabled" });

  $.__views.index.add($.__views.btnIsSdkEnabled);
  btnIsSdkEnabledTapped ? $.addListener($.__views.btnIsSdkEnabled, 'click', btnIsSdkEnabledTapped) : __defers['$.__views.btnIsSdkEnabled!click!btnIsSdkEnabledTapped'] = true;exports.destroy = function () {};




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





  __defers['$.__views.btnTrackSimpleEvent!click!btnTrackSimpleEventTapped'] && $.addListener($.__views.btnTrackSimpleEvent, 'click', btnTrackSimpleEventTapped);__defers['$.__views.btnTrackRevenueEvent!click!btnTrackRevenueEventTapped'] && $.addListener($.__views.btnTrackRevenueEvent, 'click', btnTrackRevenueEventTapped);__defers['$.__views.btnTrackCallbackEvent!click!btnTrackCallbackEventTapped'] && $.addListener($.__views.btnTrackCallbackEvent, 'click', btnTrackCallbackEventTapped);__defers['$.__views.btnTrackPartnerEvent!click!btnTrackPartnerEventTapped'] && $.addListener($.__views.btnTrackPartnerEvent, 'click', btnTrackPartnerEventTapped);__defers['$.__views.btnEnableOfflineMode!click!btnEnableOfflineModeTapped'] && $.addListener($.__views.btnEnableOfflineMode, 'click', btnEnableOfflineModeTapped);__defers['$.__views.btnDisableOfflineMode!click!btnDisableOfflineModeTapped'] && $.addListener($.__views.btnDisableOfflineMode, 'click', btnDisableOfflineModeTapped);__defers['$.__views.btnEnableSdk!click!btnEnableSdkTapped'] && $.addListener($.__views.btnEnableSdk, 'click', btnEnableSdkTapped);__defers['$.__views.btnDisableSdk!click!btnDisableSdkTapped'] && $.addListener($.__views.btnDisableSdk, 'click', btnDisableSdkTapped);__defers['$.__views.btnGetIds!click!btnGetIdsTapped'] && $.addListener($.__views.btnGetIds, 'click', btnGetIdsTapped);__defers['$.__views.btnIsSdkEnabled!click!btnIsSdkEnabledTapped'] && $.addListener($.__views.btnIsSdkEnabled, 'click', btnIsSdkEnabledTapped);



  _.extend($, exports);
}

module.exports = Controller;