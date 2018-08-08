var Adjust = require('ti.adjust');
var AdjustTest = require('ti.adjust.test');
var AdjustEvent = require('adjust_event');
var AdjustConfig = require('adjust_config');

function AdjustTestOptions() {
    this.hasContext = false;
    this.baseUrl = null;
    this.gdprUrl = null;
    this.basePath = null;
    this.gdprPath = null;
    this.useTestConnectionOptions = null;
    this.timerIntervalInMilliseconds = null;
    this.timerStartInMilliseconds = null;
    this.sessionIntervalInMilliseconds = null;
    this.subsessionIntervalInMilliseconds = null;
    this.teardown = null;
    this.teardown = null;
    this.tryInstallReferrer = null;
    this.noBackoffWait = null;
};

function AdjustCommand(functionName, params, order) {
    this.functionName = functionName;
    this.params = params;
    this.order = order;
}

function CommandExecutor(baseUrl, gdprUrl) {
    this.adjustCommandExecutor = new AdjustCommandExecutor(baseUrl, gdprUrl);
};

CommandExecutor.prototype.scheduleCommand = function (className, functionName, params, order) {
    switch (className) {
        case "Adjust":
            var command = new AdjustCommand(functionName, params, order);
            this.adjustCommandExecutor.scheduleCommand(command);
            break;
    }
};

function AdjustCommandExecutor(baseUrl, gdprUrl) {
    this.baseUrl = baseUrl;
    this.gdprUrl = gdprUrl;
    this.basePath = null;
    this.gdprPath = null;
    this.savedEvents = {};
    this.savedConfigs = {};
    this.savedCommands = [];
    this.nextToSendCounter = 0;
};

AdjustCommandExecutor.prototype.scheduleCommand = function (command) {
    console.log('[CommandExecutor]: nextToSendCounter: ' + this.nextToSendCounter + ', command: ' + JSON.stringify(command));

    if (command['order'] === this.nextToSendCounter) {
        this.executeCommand(command, -1);
        return;
    }

    this.savedCommands.push(command);

    this.checkList();
};

AdjustCommandExecutor.prototype.checkList = function () {
    for (var i = 0; i < this.savedCommands.length; i++) {
        var command = this.savedCommands[i];
        if (command['order'] === this.nextToSendCounter) {
            this.executeCommand(command, i);
            return;
        }
    }
};

AdjustCommandExecutor.prototype.executeCommand = function (command, idx) {
    console.log('[CommandExecutor]: executeCommand():' + JSON.stringify(command));

    switch (command['functionName']) {
        case "testOptions":
            this.testOptions(command['params']);break;
        case "config":
            this.config(command['params']);break;
        case "start":
            this.start(command['params']);break;
        case "event":
            this.event(command['params']);break;
        case "trackEvent":
            this.trackEvent(command['params']);break;
        case "resume":
            this.resume(command['params']);break;
        case "pause":
            this.pause(command['params']);break;
        case "setEnabled":
            this.setEnabled(command['params']);break;
        case "setReferrer":
            this.setReferrer(command['params']);break;
        case "setOfflineMode":
            this.setOfflineMode(command['params']);break;
        case "sendFirstPackages":
            this.sendFirstPackages(command['params']);break;
        case "addSessionCallbackParameter":
            this.addSessionCallbackParameter(command['params']);break;
        case "addSessionPartnerParameter":
            this.addSessionPartnerParameter(command['params']);break;
        case "removeSessionCallbackParameter":
            this.removeSessionCallbackParameter(command['params']);break;
        case "removeSessionPartnerParameter":
            this.removeSessionPartnerParameter(command['params']);break;
        case "resetSessionCallbackParameters":
            this.resetSessionCallbackParameters(command['params']);break;
        case "resetSessionPartnerParameters":
            this.resetSessionPartnerParameters(command['params']);break;
        case "setPushToken":
            this.setPushToken(command['params']);break;
        case "openDeeplink":
            this.openDeeplink(command['params']);break;
        case "sendReferrer":
            this.sendReferrer(command['params']);break;
        case "gdprForgetMe":
            this.gdprForgetMe(command['params']);break;
    }

    this.nextToSendCounter++;

    if (idx != -1) {
        this.savedCommands.splice(idx, 1);
    }

    this.checkList();
};

