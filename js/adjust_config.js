function AdjustConfig(appToken, environment) {
    this.sdkPrefix = "titanium4.11.2";

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

module.exports = AdjustConfig;
