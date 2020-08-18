//
//  AdjustUtil.java
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 18th May 2017.
//  Copyright © 2017-2019 Adjust GmbH. All rights reserved.
//

package ti.adjust;

import java.util.Map;
import android.net.Uri;
import java.util.HashMap;
import com.adjust.sdk.*;

final class AdjustUtil {
    private static final String ATTRIBUTION_TRACKER_TOKEN = "trackerToken";
    private static final String ATTRIBUTION_TRACKER_NAME = "trackerName";
    private static final String ATTRIBUTION_NETWORK = "network";
    private static final String ATTRIBUTION_CAMPAIGN = "campaign";
    private static final String ATTRIBUTION_ADGROUP = "adgroup";
    private static final String ATTRIBUTION_CREATIVE = "creative";
    private static final String ATTRIBUTION_CLICK_LABEL = "clickLabel";
    private static final String ATTRIBUTION_ADID = "adid";

    private static final String EVENT_SUCCESS_MESSAGE = "message";
    private static final String EVENT_SUCCESS_TIMESTAMP = "timestamp";
    private static final String EVENT_SUCCESS_ADID = "adid";
    private static final String EVENT_SUCCESS_EVENT_TOKEN = "eventToken";
    private static final String EVENT_SUCCESS_CALLBACK_ID = "callbackId";
    private static final String EVENT_SUCCESS_JSON_RESPONSE = "jsonResponse";

    private static final String EVENT_FAILURE_MESSAGE = "message";
    private static final String EVENT_FAILURE_TIMESTAMP = "timestamp";
    private static final String EVENT_FAILURE_ADID = "adid";
    private static final String EVENT_FAILURE_EVENT_TOKEN = "eventToken";
    private static final String EVENT_FAILURE_CALLBACK_ID = "callbackId";
    private static final String EVENT_FAILURE_WILL_RETRY = "willRetry";
    private static final String EVENT_FAILURE_JSON_RESPONSE = "jsonResponse";

    private static final String SESSION_SUCCESS_MESSAGE = "message";
    private static final String SESSION_SUCCESS_TIMESTAMP = "timestamp";
    private static final String SESSION_SUCCESS_ADID = "adid";
    private static final String SESSION_SUCCESS_JSON_RESPONSE = "jsonResponse";

    private static final String SESSION_FAILURE_MESSAGE = "message";
    private static final String SESSION_FAILURE_TIMESTAMP = "timestamp";
    private static final String SESSION_FAILURE_ADID = "adid";
    private static final String SESSION_FAILURE_WILL_RETRY = "willRetry";
    private static final String SESSION_FAILURE_JSON_RESPONSE = "jsonResponse";

    private static final String DEEPLINK_URI = "uri";

    public static Map<String, String> attributionToMap(AdjustAttribution attribution) {
        HashMap<String, String> map = new HashMap<String, String>();
        if (null == attribution) {
            return map;
        }

        map.put(ATTRIBUTION_TRACKER_TOKEN, null != attribution.trackerToken ? attribution.trackerToken : "");
        map.put(ATTRIBUTION_TRACKER_NAME, null != attribution.trackerName ? attribution.trackerName : "");
        map.put(ATTRIBUTION_NETWORK, null != attribution.network ? attribution.network : "");
        map.put(ATTRIBUTION_CAMPAIGN, null != attribution.campaign ? attribution.campaign : "");
        map.put(ATTRIBUTION_ADGROUP, null != attribution.adgroup ? attribution.adgroup : "");
        map.put(ATTRIBUTION_CREATIVE, null != attribution.creative ? attribution.creative : "");
        map.put(ATTRIBUTION_CLICK_LABEL, null != attribution.clickLabel ? attribution.clickLabel : "");
        map.put(ATTRIBUTION_ADID, null != attribution.adid ? attribution.adid : "");
        return map;
    }