AdjustCommandExecutor.prototype.testOptions = function (params) {
    console.log('[CommandExecutor]: testOptions params = ' + JSON.stringify(params));
    var testOptions = new AdjustTestOptions();
    testOptions.baseUrl = this.baseUrl;
    testOptions.gdprUrl = this.gdprUrl;
    if (params['basePath']) {
        this.basePath = getFirstParameterValue(params, 'basePath');
        this.gdprPath = getFirstParameterValue(params, 'basePath');
    }
    if (params['timerInterval']) {
        testOptions.timerIntervalInMilliseconds = getFirstParameterValue(params, 'timerInterval').toString();
    }
    if (params['timerStart']) {
        testOptions.timerStartInMilliseconds = getFirstParameterValue(params, 'timerStart').toString();
    }
    if (params['sessionInterval']) {
        testOptions.sessionIntervalInMilliseconds = getFirstParameterValue(params, 'sessionInterval').toString();
    }
    if (params['subsessionInterval']) {
        testOptions.subsessionIntervalInMilliseconds = getFirstParameterValue(params, 'subsessionInterval').toString();
    }
    if (params['tryInstallReferrer']) {
        testOptions.tryInstallReferrer = getFirstParameterValue(params, 'tryInstallReferrer').toString();
    }
    if (params['noBackoffWait']) {
        testOptions.noBackoffWait = getFirstParameterValue(params, 'noBackoffWait').toString();
    }
    if (params['teardown']) {
        var teardownOptions = getValueFromKey(params, 'teardown');
        for (var i = 0; i < teardownOptions.length; i++) {
            var option = teardownOptions[i];

            if ('resetSdk' === option) {
                testOptions.teardown = true;
                testOptions.basePath = this.basePath;
                testOptions.gdprPath = this.gdprPath;
                testOptions.useTestConnectionOptions = true;
                Adjust.teardown();
            }

            if ('deleteState' === option) {
                testOptions.hasContext = true;
            }

            if ('resetTest' === option) {
                this.savedEvents = {};
                this.savedConfigs = {};
                testOptions.timerIntervalInMilliseconds = (-1).toString();
                testOptions.timerStartInMilliseconds = (-1).toString();
                testOptions.sessionIntervalInMilliseconds = (-1).toString();
                testOptions.subsessionIntervalInMilliseconds = (-1).toString();
            }
            if ('sdk' === option) {
                testOptions.teardown = true;
                testOptions.basePath = null;
                testOptions.gdprPath = null;
                testOptions.useTestConnectionOptions = false;
                Adjust.teardown();
            }
            if ('test' === option) {
                this.savedEvents = null;
                this.savedConfigs = null;
                testOptions.timerIntervalInMilliseconds = (-1).toString();
                testOptions.timerStartInMilliseconds = (-1).toString();
                testOptions.sessionIntervalInMilliseconds = (-1).toString();
                testOptions.subsessionIntervalInMilliseconds = (-1).toString();
            }
        }
    }

    console.log('[CommandExecutor]: testOptions = ' + JSON.stringify(testOptions));
    Adjust.setTestOptions(testOptions);
};

