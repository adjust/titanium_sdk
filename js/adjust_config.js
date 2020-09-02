//
//  adjust_config.js
//  Adjust SDK
//
//  Created by Uglješa Erceg (@ugi) on 18th May 2017.
//  Copyright © 2017-2020 Adjust GmbH. All rights reserved.
//

function AdjustConfig(appToken, environment) {
    this.appToken = appToken;
    this.environment = environment;
    this.logLevel = undefined;
    this.userAgent = undefined;
    this.delayStart = undefined;
    this.defaultTracker = undefined;
    this.externalDeviceId = undefined;
    this.urlStrategy = undefined;
    this.sendInBackground = undefined;
    this.shouldLaunchDeeplink = undefined;
    this.eventBufferingEnabled = undefined;
    this.attributionCallback = undefined;
    this.sessionSuccessCallback = undefined;
    this.sessionFailureCallback = undefined;
    this.eventSuccessCallback = undefined;
    this.eventFailureCallback = undefined;
    this.deferredDeeplinkCallback = undefined;
    this.secretId = undefined;
    this.info1 = undefined;
    this.info2 = undefined;
    this.info3 = undefined;
    this.info4 = undefined;
    this.isDeviceKnown = undefined;
    // android only
    this.processName = undefined;
    this.readMobileEquipmentIdentity = undefined;
    // ios only
    // iOS only
    this.allowiAdInfoReading = undefined;
    this.allowIdfaReading = undefined;
    this.handleSkAdNetwork = undefined;
};

AdjustConfig.EnvironmentSandbox = "sandbox";
AdjustConfig.EnvironmentProduction = "production";
AdjustConfig.LogLevelVerbose = "VERBOSE";
AdjustConfig.LogLevelDebug = "DEBUG";
AdjustConfig.LogLevelInfo = "INFO";
AdjustConfig.LogLevelWarn = "WARN";
AdjustConfig.LogLevelError = "ERROR";
AdjustConfig.LogLevelAssert = "ASSERT";
AdjustConfig.LogLevelSuppress = "SUPPRESS";
AdjustConfig.UrlStrategyChina = "china";
AdjustConfig.UrlStrategyIndia = "india";

AdjustConfig.prototype.setLogLevel = function(logLevel) {
    this.logLevel = logLevel;
};

AdjustConfig.prototype.setUserAgent = function(userAgent) {
    this.userAgent = userAgent;
};

AdjustConfig.prototype.setDelayStart = function(delayStart) {
    this.delayStart = delayStart;
};

AdjustConfig.prototype.setProcessName = function(processName) {
    this.processName = processName;
};

AdjustConfig.prototype.setDefaultTracker = function(defaultTracker) {
    this.defaultTracker = defaultTracker;
};

AdjustConfig.prototype.setExternalDeviceId = function(externalDeviceId) {
    this.externalDeviceId = externalDeviceId;
};

AdjustConfig.prototype.setUrlStrategy = function(urlStrategy) {
    this.urlStrategy = urlStrategy;
};

AdjustConfig.prototype.setSendInBackground = function(shouldSend) {
    this.sendInBackground = shouldSend;
};

AdjustConfig.prototype.setShouldLaunchDeeplink = function(shouldLaunch) {
    this.shouldLaunchDeeplink = shouldLaunch;
};

AdjustConfig.prototype.setEventBufferingEnabled = function(isEnabled) {
    this.eventBufferingEnabled = isEnabled;
};

AdjustConfig.prototype.setAttributionCallback = function(callback) {
    this.attributionCallback = callback;
};

AdjustConfig.prototype.setSessionTrackingSuccessCallback = function(callback) {
    this.sessionSuccessCallback = callback;
};

AdjustConfig.prototype.setSessionTrackingFailureCallback = function(callback) {
    this.sessionFailureCallback = callback;
};

AdjustConfig.prototype.setEventTrackingSuccessCallback = function(callback) {
    this.eventSuccessCallback = callback;
};

AdjustConfig.prototype.setEventTrackingFailureCallback = function(callback) {
    this.eventFailureCallback = callback;
};

AdjustConfig.prototype.setDeferredDeeplinkCallback = function(callback) {
    this.deferredDeeplinkCallback = callback;
};

AdjustConfig.prototype.setAppSecret = function(secretId, info1, info2, info3, info4) {
    if (secretId != null) {
        this.secretId = secretId.toString();
    }
    if (info1 != null) {
        this.info1 = info1.toString();
    }
    if (info2 != null) {
        this.info2 = info2.toString();
    }
    if (info3 != null) {
        this.info3 = info3.toString();
    }
    if (info4 != null) {
        this.info4 = info4.toString();
    }
};

AdjustConfig.prototype.setDeviceKnown = function(isDeviceKnown) {
    this.isDeviceKnown = isDeviceKnown;
};

AdjustConfig.prototype.setReadMobileEquipmentIdentity = function(readMobileEquipmentIdentity) {
    // IMEI reading has been deprecated.
    // this.readMobileEquipmentIdentity = readMobileEquipmentIdentity;
};

AdjustConfig.prototype.setAllowiAdInfoReading = function(allowiAdInfoReading) {
    this.allowiAdInfoReading = allowiAdInfoReading;
};

AdjustConfig.prototype.setAllowIdfaReading = function(allowIdfaReading) {
    this.allowIdfaReading = allowIdfaReading;
};

AdjustConfig.prototype.deactivateSKAdNetworkHandling = function() {
    this.handleSkAdNetwork = false;
};

module.exports = AdjustConfig;
