//
//  command_executor.js
//  Adjust SDK
//
//  Created by Uglješa Erceg (@ugi) on 6th August 2018.
//  Copyright © 2018-2020 Adjust GmbH. All rights reserved.
//

var Adjust = require('ti.adjust');
var AdjustTest = require('ti.adjust.test');
var AdjustEvent = require('adjust_event');
var AdjustConfig = require('adjust_config');
var AdjustAppStoreSubscription = require('adjust_app_store_subscription');
var AdjustPlayStoreSubscription = require('adjust_play_store_subscription');

function AdjustTestOptions() {
    this.hasContext = false;
    this.baseUrl = null;
    this.gdprUrl = null;
    this.subscriptionUrl = null;
    this.extraPath = null;
    this.basePath = null;
    this.gdprPath = null;
    this.subscriptionPath = null;
    this.useTestConnectionOptions = null;
    this.timerIntervalInMilliseconds = null;
    this.timerStartInMilliseconds = null;
    this.sessionIntervalInMilliseconds = null;
    this.subsessionIntervalInMilliseconds = null;
    this.teardown = null;
    this.tryInstallReferrer = null;
    this.noBackoffWait = null;
    this.iAdFrameworkEnabled = false;
};

// A wrapper for a command received from test server.
function AdjustCommand(functionName, params, order) {
    this.functionName = functionName;
    this.params = params;
    this.order = order;
}

function CommandExecutor(baseUrl, gdprUrl, subscriptionUrl) {
    this.adjustCommandExecutor = new AdjustCommandExecutor(baseUrl, gdprUrl, subscriptionUrl);
};

CommandExecutor.prototype.scheduleCommand = function(className, functionName, params, order) {
    switch (className) {
        case "Adjust":
            var command = new AdjustCommand(functionName, params, order);
            this.adjustCommandExecutor.scheduleCommand(command);
            break;
    }
};

function AdjustCommandExecutor(baseUrl, gdprUrl, subscriptionUrl) {
    this.baseUrl = baseUrl;
    this.gdprUrl = gdprUrl;
    this.subscriptionUrl = subscriptionUrl;
    this.extraPath = null;
    this.basePath = null;
    this.gdprPath = null;
    this.subscriptionPath = null;
    this.savedEvents = {};
    this.savedConfigs = {};
    this.savedCommands = [];
    this.nextToSendCounter = 0;
};

// First point of entry for scheduling commands. Takes a 'AdjustCommand {command}' parameter.
AdjustCommandExecutor.prototype.scheduleCommand = function(command) {
    console.log('[command_executor.js]: nextToSendCounter = ' + this.nextToSendCounter + ', command = ' + JSON.stringify(command));

    // If the command is in order, send in immediately.
    if (command['order'] === this.nextToSendCounter) {
        this.executeCommand(command, -1);
        return;
    }

    // Not in order, schedule it.
    this.savedCommands.push(command);

    // Recheck list
    this.checkList();
}

// Check the list of commands to see which one is in order.
AdjustCommandExecutor.prototype.checkList = function() {
    for (var i = 0; i < this.savedCommands.length; i += 1) {
        var command = this.savedCommands[i];
        if (command['order'] === this.nextToSendCounter) {
            this.executeCommand(command, i);
            return;
        }
    }
}

// Execute the command. This will always be invoked either from:
//  - checkList() after scheduling a command
//  - scheduleCommand() only if the package was in order
//
// (AdjustCommand {command}) : The command to be executed
// (Number {idx})            : index of the command in the schedule list. -1 if it was sent directly
AdjustCommandExecutor.prototype.executeCommand = function(command, idx) {
    console.log('[command_executor.js]: executeCommand method invoked! Command = ' + JSON.stringify(command));
    switch (command['functionName']) {
        case "testOptions" : this.testOptions(command['params']); break;
        case "config" : this.config(command['params']); break;
        case "start" : this.start(command['params']); break;
        case "event" : this.event(command['params']); break;
        case "trackEvent" : this.trackEvent(command['params']); break;
        case "resume" : this.resume(command['params']); break;
        case "pause" : this.pause(command['params']); break;
        case "setEnabled" : this.setEnabled(command['params']); break;
        case "setReferrer" : this.setReferrer(command['params']); break;
        case "setOfflineMode" : this.setOfflineMode(command['params']); break;
        case "sendFirstPackages" : this.sendFirstPackages(command['params']); break;
        case "addSessionCallbackParameter" : this.addSessionCallbackParameter(command['params']); break;
        case "addSessionPartnerParameter" : this.addSessionPartnerParameter(command['params']); break;
        case "removeSessionCallbackParameter" : this.removeSessionCallbackParameter(command['params']); break;
        case "removeSessionPartnerParameter" : this.removeSessionPartnerParameter(command['params']); break;
        case "resetSessionCallbackParameters" : this.resetSessionCallbackParameters(command['params']); break;
        case "resetSessionPartnerParameters" : this.resetSessionPartnerParameters(command['params']); break;
        case "setPushToken" : this.setPushToken(command['params']); break;
        case "openDeeplink" : this.openDeeplink(command['params']); break;
        case "sendReferrer" : this.sendReferrer(command['params']); break;
        case "gdprForgetMe" : this.gdprForgetMe(command['params']); break;
        case "trackAdRevenue" : this.trackAdRevenue(command['params']); break;
        case "disableThirdPartySharing" : this.disableThirdPartySharing(command['params']); break;
        case "trackSubscription" : this.trackSubscription(command['params']); break;
    }

    this.nextToSendCounter += 1;

    // If idx != -1, it means it was not sent directly. Delete its instance from the scheduling array.
    if (idx != -1) {
        this.savedCommands.splice(idx, 1);
    }

    // Recheck the list
    this.checkList();
};