AdjustCommandExecutor.prototype.config = function (params) {
    var configNumber = 0;
    if (params['configName']) {
        var configName = getFirstParameterValue(params, 'configName');
        configNumber = parseInt(configName.substr(configName.length - 1));
    }

    var adjustConfig;
    if (this.savedConfigs[configNumber]) {
        adjustConfig = this.savedConfigs[configNumber];
    } else {
        var environment = getFirstParameterValue(params, "environment");
        var appToken = getFirstParameterValue(params, "appToken");

        adjustConfig = new AdjustConfig(appToken, environment);
        adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);

        this.savedConfigs[configNumber] = adjustConfig;
    }

    if (params['logLevel']) {
        var logLevelS = getFirstParameterValue(params, 'logLevel');
        var logLevel = null;
        switch (logLevelS) {
            case "verbose":
                logLevel = AdjustConfig.LogLevelVerbose;
                break;
            case "debug":
                logLevel = AdjustConfig.LogLevelDebug;
                break;
            case "info":
                logLevel = AdjustConfig.LogLevelInfo;
                break;
            case "warn":
                logLevel = AdjustConfig.LogLevelWarn;
                break;
            case "error":
                logLevel = AdjustConfig.LogLevelError;
                break;
            case "assert":
                logLevel = AdjustConfig.LogLevelAssert;
                break;
            case "suppress":
                logLevel = AdjustConfig.LogLevelSuppress;
                break;
        }

        adjustConfig.setLogLevel(logLevel);
    }

    if (params['sdkPrefix']) {
        var sdkPrefix = getFirstParameterValue(params, 'sdkPrefix');
        adjustConfig.setSdkPrefix(sdkPrefix);
    }

    if (params['defaultTracker']) {
        var defaultTracker = getFirstParameterValue(params, 'defaultTracker');
        adjustConfig.setDefaultTracker(defaultTracker);
    }

    if (params['appSecret']) {
        var appSecretArray = getValueFromKey(params, 'appSecret');
        var secretId = appSecretArray[0].toString();
        var info1 = appSecretArray[1].toString();
        var info2 = appSecretArray[2].toString();
        var info3 = appSecretArray[3].toString();
        var info4 = appSecretArray[4].toString();

        adjustConfig.setAppSecret(secretId, info1, info2, info3, info4);
    }

    if (params['delayStart']) {
        var delayStartS = getFirstParameterValue(params, 'delayStart');
        var delayStart = parseFloat(delayStartS);
        adjustConfig.setDelayStart(delayStart);
    }

    if (params['deviceKnown']) {
        var deviceKnownS = getFirstParameterValue(params, 'deviceKnown');
        var deviceKnown = deviceKnownS == 'true';
        adjustConfig.setDeviceKnown(deviceKnown);
    }

    if (params['eventBufferingEnabled']) {
        var eventBufferingEnabledS = getFirstParameterValue(params, 'eventBufferingEnabled');
        var eventBufferingEnabled = eventBufferingEnabledS == 'true';
        adjustConfig.setEventBufferingEnabled(eventBufferingEnabled);
    }

    if (params['sendInBackground']) {
        var sendInBackgroundS = getFirstParameterValue(params, 'sendInBackground');
        var sendInBackground = sendInBackgroundS == 'true';
        adjustConfig.setSendInBackground(sendInBackground);
    }

    if (params['userAgent']) {
        var userAgent = getFirstParameterValue(params, 'userAgent');
        adjustConfig.setUserAgent(userAgent);
    }

    if (params['attributionCallbackSendAll']) {
        var basePath = this.basePath;
        adjustConfig.setAttributionCallback(function (attribution) {
            AdjustTest.addInfoToSend("trackerToken", attribution.trackerToken);
            AdjustTest.addInfoToSend("trackerName", attribution.trackerName);
            AdjustTest.addInfoToSend("network", attribution.network);
            AdjustTest.addInfoToSend("campaign", attribution.campaign);
            AdjustTest.addInfoToSend("adgroup", attribution.adgroup);
            AdjustTest.addInfoToSend("creative", attribution.creative);
            AdjustTest.addInfoToSend("clickLabel", attribution.clickLabel);
            AdjustTest.addInfoToSend("adid", attribution.adid);
            AdjustTest.sendInfoToServer(basePath);
        });
    }

    if (params['sessionCallbackSendSuccess']) {
        var basePath = this.basePath;
        adjustConfig.setSessionTrackingSuccessCallback(function (sessionSuccess) {
            AdjustTest.addInfoToSend("message", sessionSuccess.message);
            AdjustTest.addInfoToSend("timestamp", sessionSuccess.timestamp);
            AdjustTest.addInfoToSend("adid", sessionSuccess.adid);
            if (sessionSuccess.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", sessionSuccess.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(basePath);
        });
    }

    if (params['sessionCallbackSendFailure']) {
        var basePath = this.basePath;
        adjustConfig.setSessionTrackingFailureCallback(function (sessionFailed) {
            AdjustTest.addInfoToSend("message", sessionFailed.message);
            AdjustTest.addInfoToSend("timestamp", sessionFailed.timestamp);
            AdjustTest.addInfoToSend("adid", sessionFailed.adid);
            AdjustTest.addInfoToSend("willRetry", sessionFailed.willRetry);
            if (sessionFailed.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", sessionFailed.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(basePath);
        });
    }

    if (params['eventCallbackSendSuccess']) {
        var basePath = this.basePath;
        adjustConfig.setEventTrackingSuccessCallback(function (eventSuccess) {
            AdjustTest.addInfoToSend("message", eventSuccess.message);
            AdjustTest.addInfoToSend("timestamp", eventSuccess.timestamp);
            AdjustTest.addInfoToSend("adid", eventSuccess.adid);
            AdjustTest.addInfoToSend("eventToken", eventSuccess.eventToken);
            if (eventSuccess.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", eventSuccess.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(basePath);
        });
    }

    if (params['eventCallbackSendFailure']) {
        var basePath = this.basePath;
        adjustConfig.setEventTrackingFailureCallback(function (eventFailed) {
            AdjustTest.addInfoToSend("message", eventFailed.message);
            AdjustTest.addInfoToSend("timestamp", eventFailed.timestamp);
            AdjustTest.addInfoToSend("adid", eventFailed.adid);
            AdjustTest.addInfoToSend("eventToken", eventFailed.eventToken);
            AdjustTest.addInfoToSend("willRetry", eventFailed.willRetry);
            if (eventFailed.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", eventFailed.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(basePath);
        });
    }

    if (params['deferredDeeplinkCallback']) {
        var basePath = this.basePath;
        adjustConfig.setDeferredDeeplinkCallback(function (deeplink) {
            var openDeeplinkS = getFirstParameterValue(params, 'deferredDeeplinkCallback');
            var openDeeplink = openDeeplinkS == 'true';
            AdjustTest.sendInfoToServer(basePath);
            if (openDeeplink === true) {
                Adjust.appWillOpenUrl(deeplink);
            }
        });
    }
};

AdjustCommandExecutor.prototype.start = function (params) {
    this.config(params);
    var configNumber = 0;
    if (params['configName']) {
        var configName = getFirstParameterValue(params, 'configName');
        configNumber = parseInt(configName.substr(configName.length - 1));
    }

    var adjustConfig = this.savedConfigs[configNumber];
    Adjust.start(adjustConfig);

    delete this.savedConfigs[0];
};

AdjustCommandExecutor.prototype.event = function (params) {
    var eventNumber = 0;
    if (params['eventName']) {
        var eventName = getFirstParameterValue(params, 'eventName');
        eventNumber = parseInt(eventName.substr(eventName.length - 1));
    }

    var adjustEvent;
    if (this.savedEvents[eventNumber]) {
        adjustEvent = this.savedEvents[eventNumber];
    } else {
        var eventToken = getFirstParameterValue(params, 'eventToken');
        adjustEvent = new AdjustEvent(eventToken);
        this.savedEvents[eventNumber] = adjustEvent;
    }

    if (params['revenue']) {
        var revenueParams = getValueFromKey(params, 'revenue');
        var currency = revenueParams[0];
        var revenue = parseFloat(revenueParams[1]);
        adjustEvent.setRevenue(revenue, currency);
    }

    if (params['callbackParams']) {
        var callbackParams = getValueFromKey(params, 'callbackParams');
        for (var i = 0; i < callbackParams.length; i = i + 2) {
            var key = callbackParams[i];
            var value = callbackParams[i + 1];
            adjustEvent.addCallbackParameter(key, value);
        }
    }

    if (params['partnerParams']) {
        var partnerParams = getValueFromKey(params, 'partnerParams');
        for (var i = 0; i < partnerParams.length; i = i + 2) {
            var key = partnerParams[i];
            var value = partnerParams[i + 1];
            adjustEvent.addPartnerParameter(key, value);
        }
    }

    if (params['orderId']) {
        var orderId = getFirstParameterValue(params, 'orderId');
        adjustEvent.setTransactionId(orderId);
    }
};

AdjustCommandExecutor.prototype.trackEvent = function (params) {
    this.event(params);
    var eventNumber = 0;
    if (params['eventName']) {
        var eventName = getFirstParameterValue(params, 'eventName');
        eventNumber = parseInt(eventName.substr(eventName.length - 1));
    }

    var adjustEvent = this.savedEvents[eventNumber];
    Adjust.trackEvent(adjustEvent);

    delete this.savedEvents[0];
};

AdjustCommandExecutor.prototype.setReferrer = function (params) {
    var referrer = getFirstParameterValue(params, 'referrer');
    Adjust.setReferrer(referrer);
};

AdjustCommandExecutor.prototype.pause = function (params) {
    Adjust.onPause("test");
};

AdjustCommandExecutor.prototype.resume = function (params) {
    Adjust.onResume("test");
};

AdjustCommandExecutor.prototype.setEnabled = function (params) {
    var enabled = getFirstParameterValue(params, "enabled") == 'true';
    Adjust.setEnabled(enabled);
};

AdjustCommandExecutor.prototype.setOfflineMode = function (params) {
    var enabled = getFirstParameterValue(params, "enabled") == 'true';
    Adjust.setOfflineMode(enabled);
};

AdjustCommandExecutor.prototype.sendFirstPackages = function (params) {
    Adjust.sendFirstPackages();
};

AdjustCommandExecutor.prototype.gdprForgetMe = function (params) {
    Adjust.gdprForgetMe();
};

AdjustCommandExecutor.prototype.addSessionCallbackParameter = function (params) {
    var list = getValueFromKey(params, "KeyValue");

    for (var i = 0; i < list.length; i = i + 2) {
        var key = list[i];
        var value = list[i + 1];

        Adjust.addSessionCallbackParameter(key, value);
    }
};

AdjustCommandExecutor.prototype.addSessionPartnerParameter = function (params) {
    var list = getValueFromKey(params, "KeyValue");

    for (var i = 0; i < list.length; i = i + 2) {
        var key = list[i];
        var value = list[i + 1];

        Adjust.addSessionPartnerParameter(key, value);
    }
};

AdjustCommandExecutor.prototype.removeSessionCallbackParameter = function (params) {
    if ('key' in params) {
        var list = getValueFromKey(params, 'key');

        for (var i = 0; i < list.length; i++) {
            Adjust.removeSessionCallbackParameter(list[i]);
        }
    }
};

AdjustCommandExecutor.prototype.removeSessionPartnerParameter = function (params) {
    if ('key' in params) {
        var list = getValueFromKey(params, 'key');

        for (var i = 0; i < list.length; i++) {
            Adjust.removeSessionPartnerParameter(list[i]);
        }
    }
};

AdjustCommandExecutor.prototype.resetSessionCallbackParameters = function (params) {
    Adjust.resetSessionCallbackParameters();
};

AdjustCommandExecutor.prototype.resetSessionPartnerParameters = function (params) {
    Adjust.resetSessionPartnerParameters();
};

AdjustCommandExecutor.prototype.setPushToken = function (params) {
    var token = getFirstParameterValue(params, 'pushToken');
    Adjust.setPushToken(token);
};

AdjustCommandExecutor.prototype.openDeeplink = function (params) {
    var deeplink = getFirstParameterValue(params, "deeplink");
    Adjust.appWillOpenUrl(deeplink);
};

AdjustCommandExecutor.prototype.sendReferrer = function (params) {
    var referrer = getFirstParameterValue(params, 'referrer');
    Adjust.setReferrer(referrer);
};

function getValueFromKey(params, key) {
    if (key in params) {
        return params[key];
    }

    return null;
}

function getFirstParameterValue(params, key) {
    if (key in params) {
        var param = params[key];
        console.log('[CommandExecutor]: getFirstParameterValue');
        console.log('[CommandExecutor]: param = ' + JSON.stringify(param));

        if (param != null && param.length >= 1) {
            console.log('[CommandExecutor]: param[0] = ' + param[0]);
            return param[0];
        }
    }

    return null;
}

module.exports = CommandExecutor;