    public static Map<String, String> eventSuccessToMap(AdjustEventSuccess eventSuccess) {
        HashMap<String, String> map = new HashMap<String, String>();
        if (null == eventSuccess) {
            return map;
        }

        map.put(EVENT_SUCCESS_MESSAGE, null != eventSuccess.message ? eventSuccess.message : "");
        map.put(EVENT_SUCCESS_TIMESTAMP, null != eventSuccess.timestamp ? eventSuccess.timestamp : "");
        map.put(EVENT_SUCCESS_ADID, null != eventSuccess.adid ? eventSuccess.adid : "");
        map.put(EVENT_SUCCESS_EVENT_TOKEN, null != eventSuccess.eventToken ? eventSuccess.eventToken : "");
        map.put(EVENT_SUCCESS_CALLBACK_ID, null != eventSuccess.callbackId ? eventSuccess.callbackId : "");
        map.put(EVENT_SUCCESS_JSON_RESPONSE, null != eventSuccess.jsonResponse ? eventSuccess.jsonResponse.toString() : "");
        return map;
    }

    public static Map<String, String> eventFailureToMap(AdjustEventFailure eventFailure) {
        HashMap<String, String> map = new HashMap<String, String>();
        if (null == eventFailure) {
            return map;
        }

        map.put(EVENT_FAILURE_MESSAGE, null != eventFailure.message ? eventFailure.message : "");
        map.put(EVENT_FAILURE_TIMESTAMP, null != eventFailure.timestamp ? eventFailure.timestamp : "");
        map.put(EVENT_FAILURE_ADID, null != eventFailure.adid ? eventFailure.adid : "");
        map.put(EVENT_FAILURE_EVENT_TOKEN, null != eventFailure.eventToken ? eventFailure.eventToken : "");
        map.put(EVENT_FAILURE_WILL_RETRY, eventFailure.willRetry ? "true" : "false");
        map.put(EVENT_FAILURE_CALLBACK_ID, null != eventFailure.callbackId ? eventFailure.callbackId : "");
        map.put(EVENT_FAILURE_JSON_RESPONSE, null != eventFailure.jsonResponse ? eventFailure.jsonResponse.toString() : "");
        return map;
    }

    public static Map<String, String> sessionSuccessToMap(AdjustSessionSuccess sessionSuccess) {
        HashMap<String, String> map = new HashMap<String, String>();
        if (null == sessionSuccess) {
            return map;
        }

        map.put(SESSION_SUCCESS_MESSAGE, null != sessionSuccess.message ? sessionSuccess.message : "");
        map.put(SESSION_SUCCESS_TIMESTAMP, null != sessionSuccess.timestamp ? sessionSuccess.timestamp : "");
        map.put(SESSION_SUCCESS_ADID, null != sessionSuccess.adid ? sessionSuccess.adid : "");
        map.put(SESSION_SUCCESS_JSON_RESPONSE, null != sessionSuccess.jsonResponse ? sessionSuccess.jsonResponse.toString() : "");
        return map;
    }

    public static Map<String, String> sessionFailureToMap(AdjustSessionFailure sessionFailure) {
        HashMap<String, String> map = new HashMap<String, String>();
        if (null == sessionFailure) {
            return map;
        }

        map.put(SESSION_FAILURE_MESSAGE, null != sessionFailure.message ? sessionFailure.message : "");
        map.put(SESSION_FAILURE_TIMESTAMP, null != sessionFailure.timestamp ? sessionFailure.timestamp : "");
        map.put(SESSION_FAILURE_ADID, null != sessionFailure.adid ? sessionFailure.adid : "");
        map.put(SESSION_FAILURE_WILL_RETRY, sessionFailure.willRetry ? "true" : "false");
        map.put(SESSION_FAILURE_JSON_RESPONSE, null != sessionFailure.jsonResponse ? sessionFailure.jsonResponse.toString() : "");
        return map;
    }

    public static Map<String, String> deferredDeeplinkToMap(Uri uri) {
        HashMap<String, String> map = new HashMap<String, String>();
        if (null == uri) {
            return map;
        }

        map.put(DEEPLINK_URI, uri.toString());
        return map;
    }
}