AdjustCommandExecutor.prototype.testOptions = function(params) {
    console.log('[command_executor.js]: testOptions method invoked! params = ' + JSON.stringify(params));
    var testOptions = new AdjustTestOptions();
    testOptions.baseUrl = this.baseUrl;
    testOptions.gdprUrl = this.gdprUrl;
    testOptions.subscriptionUrl = this.subscriptionUrl;
    if (params['basePath']) {
        this.extraPath = getFirstParameterValue(params, 'basePath');
        this.basePath = getFirstParameterValue(params, 'basePath');
        this.gdprPath = getFirstParameterValue(params, 'basePath');
        this.subscriptionPath = getFirstParameterValue(params, 'basePath');
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
    if (params['iAdFrameworkEnabled']) {
        testOptions.iAdFrameworkEnabled = getFirstParameterValue(params, 'iAdFrameworkEnabled').toString();
    }
    if (params['teardown']) {
        var teardownOptions = getValueFromKey(params, 'teardown');
        for (var i = 0; i < teardownOptions.length; i += 1) {
            var option = teardownOptions[i];
            if ('resetSdk' === option) {
                testOptions.teardown = true;
                testOptions.extraPath = this.extraPath;
                testOptions.basePath = this.basePath;
                testOptions.gdprPath = this.gdprPath;
                testOptions.subscriptionPath = this.subscriptionPath;
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
                testOptions.extraPath = null;
                testOptions.basePath = null;
                testOptions.gdprPath = null;
                testOptions.subscriptionPath = null;
                testOptions.useTestConnectionOptions = false;
                Adjust.teardown();
            }
            if ('test' === option) {
                this.savedEvents = null;
                this.savedConfigs = null;
                this.extraPath = null;
                testOptions.timerIntervalInMilliseconds = (-1).toString();
                testOptions.timerStartInMilliseconds = (-1).toString();
                testOptions.sessionIntervalInMilliseconds = (-1).toString();
                testOptions.subsessionIntervalInMilliseconds = (-1).toString();
            }
        }
    }

    console.log('[command_executor.js]: testOptions object created! testOptions = ' + JSON.stringify(testOptions));
    Adjust.setTestOptions(testOptions);
};

AdjustCommandExecutor.prototype.config = function(params) {
    var configNumber = 0;
    if (params['configName']) {
        var configName = getFirstParameterValue(params, 'configName');
        configNumber = parseInt(configName.substr(configName.length - 1))
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
        // SDK prefix not tested for non natives.
    }

    if (params['defaultTracker']) {
        var defaultTracker = getFirstParameterValue(params, 'defaultTracker');
        adjustConfig.setDefaultTracker(defaultTracker);
    }

    if (params['externalDeviceId']) {
        var externalDeviceId = getFirstParameterValue(params, 'externalDeviceId');
        
        // Special handling for null value case.
        if (externalDeviceId == 'null') {
            externalDeviceId = null;
        }

        adjustConfig.setExternalDeviceId(externalDeviceId);
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
        var strDelayStart = getFirstParameterValue(params, 'delayStart');
        var delayStart = parseFloat(strDelayStart);
        adjustConfig.setDelayStart(delayStart);
    }

    if (params['deviceKnown']) {
        var strDeviceKnown = getFirstParameterValue(params, 'deviceKnown');
        var deviceKnown = strDeviceKnown == 'true';
        adjustConfig.setDeviceKnown(deviceKnown);
    }

    if (params['eventBufferingEnabled']) {
        var strEventBuffering = getFirstParameterValue(params, 'eventBufferingEnabled');
        var eventBufferingEnabled = strEventBuffering == 'true';
        adjustConfig.setEventBufferingEnabled(eventBufferingEnabled);
    }

    if (params['sendInBackground']) {
        var strSendInBackground = getFirstParameterValue(params, 'sendInBackground');
        var sendInBackground = strSendInBackground == 'true';
        adjustConfig.setSendInBackground(sendInBackground);
    }

    if (params['allowiAdInfoReading']) {
        var allowiAdInfoReadingS = getFirstParameterValue(params, 'allowiAdInfoReading');
        var allowiAdInfoReading = allowiAdInfoReadingS == 'true';
        adjustConfig.setAllowiAdInfoReading(allowiAdInfoReading);
    }

    if (params['allowIdfaReading']) {
        var allowIdfaReadingS = getFirstParameterValue(params, 'allowIdfaReading');
        var allowIdfaReading = allowIdfaReadingS == 'true';
        adjustConfig.setAllowIdfaReading(allowIdfaReading);
    }

    if (params['userAgent']) {
        var userAgent = getFirstParameterValue(params, 'userAgent');
        adjustConfig.setUserAgent(userAgent);
    }

    if (params['attributionCallbackSendAll']) {
        var _this = this;
        adjustConfig.setAttributionCallback(function(attribution) {
            AdjustTest.addInfoToSend("trackerToken", attribution.trackerToken);
            AdjustTest.addInfoToSend("trackerName", attribution.trackerName);
            AdjustTest.addInfoToSend("network", attribution.network);
            AdjustTest.addInfoToSend("campaign", attribution.campaign);
            AdjustTest.addInfoToSend("adgroup", attribution.adgroup);
            AdjustTest.addInfoToSend("creative", attribution.creative);
            AdjustTest.addInfoToSend("clickLabel", attribution.clickLabel);
            AdjustTest.addInfoToSend("adid", attribution.adid);
            AdjustTest.sendInfoToServer(_this.basePath);
        });
    }

    if (params['sessionCallbackSendSuccess']) {
        var _this = this;
        adjustConfig.setSessionTrackingSuccessCallback(function(sessionSuccess) {
            AdjustTest.addInfoToSend("message", sessionSuccess.message);
            AdjustTest.addInfoToSend("timestamp", sessionSuccess.timestamp);
            AdjustTest.addInfoToSend("adid", sessionSuccess.adid);
            if (sessionSuccess.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", sessionSuccess.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(_this.basePath);
        });
    }

    if (params['sessionCallbackSendFailure']) {
        var _this = this;
        adjustConfig.setSessionTrackingFailureCallback(function(sessionFailed) {
            AdjustTest.addInfoToSend("message", sessionFailed.message);
            AdjustTest.addInfoToSend("timestamp", sessionFailed.timestamp);
            AdjustTest.addInfoToSend("adid", sessionFailed.adid);
            AdjustTest.addInfoToSend("willRetry", sessionFailed.willRetry);
            if (sessionFailed.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", sessionFailed.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(_this.basePath);
        });
    }

    if (params['eventCallbackSendSuccess']) {
        var _this = this;
        adjustConfig.setEventTrackingSuccessCallback(function(eventSuccess) {
            AdjustTest.addInfoToSend("message", eventSuccess.message);
            AdjustTest.addInfoToSend("timestamp", eventSuccess.timestamp);
            AdjustTest.addInfoToSend("adid", eventSuccess.adid);
            AdjustTest.addInfoToSend("eventToken", eventSuccess.eventToken);
            AdjustTest.addInfoToSend("callbackId", eventSuccess.callbackId);
            if (eventSuccess.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", eventSuccess.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(_this.basePath);
        });
    }

    if (params['eventCallbackSendFailure']) {
        var _this = this;
        adjustConfig.setEventTrackingFailureCallback(function(eventFailed) {
            AdjustTest.addInfoToSend("message", eventFailed.message);
            AdjustTest.addInfoToSend("timestamp", eventFailed.timestamp);
            AdjustTest.addInfoToSend("adid", eventFailed.adid);
            AdjustTest.addInfoToSend("eventToken", eventFailed.eventToken);
            AdjustTest.addInfoToSend("callbackId", eventFailed.callbackId);
            AdjustTest.addInfoToSend("willRetry", eventFailed.willRetry);
            if (eventFailed.jsonResponse != null) {
                AdjustTest.addInfoToSend("jsonResponse", eventFailed.jsonResponse.toString());
            }
            AdjustTest.sendInfoToServer(_this.basePath);
        });
    }

    if (params['deferredDeeplinkCallback']) {
        var _this = this;
        adjustConfig.setDeferredDeeplinkCallback(function(deeplink) {
            var openDeeplinkS = getFirstParameterValue(params, 'deferredDeeplinkCallback');
            var openDeeplink = openDeeplinkS == 'true';
            AdjustTest.sendInfoToServer(_this.basePath);
            if (openDeeplink === true) {
                Adjust.appWillOpenUrl(deeplink);
            }
        });
    }
};

AdjustCommandExecutor.prototype.start = function(params) {
    this.config(params);
    var configNumber = 0;
    if (params['configName']) {
        var configName = getFirstParameterValue(params, 'configName');
        configNumber = parseInt(configName.substr(configName.length - 1))
    }

    var adjustConfig = this.savedConfigs[configNumber];
    Adjust.start(adjustConfig);
    delete this.savedConfigs[0];
};

AdjustCommandExecutor.prototype.event = function(params) {
    var eventNumber = 0;
    if (params['eventName']) {
        var eventName = getFirstParameterValue(params, 'eventName');
        eventNumber = parseInt(eventName.substr(eventName.length - 1))
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
            var value = callbackParams[i+1];
            adjustEvent.addCallbackParameter(key, value);
        }
    }

    if (params['partnerParams']) {
        var partnerParams = getValueFromKey(params, 'partnerParams');
        for (var i = 0; i < partnerParams.length; i = i + 2) {
            var key = partnerParams[i];
            var value = partnerParams[i+1];
            adjustEvent.addPartnerParameter(key, value);
        }
    }

    if (params['orderId']) {
        var orderId = getFirstParameterValue(params, 'orderId');
        adjustEvent.setTransactionId(orderId);
    }

    if (params['callbackId']) {
        var callbackId = getFirstParameterValue(params, 'callbackId');
        adjustEvent.setCallbackId(callbackId);
    }
};

AdjustCommandExecutor.prototype.trackEvent = function(params) {
    this.event(params);
    var eventNumber = 0;
    if (params['eventName']) {
        var eventName = getFirstParameterValue(params, 'eventName');
        eventNumber = parseInt(eventName.substr(eventName.length - 1))
    }

    var adjustEvent = this.savedEvents[eventNumber];
    Adjust.trackEvent(adjustEvent);
    delete this.savedEvents[0];
};

AdjustCommandExecutor.prototype.disableThirdPartySharing = function(params) {
    Adjust.disableThirdPartySharing();
};

AdjustCommandExecutor.prototype.trackSubscription = function(params) {
    if (OS_IOS) {
        var price = getFirstParameterValue(params, 'revenue');
        var currency = getFirstParameterValue(params, 'currency');
        var transactionId = getFirstParameterValue(params, 'transactionId');
        var receipt = getFirstParameterValue(params, 'receipt');
        var transactionDate = getFirstParameterValue(params, 'transactionDate');
        var salesRegion = getFirstParameterValue(params, 'salesRegion');

        var subscription = new AdjustAppStoreSubscription(price, currency, transactionId, receipt);
        subscription.setTransactionDate(transactionDate);
        subscription.setSalesRegion(salesRegion);

        if (params['callbackParams']) {
            var callbackParams = getValueFromKey(params, 'callbackParams');
            for (var i = 0; i < callbackParams.length; i = i + 2) {
                var key = callbackParams[i];
                var value = callbackParams[i + 1];
                subscription.addCallbackParameter(key, value);
            }
        }

        if (params['partnerParams']) {
            var partnerParams = getValueFromKey(params, 'partnerParams');
            for (var i = 0; i < partnerParams.length; i = i + 2) {
                var key = partnerParams[i];
                var value = partnerParams[i + 1];
                subscription.addPartnerParameter(key, value);
            }
        }

        Adjust.trackAppStoreSubscription(subscription);
    } else if (OS_ANDROID) {
        var price = getFirstParameterValue(params, 'revenue');
        var currency = getFirstParameterValue(params, 'currency');
        var sku = getFirstParameterValue(params, 'productId');
        var signature = getFirstParameterValue(params, 'receipt');
        var purchaseToken = getFirstParameterValue(params, 'purchaseToken');
        var orderId = getFirstParameterValue(params, 'transactionId');
        var purchaseTime = getFirstParameterValue(params, 'transactionDate');

        var subscription = new AdjustPlayStoreSubscription(price, currency, sku, orderId, signature, purchaseToken);
        subscription.setPurchaseTime(purchaseTime);

        if (params['callbackParams']) {
            var callbackParams = getValueFromKey(params, 'callbackParams');
            for (var i = 0; i < callbackParams.length; i = i + 2) {
                var key = callbackParams[i];
                var value = callbackParams[i + 1];
                subscription.addCallbackParameter(key, value);
            }
        }

        if (params['partnerParams']) {
            var partnerParams = getValueFromKey(params, "partnerParams");
            for (var i = 0; i < partnerParams.length; i = i + 2) {
                var key = partnerParams[i];
                var value = partnerParams[i + 1];
                subscription.addPartnerParameter(key, value);
            }
        }

        Adjust.trackPlayStoreSubscription(subscription);
    }
};

AdjustCommandExecutor.prototype.trackAdRevenue = function(params) {
    var source = getFirstParameterValue(params, 'adRevenueSource');
    var payload = getFirstParameterValue(params, 'adRevenueJsonString');
    Adjust.trackAdRevenue(source, payload);
};

AdjustCommandExecutor.prototype.setReferrer = function(params) {
    var referrer = getFirstParameterValue(params, 'referrer');
    Adjust.setReferrer(referrer);
};

AdjustCommandExecutor.prototype.pause = function(params) {
    // Invoking onPause method with 1 parameter.
    // For testing purposes only.
    Adjust.onPause("test");
};

AdjustCommandExecutor.prototype.resume = function(params) {
    // Invoking onPause method with 1 parameter.
    // For testing purposes only.
    Adjust.onResume("test");
};

AdjustCommandExecutor.prototype.setEnabled = function(params) {
    var enabled = getFirstParameterValue(params, "enabled") == 'true';
    Adjust.setEnabled(enabled);
};

AdjustCommandExecutor.prototype.setOfflineMode = function(params) {
    var enabled = getFirstParameterValue(params, "enabled") == 'true';
    Adjust.setOfflineMode(enabled);
};

AdjustCommandExecutor.prototype.sendFirstPackages = function(params) {
    Adjust.sendFirstPackages();
};

AdjustCommandExecutor.prototype.gdprForgetMe = function(params) {
    Adjust.gdprForgetMe();
}

AdjustCommandExecutor.prototype.addSessionCallbackParameter = function(params) {
    var list = getValueFromKey(params, "KeyValue");
    for (var i = 0; i < list.length; i += 2){
        var key = list[i];
        var value = list[i+1];
        Adjust.addSessionCallbackParameter(key, value);
    }
};

AdjustCommandExecutor.prototype.addSessionPartnerParameter = function(params) {
    var list = getValueFromKey(params, "KeyValue");
    for (var i = 0; i < list.length; i += 2){
        var key = list[i];
        var value = list[i+1];
        Adjust.addSessionPartnerParameter(key, value);
    }
};

AdjustCommandExecutor.prototype.removeSessionCallbackParameter = function(params) {
    if ('key' in params) {
        var list = getValueFromKey(params, 'key');
        for (var i = 0; i < list.length; i += 1) {
            Adjust.removeSessionCallbackParameter(list[i]);
        }
    }
};

AdjustCommandExecutor.prototype.removeSessionPartnerParameter = function(params) {
    if ('key' in params) {
        var list = getValueFromKey(params, 'key');
        for (var i = 0; i < list.length; i += 1) {
            Adjust.removeSessionPartnerParameter(list[i]);
        }
    }
};

AdjustCommandExecutor.prototype.resetSessionCallbackParameters = function(params) {
    Adjust.resetSessionCallbackParameters();
};

AdjustCommandExecutor.prototype.resetSessionPartnerParameters = function(params) {
    Adjust.resetSessionPartnerParameters();
};

AdjustCommandExecutor.prototype.setPushToken = function(params) {
    var token = getFirstParameterValue(params, 'pushToken');
    Adjust.setPushToken(token);
};

AdjustCommandExecutor.prototype.openDeeplink = function(params) {
    var deeplink = getFirstParameterValue(params, "deeplink");
    Adjust.appWillOpenUrl(deeplink);
};

AdjustCommandExecutor.prototype.sendReferrer = function(params) {
    var referrer = getFirstParameterValue(params, 'referrer');
    Adjust.setReferrer(referrer);
};

// Utility methods
function getValueFromKey(params, key) {
    if (key in params) {
        return params[key];
    }
    return null;
}

function getFirstParameterValue(params, key) {
    if (key in params) {
        var param = params[key];
        if (param != null && param.length >= 1) {
            return param[0];
        }
    }
    return null;
}

module.exports = CommandExecutor;
