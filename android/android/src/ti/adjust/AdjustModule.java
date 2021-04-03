//
//  AdjustModule.java
//  Adjust SDK
//
//  Created by Uglješa Erceg (@ugi) on 18th May 2017.
//  Copyright © 2017-2020 Adjust GmbH. All rights reserved.
//

package ti.adjust;

import android.net.Uri;
import java.util.Map;
import java.util.HashMap;
// import javax.lang.model.type.NullType;
import org.json.JSONObject;
import org.json.JSONException;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.kroll.common.Log;
import org.appcelerator.kroll.runtime.v8.V8Function;
import com.adjust.sdk.*;

@Kroll.module(name="Adjust", id="ti.adjust")
public class AdjustModule extends KrollModule implements OnAttributionChangedListener,
                                                         OnEventTrackingSucceededListener,
                                                         OnEventTrackingFailedListener, 
                                                         OnSessionTrackingSucceededListener,
                                                         OnSessionTrackingFailedListener,
                                                         OnDeeplinkResponseListener {
    private static final String SDK_PREFIX = "titanium4.28.0";

    private static final String LCAT = "AdjustModule";
    private static final String KEY_REVENUE = "revenue";
    private static final String KEY_CURRENCY = "currency";
    private static final String KEY_APP_TOKEN = "appToken";
    private static final String KEY_LOG_LEVEL = "logLevel";
    private static final String KEY_SDK_PREFIX = "sdkPrefix";
    private static final String KEY_USER_AGENT = "userAgent";
    private static final String KEY_EVENT_TOKEN = "eventToken";
    private static final String KEY_CALLBACK_ID = "callbackId";
    private static final String KEY_DELAY_START = "delayStart";
    private static final String KEY_ENVIRONMENT = "environment";
    private static final String KEY_PROCESS_NAME = "processName";
    private static final String KEY_TRANSACTION_ID = "transactionId";
    private static final String KEY_DEFAULT_TRACKER = "defaultTracker";
    private static final String KEY_EXTERNAL_DEVICE_ID = "externalDeviceId";
    private static final String KEY_URL_STRATEGY = "urlStrategy";
    private static final String KEY_SEND_IN_BACKGROUND = "sendInBackground";
    private static final String KEY_PARTNER_PARAMETERS = "partnerParameters";
    private static final String KEY_CALLBACK_PARAMETERS = "callbackParameters";
    private static final String KEY_SHOULD_LAUNCH_DEEPLINK = "shouldLaunchDeeplink";
    private static final String KEY_EVENT_BUFFERING_ENABLED = "eventBufferingEnabled";
    private static final String KEY_SECRET_ID = "secretId";
    private static final String KEY_INFO_1 = "info1";
    private static final String KEY_INFO_2 = "info2";
    private static final String KEY_INFO_3 = "info3";
    private static final String KEY_INFO_4 = "info4";
    private static final String KEY_PRICE = "price";
    private static final String KEY_SKU = "sku";
    private static final String KEY_ORDER_ID = "orderId";
    private static final String KEY_SIGNATURE = "signature";
    private static final String KEY_PURCHASE_TOKEN = "purchaseToken";
    private static final String KEY_PURCHASE_TIME = "purchaseTime";
    private static final String KEY_SET_DEVICE_KNOWN = "isDeviceKnown";
    private static final String KEY_ATTRIBUTION_CALLBACK = "attributionCallback";
    private static final String KEY_SESSION_SUCCESS_CALLBACK = "sessionSuccessCallback";
    private static final String KEY_SESSION_FAILURE_CALLBACK = "sessionFailureCallback";
    private static final String KEY_EVENT_SUCCESS_CALLBACK = "eventSuccessCallback";
    private static final String KEY_EVENT_FAILURE_CALLBACK = "eventFailureCallback";
    private static final String KEY_DEFERRED_DEEPLINK_CALLBACK = "deferredDeeplinkCallback";
    private static final String KEY_TEST_HAS_CONTEXT = "hasContext";
    private static final String KEY_TEST_BASE_URL = "baseUrl";
    private static final String KEY_TEST_GDPR_URL = "gdprUrl";
    private static final String KEY_TEST_SUBSCRIPTION_URL = "subscriptionUrl";
    private static final String KEY_TEST_BASE_PATH = "basePath";
    private static final String KEY_TEST_GDPR_PATH = "gdprPath";
    private static final String KEY_TEST_SUBSCRIPTION_PATH = "subscriptionPath";
    private static final String KEY_TEST_TEST_CONNECTION_OPTIONS = "useTestConnectionOptions";
    private static final String KEY_TEST_TIMER_INTERVAL = "timerIntervalInMilliseconds";
    private static final String KEY_TEST_TIMER_START = "timerStartInMilliseconds";
    private static final String KEY_TEST_SESSION_INTERVAL = "sessionIntervalInMilliseconds";
    private static final String KEY_TEST_SUBSESSION_INTERVAL = "subsessionIntervalInMilliseconds";
    private static final String KEY_TEST_TRY_INSTALL_REFERRER = "tryInstallReferrer";
    private static final String KEY_TEST_NO_BACKOFF_WAIT = "noBackoffWait";
    private static final String KEY_TEST_TEARDOWN = "teardown";
    // private static final String KEY_READ_MOBILE_EQUIPMENT_IDENTITY = "readMobileEquipmentIdentity";

    private V8Function jsAttributionCallback = null;
    private V8Function jsSessionSuccessCallback = null;
    private V8Function jsSessionFailureCallback = null;
    private V8Function jsEventSuccessCallback = null;
    private V8Function jsEventFailureCallback = null;
    private V8Function jsDeferredDeeplinkCallback = null;
    private boolean shouldLaunchDeeplink = true;

    public AdjustModule() {
        super();
    }

    @Kroll.onAppCreate
    public static void onAppCreate(TiApplication app) {}

    @Kroll.method
    public void start(Object args) {
        String appToken = null;
        String environment = null;
        String logLevel = null;
        String sdkPrefix = null;
        String userAgent = null;
        String processName = null;
        String defaultTracker = null;
        String externalDeviceId = null;
        String urlStrategy = null;
        boolean sendInBackground = false;
        boolean isLogLevelSuppress = false;
        boolean eventBufferingEnabled = false;
        boolean isDeviceKnown = false;
        long secretId = -1L;
        long info1 = -1L;
        long info2 = -1L;
        long info3 = -1L;
        long info4 = -1L;
        double delayStart = 0.0;
        // boolean readMobileEquipmentIdentity = false;

        @SuppressWarnings("unchecked")
        HashMap<Object, Object> hmArgs = (HashMap<Object, Object>)args;
        if (hmArgs.containsKey(KEY_APP_TOKEN)) {
            if (null != hmArgs.get(KEY_APP_TOKEN)) {
                appToken = hmArgs.get(KEY_APP_TOKEN).toString();
            }
        }
        if (hmArgs.containsKey(KEY_ENVIRONMENT)) {
            if (null != hmArgs.get(KEY_ENVIRONMENT)) {
                environment = hmArgs.get(KEY_ENVIRONMENT).toString();
            }
        }
        if (hmArgs.containsKey(KEY_LOG_LEVEL)) {
            if (null != hmArgs.get(KEY_LOG_LEVEL)) {
                logLevel = hmArgs.get(KEY_LOG_LEVEL).toString();
            }
        }
        if (hmArgs.containsKey(KEY_USER_AGENT)) {
            if (null != hmArgs.get(KEY_USER_AGENT)) {
                userAgent = hmArgs.get(KEY_USER_AGENT).toString();
            }
        }
        if (hmArgs.containsKey(KEY_PROCESS_NAME)) {
            if (null != hmArgs.get(KEY_PROCESS_NAME)) {
                processName = hmArgs.get(KEY_PROCESS_NAME).toString();
            }
        }
        if (hmArgs.containsKey(KEY_DEFAULT_TRACKER)) {
            if (null != hmArgs.get(KEY_DEFAULT_TRACKER)) {
                defaultTracker = hmArgs.get(KEY_DEFAULT_TRACKER).toString();
            }
        }
        if (hmArgs.containsKey(KEY_EXTERNAL_DEVICE_ID)) {
            if (null != hmArgs.get(KEY_EXTERNAL_DEVICE_ID)) {
                externalDeviceId = hmArgs.get(KEY_EXTERNAL_DEVICE_ID).toString();
            }
        }
        if (hmArgs.containsKey(KEY_URL_STRATEGY)) {
            if (null != hmArgs.get(KEY_URL_STRATEGY)) {
                urlStrategy = hmArgs.get(KEY_URL_STRATEGY).toString();
            }
        }
        if (hmArgs.containsKey(KEY_DELAY_START)) {
            if (null != hmArgs.get(KEY_DELAY_START)) {
                String value = hmArgs.get(KEY_DELAY_START).toString();
                try {
                    delayStart = Double.parseDouble(value);
                } catch (NullPointerException e1) {
                    delayStart = 0.0;
                } catch (NumberFormatException e2) {
                    delayStart = 0.0;
                }
            }
        }
        if (hmArgs.containsKey(KEY_SECRET_ID)) {
            if (null != hmArgs.get(KEY_SECRET_ID)) {
                try {
                    secretId = Long.parseLong(hmArgs.get(KEY_SECRET_ID).toString(), 10);
                } catch(NumberFormatException ignored) {}
            }
        }
        if (hmArgs.containsKey(KEY_INFO_1)) {
            if (null != hmArgs.get(KEY_INFO_1)) {
                try {
                    info1 = Long.parseLong(hmArgs.get(KEY_INFO_1).toString(), 10);
                } catch(NumberFormatException ignored) {}
            }
        }
        if (hmArgs.containsKey(KEY_INFO_2)) {
            if (null != hmArgs.get(KEY_INFO_2)) {
                try {
                    info2 = Long.parseLong(hmArgs.get(KEY_INFO_2).toString(), 10);
                } catch(NumberFormatException ignored) {}
            }
        }
        if (hmArgs.containsKey(KEY_INFO_3)) {
            if (null != hmArgs.get(KEY_INFO_3)) {
                try {
                    info3 = Long.parseLong(hmArgs.get(KEY_INFO_3).toString(), 10);
                } catch(NumberFormatException ignored) {}
            }
        }
        if (hmArgs.containsKey(KEY_INFO_4)) {
            if (null != hmArgs.get(KEY_INFO_4)) {
                try {
                    info4 = Long.parseLong(hmArgs.get(KEY_INFO_4).toString(), 10);
                } catch(NumberFormatException ignored) {}
            }
        }
        if (hmArgs.containsKey(KEY_EVENT_BUFFERING_ENABLED)) {
            if (null != hmArgs.get(KEY_EVENT_BUFFERING_ENABLED)) {
                String value = hmArgs.get(KEY_EVENT_BUFFERING_ENABLED).toString();
                eventBufferingEnabled = Boolean.parseBoolean(value);
            } else {
                eventBufferingEnabled = false;
            }
        }
        if (hmArgs.containsKey(KEY_SEND_IN_BACKGROUND)) {
            if (null != hmArgs.get(KEY_SEND_IN_BACKGROUND)) {
                String value = hmArgs.get(KEY_SEND_IN_BACKGROUND).toString();
                sendInBackground = Boolean.parseBoolean(value);
            } else {
                sendInBackground = false;
            }
        }
        if (hmArgs.containsKey(KEY_SET_DEVICE_KNOWN)) {
            if (null != hmArgs.get(KEY_SET_DEVICE_KNOWN)) {
                String value = hmArgs.get(KEY_SET_DEVICE_KNOWN).toString();
                isDeviceKnown = Boolean.parseBoolean(value);
            } else {
                isDeviceKnown = false;
            }
        }
        // if (hmArgs.containsKey(KEY_READ_MOBILE_EQUIPMENT_IDENTITY)) {
        //     if (null != hmArgs.get(KEY_READ_MOBILE_EQUIPMENT_IDENTITY)) {
        //         String value = hmArgs.get(KEY_READ_MOBILE_EQUIPMENT_IDENTITY).toString();
        //         readMobileEquipmentIdentity = Boolean.parseBoolean(value);
        //     } else {
        //         readMobileEquipmentIdentity = false;
        //     }
        // }
        if (hmArgs.containsKey(KEY_SHOULD_LAUNCH_DEEPLINK)) {
            if (null != hmArgs.get(KEY_SHOULD_LAUNCH_DEEPLINK)) {
                String value = hmArgs.get(KEY_SHOULD_LAUNCH_DEEPLINK).toString();
                shouldLaunchDeeplink = Boolean.parseBoolean(value);
            } else {
                shouldLaunchDeeplink = false;
            }
        }
        if (hmArgs.containsKey(KEY_ATTRIBUTION_CALLBACK)) {
            if (null != hmArgs.get(KEY_ATTRIBUTION_CALLBACK)) {
                jsAttributionCallback = (V8Function)hmArgs.get(KEY_ATTRIBUTION_CALLBACK);
            }
        }
        if (hmArgs.containsKey(KEY_SESSION_SUCCESS_CALLBACK)) {
            if (null != hmArgs.get(KEY_SESSION_SUCCESS_CALLBACK)) {
                jsSessionSuccessCallback = (V8Function)hmArgs.get(KEY_SESSION_SUCCESS_CALLBACK);
            }
        }
        if (hmArgs.containsKey(KEY_SESSION_FAILURE_CALLBACK)) {
            if (null != hmArgs.get(KEY_SESSION_FAILURE_CALLBACK)) {
                jsSessionFailureCallback = (V8Function)hmArgs.get(KEY_SESSION_FAILURE_CALLBACK);
            }
        }
        if (hmArgs.containsKey(KEY_EVENT_SUCCESS_CALLBACK)) {
            if (null != hmArgs.get(KEY_EVENT_SUCCESS_CALLBACK)) {
                jsEventSuccessCallback = (V8Function)hmArgs.get(KEY_EVENT_SUCCESS_CALLBACK);
            }
        }
        if (hmArgs.containsKey(KEY_EVENT_FAILURE_CALLBACK)) {
            if (null != hmArgs.get(KEY_EVENT_FAILURE_CALLBACK)) {
                jsEventFailureCallback = (V8Function)hmArgs.get(KEY_EVENT_FAILURE_CALLBACK);
            }
        }
        if (hmArgs.containsKey(KEY_DEFERRED_DEEPLINK_CALLBACK)) {
            if (null != hmArgs.get(KEY_DEFERRED_DEEPLINK_CALLBACK)) {
                jsDeferredDeeplinkCallback = (V8Function)hmArgs.get(KEY_DEFERRED_DEEPLINK_CALLBACK);
            }
        }
        if (isFieldValid(logLevel)) {
            if (logLevel.equalsIgnoreCase("SUPPRESS")) {
                isLogLevelSuppress = true;
            }
        }

        AdjustConfig adjustConfig = new AdjustConfig(getActivity().getApplication(), appToken, environment, isLogLevelSuppress);
        if (!adjustConfig.isValid()) {
            return;
        }

        // SDK prefix.
        if (isFieldValid(SDK_PREFIX)) {
            adjustConfig.setSdkPrefix(SDK_PREFIX);
        }

        // Log level.
        if (isFieldValid(logLevel)) {
            if (logLevel.equalsIgnoreCase("VERBOSE")) {
                adjustConfig.setLogLevel(LogLevel.VERBOSE);
            } else if (logLevel.equalsIgnoreCase("DEBUG")) {
                adjustConfig.setLogLevel(LogLevel.DEBUG);
            } else if (logLevel.equalsIgnoreCase("INFO")) {
                adjustConfig.setLogLevel(LogLevel.INFO);
            } else if (logLevel.equalsIgnoreCase("WARN")) {
                adjustConfig.setLogLevel(LogLevel.WARN);
            } else if (logLevel.equalsIgnoreCase("ERROR")) {
                adjustConfig.setLogLevel(LogLevel.ERROR);
            } else if (logLevel.equalsIgnoreCase("ASSERT")) {
                adjustConfig.setLogLevel(LogLevel.ASSERT);
            } else if (logLevel.equalsIgnoreCase("SUPPRESS")) {
                adjustConfig.setLogLevel(LogLevel.SUPRESS);
            } else {
                adjustConfig.setLogLevel(LogLevel.INFO);
            }
        }

        // Event buffering.
        if (eventBufferingEnabled) {
            adjustConfig.setEventBufferingEnabled(eventBufferingEnabled);
        }

        // Background tracking.
        if (sendInBackground) {
            adjustConfig.setSendInBackground(sendInBackground);
        }

        // Main process name.
        if (isFieldValid(processName)) {
            adjustConfig.setProcessName(processName);
        }

        // Default tracker.
        if (isFieldValid(defaultTracker)) {
            adjustConfig.setDefaultTracker(defaultTracker);
        }

        // External device ID.
        if (isFieldValid(externalDeviceId)) {
            adjustConfig.setExternalDeviceId(externalDeviceId);
        }

        // URL strategy.
        if (isFieldValid(urlStrategy)) {
            if (urlStrategy.equalsIgnoreCase("china")) {
                adjustConfig.setUrlStrategy(AdjustConfig.URL_STRATEGY_CHINA);
            } else if (urlStrategy.equalsIgnoreCase("india")) {
                adjustConfig.setUrlStrategy(AdjustConfig.URL_STRATEGY_INDIA);
            }
        }

        // User agent.
        if (isFieldValid(userAgent)) {
            adjustConfig.setUserAgent(userAgent);
        }

        // Delay start.
        if (delayStart > 0) {
            adjustConfig.setDelayStart(delayStart);
        }

        // App secret.
        if (secretId != -1 && info1 != -1 && info2 != -1 && info3 != -1 && info4 != -1) {
            adjustConfig.setAppSecret(secretId, info1, info2, info3, info4);
        }

        // Is device known.
        if (isDeviceKnown) {
            adjustConfig.setDeviceKnown(isDeviceKnown);
        }

        // Deprecated.
        // Mobile equipment identity.
        // if (readMobileEquipmentIdentity) {
        //     adjustConfig.setReadMobileEquipmentIdentity(readMobileEquipmentIdentity);
        // }

        // Attribution callback.
        if (null != jsAttributionCallback) {
            adjustConfig.setOnAttributionChangedListener(this);
        }

        // Session success callback.
        if (null != jsSessionSuccessCallback) {
            adjustConfig.setOnSessionTrackingSucceededListener(this);
        }

        // Session failure callback.
        if (null != jsSessionFailureCallback) {
            adjustConfig.setOnSessionTrackingFailedListener(this);
        }

        // Event success callback.
        if (null != jsEventSuccessCallback) {
            adjustConfig.setOnEventTrackingSucceededListener(this);
        }

        // Event failure callback.
        if (null != jsEventFailureCallback) {
            adjustConfig.setOnEventTrackingFailedListener(this);
        }

        // Deferred deep link callback.
        if (null != jsDeferredDeeplinkCallback) {
            adjustConfig.setOnDeeplinkResponseListener(this);
        }

        // Start SDK.
        Adjust.onCreate(adjustConfig);
        Adjust.onResume();
    }

    @Kroll.method
    public void trackEvent(Object args) {
        String eventToken = null;
        String revenue = null;
        String currency = null;
        String transactionId = null;
        String callbackId = null;
        Map<String, String> callbackParameters = null;
        Map<String, String> partnerParameters = null;

        @SuppressWarnings("unchecked")
        HashMap<Object, Object> hmArgs = (HashMap<Object, Object>)args;
        if (hmArgs.containsKey(KEY_EVENT_TOKEN)) {
            if (null != hmArgs.get(KEY_EVENT_TOKEN)) {
                eventToken = hmArgs.get(KEY_EVENT_TOKEN).toString();
            }
        }
        if (hmArgs.containsKey(KEY_CURRENCY)) {
            if (null != hmArgs.get(KEY_CURRENCY)) {
                currency = hmArgs.get(KEY_CURRENCY).toString();
            }
        }
        if (hmArgs.containsKey(KEY_REVENUE)) {
            if (null != hmArgs.get(KEY_REVENUE)) {
                revenue = hmArgs.get(KEY_REVENUE).toString();
            }
        }
        if (hmArgs.containsKey(KEY_TRANSACTION_ID)) {
            if (null != hmArgs.get(KEY_TRANSACTION_ID)) {
                transactionId = hmArgs.get(KEY_TRANSACTION_ID).toString();
            }
        }
        if (hmArgs.containsKey(KEY_CALLBACK_ID)) {
            if (null != hmArgs.get(KEY_CALLBACK_ID)) {
                callbackId = hmArgs.get(KEY_CALLBACK_ID).toString();
            }
        }
        if (hmArgs.containsKey(KEY_CALLBACK_PARAMETERS)) {
            if (hmArgs.get(KEY_CALLBACK_PARAMETERS) != null) {
                callbackParameters = (Map<String, String>)hmArgs.get(KEY_CALLBACK_PARAMETERS);
            }
        }
        if (hmArgs.containsKey(KEY_PARTNER_PARAMETERS)) {
            if (hmArgs.get(KEY_PARTNER_PARAMETERS) != null) {
                partnerParameters = (Map<String, String>)hmArgs.get(KEY_PARTNER_PARAMETERS);
            }
        }

        AdjustEvent adjustEvent = new AdjustEvent(eventToken);
        if (!adjustEvent.isValid()) {
            return;
        }

        // Revenue and currency.
        if (isFieldValid(revenue) && isFieldValid(currency)) {
            try {
                double revenueValue = Double.parseDouble(revenue);
                adjustEvent.setRevenue(revenueValue, currency);
            } catch (NullPointerException e1) {
                // No revenue.
            } catch (NumberFormatException e2) {
                // No revenue.
            }
        }

        // Callback parameters.
        if (callbackParameters != null) {
            for (Map.Entry<String, String> entry : callbackParameters.entrySet()) {
                adjustEvent.addCallbackParameter(entry.getKey(), entry.getValue());
            }
        }

        // Partner parameters.
        if (partnerParameters != null) {
            for (Map.Entry<String, String> entry : partnerParameters.entrySet()) {
                adjustEvent.addPartnerParameter(entry.getKey(), entry.getValue());
            }
        }

        // Transaction ID.
        if (isFieldValid(transactionId)) {
            adjustEvent.setOrderId(transactionId);
        }

        // Callback ID.
        if (isFieldValid(callbackId)) {
            adjustEvent.setCallbackId(callbackId);
        }

        // Track event.
        Adjust.trackEvent(adjustEvent);
    }

    @Kroll.method
    public void trackAdRevenue(String source, String payload) {
        try {
            JSONObject jsonPayload = new JSONObject(payload);
            Adjust.trackAdRevenue(source, jsonPayload);
        } catch (JSONException err) {
             // "Given ad revenue payload is not a valid JSON string";
        }
    }

    @Kroll.method
    public void trackPlayStoreSubscription(Object args) {
        String price = null;
        String currency = null;
        String sku = null;
        String orderId = null;
        String signature = null;
        String purchaseToken = null;
        String purchaseTime = null;
        Map<String, String> callbackParameters = null;
        Map<String, String> partnerParameters = null;

        @SuppressWarnings("unchecked")
        HashMap<Object, Object> hmArgs = (HashMap<Object, Object>)args;
        if (hmArgs.containsKey(KEY_PRICE)) {
            if (null != hmArgs.get(KEY_PRICE)) {
                price = hmArgs.get(KEY_PRICE).toString();
            }
        }
        if (hmArgs.containsKey(KEY_CURRENCY)) {
            if (null != hmArgs.get(KEY_CURRENCY)) {
                currency = hmArgs.get(KEY_CURRENCY).toString();
            }
        }
        if (hmArgs.containsKey(KEY_SKU)) {
            if (null != hmArgs.get(KEY_SKU)) {
                sku = hmArgs.get(KEY_SKU).toString();
            }
        }
        if (hmArgs.containsKey(KEY_ORDER_ID)) {
            if (null != hmArgs.get(KEY_ORDER_ID)) {
                orderId = hmArgs.get(KEY_ORDER_ID).toString();
            }
        }
        if (hmArgs.containsKey(KEY_SIGNATURE)) {
            if (null != hmArgs.get(KEY_SIGNATURE)) {
                signature = hmArgs.get(KEY_SIGNATURE).toString();
            }
        }
        if (hmArgs.containsKey(KEY_PURCHASE_TOKEN)) {
            if (null != hmArgs.get(KEY_PURCHASE_TOKEN)) {
                purchaseToken = hmArgs.get(KEY_PURCHASE_TOKEN).toString();
            }
        }
        if (hmArgs.containsKey(KEY_PURCHASE_TIME)) {
            if (null != hmArgs.get(KEY_PURCHASE_TIME)) {
                purchaseTime = hmArgs.get(KEY_PURCHASE_TIME).toString();
            }
        }
        if (hmArgs.containsKey(KEY_CALLBACK_PARAMETERS)) {
            if (hmArgs.get(KEY_CALLBACK_PARAMETERS) != null) {
                callbackParameters = (Map<String, String>)hmArgs.get(KEY_CALLBACK_PARAMETERS);
            }
        }
        if (hmArgs.containsKey(KEY_PARTNER_PARAMETERS)) {
            if (hmArgs.get(KEY_PARTNER_PARAMETERS) != null) {
                partnerParameters = (Map<String, String>)hmArgs.get(KEY_PARTNER_PARAMETERS);
            }
        }

        // Convert price to long.
        long lPrice = -1;
        if (isFieldValid(price)) {
            try {
                lPrice = Long.parseLong(price);
            } catch (NumberFormatException ignore) {}
        }

        AdjustPlayStoreSubscription subscription = new AdjustPlayStoreSubscription(
                lPrice,
                currency,
                sku,
                orderId,
                signature,
                purchaseToken);

        // Convert purchase time to long.
        long lPurchaseTime = -1;
        if (isFieldValid(purchaseTime)) {
            try {
                lPurchaseTime = Long.parseLong(purchaseTime);
                subscription.setPurchaseTime(lPurchaseTime);
            } catch (NumberFormatException ignore) {}
        }

        // Callback parameters.
        if (callbackParameters != null) {
            for (Map.Entry<String, String> entry : callbackParameters.entrySet()) {
                subscription.addCallbackParameter(entry.getKey(), entry.getValue());
            }
        }

        // Partner parameters.
        if (partnerParameters != null) {
            for (Map.Entry<String, String> entry : partnerParameters.entrySet()) {
                subscription.addPartnerParameter(entry.getKey(), entry.getValue());
            }
        }

        // Track subscription.
        Adjust.trackPlayStoreSubscription(subscription);
    }

    @Kroll.method
    public void disableThirdPartySharing() {
        Adjust.disableThirdPartySharing(getActivity().getApplication());
    }

    @Kroll.method
    public void onResume() {
        Adjust.onResume();
    }

    @Kroll.method
    public void onPause() {
        Adjust.onPause();
    }

    @Kroll.method
    public void setEnabled(boolean isEnabled) {
        Adjust.setEnabled(isEnabled);
    }

    @Kroll.method
    public void isEnabled(V8Function callback) {
        Object[] answer = { Adjust.isEnabled() };
        callback.call(getKrollObject(), answer);
    }

    @Kroll.method
    public void setOfflineMode(boolean isEnabled) {
        Adjust.setOfflineMode(isEnabled);
    }

    @Kroll.method
    public void setPushToken(String pushToken) {
        Adjust.setPushToken(pushToken, getActivity().getApplication());
    }

    @Kroll.method
    public void appWillOpenUrl(String url) {
        Uri uri = Uri.parse(url);
        Adjust.appWillOpenUrl(uri, getActivity().getApplication());
    }

    @Kroll.method
    public void sendFirstPackages() {
        Adjust.sendFirstPackages();
    }

    @Kroll.method
    public void gdprForgetMe() {
        Adjust.gdprForgetMe(getActivity().getApplication());
    }

    @Kroll.method
    public void addSessionCallbackParameter(String key, String value) {
        Adjust.addSessionCallbackParameter(key, value);
    }

    @Kroll.method
    public void removeSessionCallbackParameter(String key) {
        Adjust.removeSessionCallbackParameter(key);
    }

    @Kroll.method
    public void resetSessionCallbackParameters() {
        Adjust.resetSessionCallbackParameters();
    }

    @Kroll.method
    public void addSessionPartnerParameter(String key, String value) {
        Adjust.addSessionPartnerParameter(key, value);
    }

    @Kroll.method
    public void removeSessionPartnerParameter(String key) {
        Adjust.removeSessionPartnerParameter(key);
    }

    @Kroll.method
    public void resetSessionPartnerParameters() {
        Adjust.resetSessionPartnerParameters();
    }

    @Kroll.method
    public void getAdid(V8Function callback) {
        Object[] answer = { Adjust.getAdid() };
        callback.call(getKrollObject(), answer);
    }

    @Kroll.method
    public void setReferrer(String referrer) {
        Adjust.setReferrer(referrer, getActivity().getApplication());
    }

    @Kroll.method
    public void getGoogleAdId(final V8Function callback) {
        Adjust.getGoogleAdId(getActivity().getApplication(), new OnDeviceIdsRead() { 
            @Override
            public void onGoogleAdIdRead(String gpsAdId) {
                Object[] answer = { gpsAdId };
                callback.call(getKrollObject(), answer);
            }
        });
    }

    @Kroll.method
    public void getAmazonAdId(V8Function callback) {
        Object[] answer = { Adjust.getAmazonAdId(getActivity().getApplication())};
        callback.call(getKrollObject(), answer);
    }

    @Kroll.method
    public void getAttribution(V8Function callback) {
        callback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.attributionToMap(Adjust.getAttribution()));
    }

    @Kroll.method
    public void getSdkVersion(V8Function callback) {
        Object[] answer = { SDK_PREFIX + "@" + Adjust.getSdkVersion() };
        callback.call(getKrollObject(), answer);
    }

    @Kroll.method
    public void getIdfa(V8Function callback) {
        // No idfa getter in Android.
        Object[] answer = { "" };
        callback.call(getKrollObject(), answer);
    }

    @Kroll.method
    public void requestTrackingAuthorizationWithCompletionHandler(V8Function callback) {
        // Mo authorization wrapper in Android.
        Object[] answer = { "" };
        callback.call(getKrollObject(), answer);
    }

    @Kroll.method
    public void trackAppStoreSubscription(Object args) {}

    // For testing purposes only.
    @Kroll.method
    public void teardown() {
        this.jsAttributionCallback = null;
        this.jsEventSuccessCallback = null;
        this.jsEventFailureCallback = null;
        this.jsSessionSuccessCallback = null;
        this.jsSessionFailureCallback = null;
        this.jsDeferredDeeplinkCallback = null;
    }

    // For testing purposes only.
    @Kroll.method
    public void setTestOptions(Object args) {
        if (args == null) {
            return;
        }

        final AdjustTestOptions testOptions = new AdjustTestOptions();

        @SuppressWarnings("unchecked")
        HashMap<Object, Object> hmArgs = (HashMap<Object, Object>)args;
        if (hmArgs.containsKey(KEY_TEST_HAS_CONTEXT)) {
            if (null != hmArgs.get(KEY_TEST_HAS_CONTEXT)) {
                boolean value = Boolean.parseBoolean(hmArgs.get(KEY_TEST_HAS_CONTEXT).toString());
                if (value) {
                    testOptions.context = getActivity().getApplication();
                }
            }
        }
        if (hmArgs.containsKey(KEY_TEST_BASE_URL)) {
            if (null != hmArgs.get(KEY_TEST_BASE_URL)) {
                String value = hmArgs.get(KEY_TEST_BASE_URL).toString();
                testOptions.baseUrl = value;
            }
        }
        if (hmArgs.containsKey(KEY_TEST_GDPR_URL)) {
            if (null != hmArgs.get(KEY_TEST_GDPR_URL)) {
                String value = hmArgs.get(KEY_TEST_GDPR_URL).toString();
                testOptions.gdprUrl = value;
            }
        }
        if (hmArgs.containsKey(KEY_TEST_BASE_PATH)) {
            if (null != hmArgs.get(KEY_TEST_BASE_PATH)) {
                String value = hmArgs.get(KEY_TEST_BASE_PATH).toString();
                testOptions.basePath = value;
            }
        }
        if (hmArgs.containsKey(KEY_TEST_GDPR_PATH)) {
            if (null != hmArgs.get(KEY_TEST_GDPR_PATH)) {
                String value = hmArgs.get(KEY_TEST_GDPR_PATH).toString();
                testOptions.gdprPath = value;
            }
        }
        // if (hmArgs.containsKey(KEY_TEST_TEST_CONNECTION_OPTIONS)) {
        //     if (null != hmArgs.get(KEY_TEST_TEST_CONNECTION_OPTIONS)) {
        //         boolean value = Boolean.parseBoolean(hmArgs.get(KEY_TEST_TEST_CONNECTION_OPTIONS).toString());
        //         testOptions.useTestConnectionOptions = value;
        //     }
        // }
        if (hmArgs.containsKey(KEY_TEST_TIMER_INTERVAL)) {
            if (null != hmArgs.get(KEY_TEST_TIMER_INTERVAL)) {
                try {
                    Long value = Long.parseLong(hmArgs.get(KEY_TEST_TIMER_INTERVAL).toString());
                    testOptions.timerIntervalInMilliseconds = value;
                } catch (NumberFormatException ex) {
                    ex.printStackTrace();
                }
            }
        }
        if (hmArgs.containsKey(KEY_TEST_TIMER_START)) {
            if (null != hmArgs.get(KEY_TEST_TIMER_START)) {
                try {
                    Long value = Long.parseLong(hmArgs.get(KEY_TEST_TIMER_START).toString());
                    testOptions.timerStartInMilliseconds = value;
                } catch (NumberFormatException ex) {
                    ex.printStackTrace();
                }
            }
        }
        if (hmArgs.containsKey(KEY_TEST_SESSION_INTERVAL)) {
            if (null != hmArgs.get(KEY_TEST_SESSION_INTERVAL)) {
                try {
                    Long value = Long.parseLong(hmArgs.get(KEY_TEST_SESSION_INTERVAL).toString());
                    testOptions.sessionIntervalInMilliseconds = value;
                } catch (NumberFormatException ex) {
                    ex.printStackTrace();
                }
            }
        }
        if (hmArgs.containsKey(KEY_TEST_SUBSESSION_INTERVAL)) {
            if (null != hmArgs.get(KEY_TEST_SUBSESSION_INTERVAL)) {
                try {
                    Long value = Long.parseLong(hmArgs.get(KEY_TEST_SUBSESSION_INTERVAL).toString());
                    testOptions.subsessionIntervalInMilliseconds = value;
                } catch (NumberFormatException ex) {
                    ex.printStackTrace();
                }
            }
        }
        if (hmArgs.containsKey(KEY_TEST_NO_BACKOFF_WAIT)) {
            if (null != hmArgs.get(KEY_TEST_NO_BACKOFF_WAIT)) {
                boolean value = Boolean.parseBoolean(hmArgs.get(KEY_TEST_NO_BACKOFF_WAIT).toString());
                testOptions.noBackoffWait = value;
            }
        }
        if (hmArgs.containsKey(KEY_TEST_TRY_INSTALL_REFERRER)) {
            if (null != hmArgs.get(KEY_TEST_TRY_INSTALL_REFERRER)) {
                boolean value = Boolean.parseBoolean(hmArgs.get(KEY_TEST_TRY_INSTALL_REFERRER).toString());
                testOptions.tryInstallReferrer = value;
            } else {
                testOptions.tryInstallReferrer = false;
            }
        }
        if (hmArgs.containsKey(KEY_TEST_TEARDOWN)) {
            if (null != hmArgs.get(KEY_TEST_TEARDOWN)) {
                boolean value = Boolean.parseBoolean(hmArgs.get(KEY_TEST_TEARDOWN).toString());
                testOptions.teardown = value;
            }
        }

        Adjust.setTestOptions(testOptions);
    }
    
    @Override
    public void onAttributionChanged(AdjustAttribution attribution) {
        jsAttributionCallback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.attributionToMap(attribution));
    }

    @Override
    public void onFinishedEventTrackingSucceeded(AdjustEventSuccess event) {
        jsEventSuccessCallback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.eventSuccessToMap(event));
    }

    @Override
    public void onFinishedEventTrackingFailed(AdjustEventFailure event) {
        jsEventFailureCallback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.eventFailureToMap(event));
    }

    @Override
    public void onFinishedSessionTrackingSucceeded(AdjustSessionSuccess session) {
        jsSessionSuccessCallback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.sessionSuccessToMap(session));
    }

    @Override
    public void onFinishedSessionTrackingFailed(AdjustSessionFailure session) {
        jsSessionFailureCallback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.sessionFailureToMap(session));
    }

    @Override
    public boolean launchReceivedDeeplink(Uri uri) {
        jsDeferredDeeplinkCallback.call(getKrollObject(), (HashMap<String, String>)AdjustUtil.deferredDeeplinkToMap(uri));
        return this.shouldLaunchDeeplink;
    }

    private boolean isFieldValid(String field) {
        if (null != field) {
            if (!field.equals("")) {
                return true;
            }
        }
        return false;
    }
}
