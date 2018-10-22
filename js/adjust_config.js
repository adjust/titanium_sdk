//
//  adjust_config.js
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 18th May 2017.
//  Copyright © 2017-2018 Adjust GmbH. All rights reserved.
//

function AdjustConfig(appToken, environment) {
    this.sdkPrefix = "titanium4.15.0";
    this.appToken = appToken;
    this.environment = environment;
    this.logLevel = undefined;
    this.userAgent = undefined;
    this.delayStart = undefined;
    this.processName = undefined;
    this.defaultTracker = undefined;
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
    this.readMobileEquipmentIdentity = undefined;
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
    this.readMobileEquipmentIdentity = readMobileEquipmentIdentity;
};

module.exports = AdjustConfig;
