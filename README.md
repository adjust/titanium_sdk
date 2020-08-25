## Summary

This is the Titanium SDK of Adjust™. You can read more about Adjust™ at [adjust.com].

## Table of contents

* [Example app](#example-app)
* [Basic integration](#basic-integration)
   * [Get the SDK](#sdk-get)
   * [Add the SDK to your project](#sdk-add)
   * [Integrate the SDK into your app](#sdk-integrate)
      * [Session tracking on Android](#sdk-android-session-tracking)
   * [Adjust logging](#sdk-logging)
   * [Adjust project settings](#adjust-project-settings)
      * [Android permissions](#android-permissions)
      * [Google Play Services](#android-gps)
      * [Proguard settings](#android-proguard)
      * [Install referrer](#android-referrer)
         * [Google Play Referrer API](#android-referrer-gpr-api)
         * [Google Play Store intent](#android-referrer-gps-intent)
      * [iOS frameworks](#ios-frameworks)
* [Additional features](#additional-features)
   * [Event tracking](#event-tracking)
      * [Revenue tracking](#revenue-tracking)
      * [Revenue deduplication](#revenue-deduplication)
      * [Callback parameters](#callback-parameters)
      * [Partner parameters](#partner-parameters)
      * [Callback identifier](#callback-id)
   * [Session parameters](#session-parameters)
      * [Session callback parameters](#session-callback-parameters)
      * [Session partner parameters](#session-partner-parameters)
      * [Delay start](#delay-start)
   * [Attribution callback](#attribution-callback)
   * [Session and event callbacks](#session-event-callbacks)
   * [Disable tracking](#disable-tracking)
   * [Offline mode](#offline-mode)
   * [Event buffering](#event-buffering)
   * [GDPR right to be forgotten](#gdpr-forget-me)
   * [SDK signature](#sdk-signature)
   * [Background tracking](#background-tracking)
   * [Device IDs](#device-ids)
      * [iOS advertising identifier](#di-idfa)
      * [Google Play Services advertising identifier](#di-gps-adid)
      * [Amazon advertising identifier](#di-fire-adid)
      * [Adjust device identifier](#di-adid)
   * [User attribution](#user-attribution)
   * [Push token](#push-token)
   * [Pre-installed trackers](#pre-installed-trackers)
   * [Deeplinking](#deeplinking)
      * [Standard deeplinking scenario](#deeplinking-standard)
      * [Deeplinking on iOS 8 and earlier](#deeplinking-ios-old)
      * [Deeplinking on iOS 9 and later](#deeplinking-ios-new)
      * [Deeplinking on Android](#deeplinking-android)
      * [Deferred deeplinking scenario](#deeplinking-deferred)
      * [Reattribution via deeplinks](#deeplinking-reattribution)
* [Troubleshooting](#troubleshooting)
   * [I'm seeing the "The Google Play services resources were not found" error](#ts-gps-resources-not-found)
* [License](#license)


## <a id="example-app"></a>Example app

There is example inside the [`example` directory][example]. In there you can check how to integrate the Adjust SDK into your app. The example app was built in `Appcelerator Studio` as an `Alloy Mobile App Project`.

## <a id="basic-integration"></a>Basic integration

These are the essential steps required to integrate the Adjust SDK into your Appcelerator Titanium app project.

### <a id="sdk-get"></a>Get the SDK

You can get the latest version of the Adjust SDK modules from our [releases page][releases].

### <a id="sdk-add"></a>Add the SDK to your project

Add the Adjust SDK to the Titanium SDK installed on your machine. Then, add it to your app by opening your `tiapp.xml` file in Appcelerator Studio and adding a `ti.adjust` module in the `Modules` section.

After adding the Adjust SDK module, you should see the following in your `tiapp.xml` source code:

```xml
<modules>
    <!-- ... -->
    <module platform="android">ti.adjust</module>
    <module platform="iphone">ti.adjust</module>
    <!-- ... -->
</modules>
```

In addition to the Titanium module, we have created two additional JavaScript classes, which can also be found on the [releases page][releases], to help you while using the Adjust SDK:

- `adjust_config.js`
- `adjust_event.js`

Make sure to add these two JavaScript files to your app as well. In order to be able to use these two classes the way they will be used in code examples in this README, please add the following lines anywhere you want to use instances of these two classes:

```js
var AdjustEvent = require('adjust_event');
var AdjustConfig = require('adjust_config');
```

**Note**: With each SDK update, please make sure that you **update these two files as well**.

### <a id="sdk-integrate"></a>Integrate the SDK into your app

You should initialize the Adjust SDK **as soon as possible** within your application, pretty much upon app launch. Run the initialization code once per app launch: there's no need to place this code where it will be executed multiple times per app life cycle, since the Adjust SDK exists in your app as a static instance. In order to initialize the Adjust SDK in your app, please do the following:

```js
var adjustConfig = new AdjustConfig("{YourAppToken}", AdjustConfig.EnvironmentSandbox);

Adjust.start(adjustConfig);
```

Replace `{YourAppToken}` with your app token. You can find this in your [dashboard].

Depending on whether you are building your app for testing or for production, you need to set `environment` with one of these values:

```javascript
AdjustConfig.EnvironmentSandbox
AdjustConfig.EnvironmentProduction
```

**Important:** This value should be set to `AdjustConfig.EnvironmentSandbox` if and only if you or someone else is testing your app. Make sure to set the environment to `AdjustConfig.EnvironmentProduction` before you publish the app. Set it back to `AdjustConfig.EnvironmentSandbox` when you start developing and testing it again.

We use this environment to distinguish between real traffic and test traffic from test devices. It is imperative that you keep this value meaningful at all times.

### <a id="sdk-android-session-tracking"></a>Session tracking on Android

When integrating the Adjust SDK into your app, you need to perform one additional and **vital step** related to enabling proper session tracking on the Android platform. After your app starts in the Android environment, you should subscribe to get notifications whenever your app moves to the background or comes to the foreground. In these moments, you need to add calls to `Adjust.onResume()` (when your app comes to foreground) and `Adjust.onPause()` (when your app moves to background).

Feel free to subscribe to these events however you like, but it is crucial that you do so in a proper way, otherwise session tracking might be affected. In our example app we do it in the following way:

```js
Ti.App.addEventListener('resumed', function(e) {
    Adjust.onResume();
});

Ti.App.addEventListener('paused', function(e) {
    Adjust.onPause();
});
```

For additional information about this approach, please check the `benCoding.Android.Tools` module GitHub page.

### <a id="sdk-logging"></a>Adjust logging

You can increase or decrease the amount of logs you see in tests by calling `setLogLevel` on your `AdjustConfig` instance with one of the following parameters:

```js
adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);   // enable all logging
adjustConfig.setLogLevel(AdjustConfig.LogLevelDebug);     // enable more logging
adjustConfig.setLogLevel(AdjustConfig.LogLevelInfo);      // default
adjustConfig.setLogLevel(AdjustConfig.LogLevelWarn);      // disable info logging
adjustConfig.setLogLevel(AdjustConfig.LogLevelError);     // disable warnings as well
adjustConfig.setLogLevel(AdjustConfig.LogLevelAssert);    // disable errors as well
adjustConfig.setLogLevel(AdjustConfig.LogLevelSuppress);  // disable all logging
```

### <a id="adjust-project-settings"></a>Adjust project settings

Once the Adjust SDK has been added to your app, certain tweaks are performed so that the Adjust SDK can work properly. Below you can find a description of every additional thing that the Adjust SDK performs after you've added it to your app.

### <a id="android-permissions"></a>Android permissions

The Adjust SDK adds by default certain permissions to your Android manifest file. You can find these in the `timodule.xml` file of the Adjust SDK Android module:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE" />

    <!-- ... -->
</manifest>
```

- `INTERNET` permission is what our SDK might need at any point of time.
- `ACCESS_WIFI_STATE` permission is what our SDK needs in case your app is `not targeting` the Google Play Store and `doesn't use` Google Play Services. If you are targeting the Google Play Store and you are using Google Play Services, the Adjust SDK doesn't need this permission and, if you don't need it anywhere else in your app, you can remove it.
- `ACCESS_NETWORK_STATE` permission is what our SDK needs to read `MMC` and `MNC` information.
- `BIND_GET_INSTALL_REFERRER_SERVICE` permission is needed so that new Google referrer API can be utilized.

### <a id="android-gps"></a>Google Play Services

Since August 1, 2014, apps in the Google Play Store must use the [Google advertising ID][google-ad-id] to uniquely identify each device. To allow the Adjust SDK to use the Google advertising ID, you must integrate [Google Play Services][google-play-services].

Google Play Services can be added to your app as part of official Titanium Google Play Services module. You can add it to your ap by adding following dependency to your `tiapp.xml` modules section:

```xml
  <modules>
    <!- ... ->
    <module platform="android">ti.playservices</module>
    <!- ... ->
</modules>
```

To check whether the analytics part of the Google Play Services library has been successfully added to your app, you should start your app by configuring the SDK to run in `sandbox` mode and set the log level to `verbose`. After that, track a session or some events in your app and observe the list of parameters in the verbose logs which are being read once the session or event has been tracked. If you see a parameter called `gps_adid` in there, you have successfully added the analytics part of the Google Play Services library to your app and our SDK is reading the necessary information from it.

### <a id="android-proguard"></a>Proguard settings

If you are using Proguard, add these lines to your Proguard file:

```
-keep public class com.adjust.sdk.** { *; }
-keep class com.google.android.gms.common.ConnectionResult {
    int SUCCESS;
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient {
    com.google.android.gms.ads.identifier.AdvertisingIdClient$Info getAdvertisingIdInfo(android.content.Context);
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info {
    java.lang.String getId();
    boolean isLimitAdTrackingEnabled();
}
-keep public class com.android.installreferrer.** { *; }
```

### <a id="android-referrer"></a>Install referrer

In order to correctly attribute an install of your Android app to its source, Adjust needs information about the **install referrer**. This can be obtained by using the **Google Play Referrer API** or by catching the **Google Play Store intent** with a broadcast receiver.

**Important**: The Google Play Referrer API is newly introduced by Google with the express purpose of providing a more reliable and secure way of obtaining install referrer information and to aid attribution providers in the fight against click injection. It is **strongly advised** that you support this in your application. The Google Play Store intent is a less secure way of obtaining install referrer information. It will continue to exist in parallel with the new Google Play Referrer API temporarily, but it is set to be deprecated in future.

#### <a id="android-referrer-gpr-api"></a>Google Play Referrer API

Adjust SDK adds Google's Play Referrer API and the necessary permissions to your app by default.

This feature is supported if you are using the **Adjust SDK v4.12.0 or above**.

#### <a id="android-referrer-gps-intent"></a>Google Play Store intent

The Adjust install referrer broadcast receiver is added to your app by default. For more information, you can check our native [Android SDK README][broadcast-receiver]. You can find this setting in the `timodule.xml` file of the Adjust SDK Android module:

```xml
<manifest>
    <!-- ... -->
    <application>
        <receiver
            android:name="com.adjust.sdk.AdjustReferrerReceiver"
            android:permission="android.permission.INSTALL_PACKAGES"
            android:exported="true">
            <intent-filter>
                <action android:name="com.android.vending.INSTALL_REFERRER" />
            </intent-filter>
        </receiver>
        <!-- ... -->
    </application>
</manifest>
```

Please bear in mind that, if you are using your own broadcast receiver which handles the `INSTALL_REFERRER` intent, you don't need the Adjust broadcast receiver to be added to your manifest file. You can remove it, but, inside your own receiver, add the call to the Adjust broadcast receiver as described in our [Android guide][broadcast-receiver-custom].

### <a id="ios-frameworks"></a>iOS frameworks

The Adjust SDK iOS module adds three iOS frameworks to your generated Xcode project:

* `iAd.framework` - In case you are running iAd campaigns.
* `AdSupport.framework` - For reading the iOS advertising ID (IDFA).
* `CoreTelephony.framework` - For reading MMC and MNC information.
* `AdjustSdk.framework` - Our native iOS SDK framework.

In order to support some features from the `AdjustSdk.framework`, our iOS module will also add an `-ObjC` flag to the `Other Linker Flags` setting in your Xcode project.

Another setting we add is for the `Framework Search Paths` value of the iOS Xcode project, which says where to look for `AdjustSdk.framework` when building your app, since it's not a default iOS framework.

Settings for this can also be found in the `module.xcconfig` file of the Adjust SDK iOS module:

```
FRAMEWORK_SEARCH_PATHS=$(SRCROOT)/../../modules/iphone/ti.adjust/4.17.0/platform "~/Library/Application Support/Titanium/modules/iphone/ti.adjust/4.17.0/platform"
OTHER_LDFLAGS=$(inherited) -framework AdSupport -framework iAd -framework -framework CoreTelephony AdjustSdk -ObjC
```

If you are not running any iAd campaigns, you can feel free to remove the `iAd.framework` dependency.

## <a id="additional-features"></a>Additional features

You can take advantage of the following features once you have integrated the Adjust SDK into your project.

### <a id="event-tracking"></a>Event tracking

You can use Adjust to track all kinds of events. Let's say you want to track every tap on a button. If you create a new event token in your [dashboard] - let's say that event token is `abc123` - you can add the following line in your button’s click handler method to track the click:

```js
var adjustEvent = new AdjustEvent("abc123");
Adjust.trackEvent(adjustEvent);
```

### <a id="revenue-tracking"></a>Revenue tracking

If your users can generate revenue by tapping on advertisements or making in-app purchases, then you can track that revenue with events. Let's say a tap is worth €0.01. You could track the revenue event like this:

```js
var adjustEvent = new AdjustEvent("abc123");
adjustEvent.setRevenue(0.01, "EUR");
Adjust.trackEvent(adjustEvent);
```

When you set a currency token, Adjust will automatically convert the incoming revenue into a reporting revenue of your choice. Read more about [currency conversion here][currency-conversion].


### <a id="revenue-deduplication"></a>Revenue deduplication

You can also add an optional transaction ID to avoid tracking duplicate revenue. The last ten transaction IDs are remembered, and revenue events with duplicate transaction IDs are skipped. This is especially useful for in-app purchase tracking. You can see an example below.

If you want to track in-app purchases, please make sure to call `trackEvent` only when the transaction is completed and an item is purchased. That way you can avoid tracking revenue that is not actually being generated.

```js
var adjustEvent = new AdjustEvent("abc123");
adjustEvent.setRevenue(0.01, "EUR");
adjustEvent.setTransactionId("{YourTransactionId}");
Adjust.trackEvent(adjustEvent);
```

**Note**: Transaction ID is the iOS term. The unique identifier for completed Android in-app purchases is **Order ID**.

### <a id="callback-parameters"></a>Callback parameters

You can register a callback URL for an event in your [dashboard][dashboard], and we will send a GET request to that URL whenever the event is tracked. You can also put some key-value pairs in an object and pass them to the `trackEvent` method. We will then append these named parameters to your callback URL.

For example, suppose you have registered the URL `http://www.adjust.com/callback` for your event with event token `abc123` and execute the following lines:

```js
var adjustEvent = new AdjustEvent("abc123");
adjustEvent.addCallbackParameter("key", "value");
adjustEvent.addCallbackParameter("foo", "bar");
Adjust.trackEvent(adjustEvent);
```

In that case, we would track the event and send a request to:

```
http://www.adjust.com/callback?key=value&foo=bar
```

It should be mentioned that we support a variety of placeholders, like `{idfa}` for iOS or `{gps_adid}` for Android, that can be used as parameter values.  In the resulting callback, the `{idfa}` placeholder would be replaced with the ID for advertisers of the current device for iOS and the `{gps_adid}` would be replaced with the Google advertising ID of the current device for Android. Also note that we don't store any of your custom parameters, but only append them to your callbacks. If you haven't registered a callback for an event, these parameters won't even be read.

You can read more about using URL callbacks, including a full list of available values, in our [callbacks guide][callbacks-guide].

### <a id="partner-parameters"></a>Partner parameters

Similarly to the callback parameters mentioned above, you can also add parameters that Adjust will transmit to network partners of your choice. You can activate these networks in your Adjust Dashboard.

These work similarly to the callback parameters mentioned above but can be added by calling the `addPartnerParameter` method on your `AdjustEvent` instance.

```js
var adjustEvent = new AdjustEvent("abc123");
adjustEvent.addPartnerParameter("key", "value");
adjustEvent.addPartnerParameter("foo", "bar");
Adjust.trackEvent(adjustEvent);
```

You can read more about special partners and networks in our [guide to special partners][special-partners].

### <a id="callback-id"></a>Callback identifier

You can also add custom string identifier to each event you want to track. This identifier will later be reported in event success and/or event failure callbacks to enable you to keep track on which event was successfully tracked or not. You can set this identifier by calling the `setCallbackId` method on your `AdjustEvent` instance:

```js
var adjustEvent = new AdjustEvent("abc123");
adjustEvent.setCallbackId("Your-Custom-Id");
Adjust.trackEvent(adjustEvent);
```

### <a id="session-parameters"></a>Session parameters

Some parameters are saved to be sent with every event and session of the Adjust SDK. Once you have added any of these parameters, you don't need to add them every time, since they will be saved locally. If you add the same parameter twice, there will be no effect.

These session parameters can be called before the Adjust SDK is launched to make sure they are sent even on install. If you need to send them with an install but can only obtain the needed values after launch, it's possible to [delay](#delay-start) the first launch of the Adjust SDK to allow for this behavior.

### <a id="session-callback-parameters"></a>Session callback parameters

The same callback parameters that are registered for [events](#callback-parameters) can also be saved to be sent with every event or session of the Adjust SDK.

Session callback parameters have a similar interface to event callback parameters. Except that, instead of adding the key and its value to an event, they are added through a call to the `addSessionCallbackParameter` method of the `Adjust` instance:

```js
Adjust.addSessionCallbackParameter("foo", "bar");
```

Session callback parameters will be merged with the callback parameters added to an event. The callback parameters added to an event take precedence over the session callback parameters. This means that, when adding a callback parameter to an event with the same key as one added from the session, the callback parameter added to the event will prevail.

It's possible to remove a specific session callback parameter by passing the desired key to the `removeSessionCallbackParameter` method of the `Adjust` instance:

```js
Adjust.removeSessionCallbackParameter("foo");
```

If you wish to remove all keys and values from the session callback parameters, you can reset them with the `resetSessionCallbackParameters` method of the `Adjust` instance:

```js
Adjust.resetSessionCallbackParameters();
```

### <a id="session-partner-parameters"></a>Session partner parameters

In the same way that there are [session callback parameters](#session-callback-parameters) that are sent with every event or session of the Adjust SDK, there are also session partner parameters.

These will be transmitted to network partners that you have integrated and activated in your Adjust [dashboard].

Session partner parameters have a similar interface to event partner parameters. Except that, instead of adding the key and its value to an event, they are added through a call to the `addSessionPartnerParameter` method of the `Adjust` instance:

```js
Adjust.addSessionPartnerParameter("foo", "bar");
```

The session partner parameters will be merged with the partner parameters added to an event. The partner parameters added to an event take precedence over the session partner parameters. This means that, when adding a partner parameter to an event with the same key as one added from the session, the partner parameter added to the event will prevail.

It's possible to remove a specific session partner parameter by passing the desired key to the `removeSessionPartnerParameter` method of the `Adjust` instance:

```js
Adjust.removeSessionPartnerParameter("foo");
```

If you wish to remove all keys and values from the session partner parameters, you can reset them with the `resetSessionPartnerParameters` method of the `Adjust` instance:

```js
Adjust.resetSessionPartnerParameters();
```

### <a id="delay-start"></a>Delay start

Delaying the start of the Adjust SDK allows your app some time to obtain session parameters, such as unique identifiers, to be sent on install.

Set the initial delay time, in seconds, with the `setDelayStart` field of the `AdjustConfig` instance:

```js
adjustConfig.setDelayStart(5.5);
```

In this case, the Adjust SDK not send the initial install session and any events created for 5.5 seconds. Once this time has elapsed, or if you call `sendFirstPackages()` of the `Adjust` instance in the meantime, every session parameter will be added to the delayed install session and events and the Adjust SDK will resume as usual.

**The maximum start time delay of the Adjust SDK is 10 seconds**.

### <a id="attribution-callback"></a>Attribution callback

You can register a listener to be notified of tracker attribution changes. Due to the different sources considered for attribution, this information cannot be provided synchronously. The simplest way to achieve this is to create a single anonymous listener which is going to be called **each time a user's attribution value changes**. Use the `AdjustConfig` instance, before starting the SDK, attribution callback method:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setAttributionCallback(function(attribution) {
    // Printing all attribution properties.
    Ti.API.info("Attribution changed!");
    Ti.API.info("Tracker token = " + attribution.trackerToken);
    Ti.API.info("Tracker name = " + attribution.trackerName);
    Ti.API.info("Network = " + attribution.network);
    Ti.API.info("Campaign = " + attribution.campaign);
    Ti.API.info("Adgroup = " + attribution.adgroup);
    Ti.API.info("Creative = " + attribution.creative);
    Ti.API.info("Click label = " + attribution.clickLabel);
    Ti.API.info("Adid = " + attribution.adid);
});

Adjust.start(adjustConfig);
```

Within the listener function you have access to the `attribution` parameters. Here is a quick summary of their properties:

- `trackerToken`    the tracker token of the current attribution
- `trackerName`     the tracker name of the current attribution
- `network`         the network grouping level of the current attribution
- `campaign`        the campaign grouping level of the current attribution
- `adgroup`         the ad group grouping level of the current attribution
- `creative`        the creative grouping level of the current attribution
- `clickLabel`      the click label of the current attribution
- `adid`            the Adjust device identifier

Please make sure to consider our [applicable attribution data policies][attribution-data].

### <a id="session-event-callbacks"></a>Session and event callbacks

You can register a callback to be notified of successfully tracked and failed events and/or sessions.

Follow the same steps as for attribution callbacks to implement the following callback function for successfully tracked events:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setEventTrackingSuccessCallback(function(eventSuccess) {
    // Printing all event success properties.
    Ti.API.info("Event tracking succeeded!");
    Ti.API.info("Message: " + eventSuccess.message);
    Ti.API.info("Timestamp: " + eventSuccess.timestamp);
    Ti.API.info("Adid: " + eventSuccess.adid);
    Ti.API.info("Event token: " + eventSuccess.eventToken);
    Ti.API.info("Callback Id: " + eventSuccess.callbackId);
    Ti.API.info("JSON response: " + eventSuccess.jsonResponse);
});

Adjust.start(adjustConfig);
```

The following callback function for failed events:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setEventTrackingFailureCallback(function(eventFailure) {
    // Printing all event failure properties.
    Ti.API.info("Event tracking failed!");
    Ti.API.info("Message: " + eventFailure.message);
    Ti.API.info("Timestamp: " + eventFailure.timestamp);
    Ti.API.info("Adid: " + eventFailure.adid);
    Ti.API.info("Event token: " + eventFailure.eventToken);
    Ti.API.info("Callback Id: " + eventFailure.callbackId);
    Ti.API.info("Will retry: " + eventFailure.willRetry);
    Ti.API.info("JSON response: " + eventFailure.jsonResponse);
});

Adjust.start(adjustConfig);
```

For successfully tracked sessions:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setSessionTrackingSuccessCallback(function(sessionSuccess) {
    // Printing all session success properties.
    Ti.API.info("Session tracking succeeded!");
    Ti.API.info("Message: " + sessionSuccess.message);
    Ti.API.info("Timestamp: " + sessionSuccess.timestamp);
    Ti.API.info("Adid: " + sessionSuccess.adid);
    Ti.API.info("JSON response: " + sessionSuccess.jsonResponse);
});

Adjust.start(adjustConfig);
```

And for failed sessions:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setSessionTrackingFailureCallback(function(sessionFailure) {
    // Printing all session failure properties.
    Ti.API.info("Session tracking failed!");
    Ti.API.info("Message: " + sessionFailure.message);
    Ti.API.info("Timestamp: " + sessionFailure.timestamp);
    Ti.API.info("Adid: " + sessionFailure.adid);
    Ti.API.info("Will retry: " + sessionFailure.willRetry);
    Ti.API.info("JSON response: " + sessionFailure.jsonResponse);
});

Adjust.start(adjustConfig);
```

The callback functions will be called after the SDK tries to send a package to the server. Within the callback you have access to a response data object specifically for the callback. Here is a quick summary of the session response data properties:

- `var message` the message from the server or the error logged by the SDK
- `var timestamp` timestamp from the server
- `var adid` a unique device identifier provided by Adjust
- `var jsonResponse` the JSON object with the response from the server

Both event response data objects contain:

- `var eventToken` the event token, if the package tracked was an event
- `var callbackId` the custom defined callback ID set on event object.

And both event and session failed objects also contain:

- `var willRetry` indicates there will be an attempt to resend the package at a later time

### <a id="disable-tracking"></a>Disable tracking

You can disable the Adjust SDK from tracking by invoking the `setEnabled` method of the `Adjust` instance with the enabled parameter set to `false`. This setting is **remembered between sessions**, but it can only be activated after the first session.

```js
Adjust.setEnabled(false);
```

You can verify if the Adjust SDK is currently active with the `isEnabled` method of the `Adjust` instance. It is always possible to activate the Adjust SDK by invoking the `setEnabled` with the parameter set to `true`.

### <a id="offline-mode"></a>Offline mode

You can put the Adjust SDK in offline mode to suspend transmissions to our servers while retaining tracked data to be sent later. When in offline mode, all information is saved in a file, so it is best not to trigger too many events.

You can activate offline mode by calling the `setOfflineMode` method of the `Adjust` instance with `true`.

```js
Adjust.setOfflineMode(true);
```

Conversely, you can deactivate offline mode by calling `setOfflineMode` with`false`. When the Adjust SDK is put back in online mode, all saved information is sent to our servers with the correct time information.

Unlike disabling tracking, **this setting is not remembered** between sessions. This means that the SDK is in online mode whenever it is started, even if the app was terminated in offline mode.

### <a id="event-buffering"></a>Event buffering

If your app makes heavy use of event tracking, you might want to delay some HTTP requests in order to send them in one batch every minute. You can enable event buffering with your `AdjustConfig` instance by calling the `setEventBufferingEnabled` method:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setEventBufferingEnabled(true);

Adjust.start(adjustConfig);
```

### <a id="gdpr-forget-me"></a>GDPR right to be forgotten

In accordance with article 17 of the EU's General Data Protection Regulation (GDPR), you can notify Adjust when a user has exercised their right to be forgotten. Calling the following method will instruct the Adjust SDK to communicate the user's choice to be forgotten to the Adjust backend:

```js
Adjust.gdprForgetMe();
```

Upon receiving this information, Adjust will erase the user's data and the Adjust SDK will stop tracking the user. No requests from this device will be sent to Adjust in the future.

### <a id="sdk-signature"></a>SDK signature

An account manager must activate the Adjust SDK signature. Contact Adjust support (support@adjust.com) if you are interested in using this feature.

If the SDK signature has already been enabled on your account and you have access to App Secrets in your Adjust Dashboard, please use the method below to integrate the SDK signature into your app.

An App Secret is set by passing all secret parameters (`secretId`, `info1`, `info2`, `info3`, `info4`) to `setAppSecret` method of `AdjustConfig` instance:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setAppSecret(secretId, info1, info2, info3, info4);

Adjust.create(adjustConfig);
```

### <a id="background-tracking"></a>Background tracking

The default behavior of the Adjust SDK is to **pause sending HTTP requests while the app is in the background**. You can change this in your `AdjustConfig` instance by calling the `setSendInBackground` method:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setSendInBackground(true);

Adjust.start(adjustConfig);
```

If nothing is set here, sending in background is **disabled by default**.

### <a id="device-ids"></a>Device IDs

Certain services (such as Google Analytics) require you to coordinate device and client IDs in order to prevent duplicate reporting.

### <a id="di-idfa"></a>iOS Advertising Identifier

To obtain the IDFA, call the `getIdfa` method of the `Adjust` instance. You need to pass a callback to that method in order to obtain the value:

```js
Adjust.getIdfa(function(idfa) {
    // Use idfa value.
});
```


### <a id="di-gps-adid"></a>Google Play Services advertising identifier

If you need to obtain the Google advertising ID, you can call the `getGoogleAdId` method of the `Adjust` instance. You need to pass a callback to that method in order to obtain the value:

```js
Adjust.getGoogleAdId(function(googleAdId) {
    // Use googleAdId value.
});
```

Inside the callback method you will have access to the Google advertising ID through the `googleAdId` variable.

### <a id="di-fire-adid"></a>Amazon advertising identifier

If you need to obtain the Amazon advertising ID, you can call the `getAmazonAdId` method on `Adjust` instance:

```js
Adjust.getAmazonAdId(function(amazonAdId) {
    // Use amazonAdId value.
});
```

### <a id="di-adid"></a>Adjust device identifier

For every device with your app installed on it, the Adjust backend generates a unique **Adjust device identifier** (**adid**). In order to obtain this identifier, call the `getAdid` method of the `Adjust` instance. You need to pass a callback to that method in order to obtain the value:

```js
Adjust.getAdid(function(adid) {
    // Use adid value.
});
```

**Note**: Information about the **adid** is only available after an app installation has been tracked by the Adjust backend. From that moment on, the Adjust SDK has information about the device **adid** and you can access it with this method. So, **it is not possible** to access the **adid** value before the SDK has been initialized and installation of your app has been successfully tracked.

### <a id="user-attribution"></a>User attribution

As described in the [attribution callback section](#attribution-callback), this callback is triggered to provide you with information about a new attribution whenever it changes. If you want to access information about a user's current attribution at any other time, you can make a call to the `getAttribution` method of the `Adjust` instance:

```js
Adjust.getAttribution(function(attribution) {
    // Use attribution object in same way like in attribution callback.
});
```

**Note**: Information about current attribution is only available after an app installation has been tracked by the Adjust backend and the attribution callback has been triggered. From that moment on, the Adjust SDK has information about a user's attribution and you can access it with this method. So, **it is not possible** to access a user's attribution value before the SDK has been initialized and an attribution callback has been triggered.

### <a id="push-token"></a>Push token

To send us the push notification token, add the following call to Adjust **whenever you get your token in the app or when it gets updated**:

```js
Adjust.setPushToken("YourPushNotificationToken");
```

Push tokens are used for Audience Builder and client callbacks, and they are required for the upcoming uninstall tracking feature.

### <a id="pre-installed-trackers"></a>Pre-installed trackers

If you want to use the Adjust SDK to recognize users whose devices came with your app pre-installed, follow these steps.

1. Create a new tracker in your [dashboard].
2. Open your app delegate and add set the default tracker of your `AdjustConfig` instance:

    ```js
    var adjustConfig = new AdjustConfig(appToken, environment);

    adjustConfig.setDefaultTracker("{TrackerToken}");

    Adjust.start(adjustConfig);
    ```

  Replace `{TrackerToken}` with the tracker token you created in step 1. Please note that the dashboard displays a tracker URL (including `http://app.adjust.com/`). In your source code, you should specify only the six-character token and not the entire URL.

3. Build and run your app. You should see a line like the following in the app's log output:

    ```
    Default tracker: 'abc123'
    ```

### <a id="deeplinking"></a>Deeplinking

If you are using the Adjust tracker URL with an option to deep link into your app from the URL, there is the possibility to get information about the deeplink URL and its content. There are two scenarios when it comes to deeplinking: standard and deferred:

- Standard deeplinking is when a user already has your app installed.
- Deferred deeplinking is when a user does not have your app installed.

### <a id="deeplinking-standard"></a>Standard deeplinking

Standard deeplinking is a platform-specific feature and in order to support it you need to add some additional settings to your app. If your user already has the app installed and hits the tracker URL with deeplink information in it, your application will be opened and the content of the deep link will be sent to your app so that you can parse it and decide what to do next.

**Note for iOS**: With the introduction of iOS 9, Apple has changed the way deeplinking is handled in the app. Depending on which deeplinking scenario you want to use for your app (or if you want to use them both to support a wide range of devices), you need to set up your app to handle one or both of the following scenarios.

### <a id="deeplinking-ios-old"></a>Deeplinking on iOS 8 and earlier

To support deeplink handling in your app for iOS 8 and earlier versions, you need to set a `Custom URL Scheme` setting for your iOS app.

You can do this by editing your app's `tiapp.xml` file. Locate the `<ios></ios>` section inside of its `<plist></plist>` section. It is a dictionary (it contains a `<dict></dict>` section) to which you need to add the following at the end of items list:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>app.bundle.id</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>your-scheme</string>
        </array>
    </dict>
</array>
```

Of course, you should replace the dummy values from our example above:

- `app.bundle.id` should be your actual app bundle identifier.
- `your-scheme` should be the custom URL scheme of your choice which you want your app to handle.

After completing this, you have successfully added the handling of your chosen scheme by your app, and from this moment on, if a user clicks on a link that starts with `your-scheme://`, the user's device will open your app if it has it installed.

In order to obtain information about the link that caused your app to open, you need to add some additional code. If your app is running in the iOS environment, you need to subscribe to the `resumed` event in order to obtain content from the link that opened your app. That can be done like this:

```js
if (OS_IOS) {
    Ti.App.addEventListener('resumed', function() {
		    var args = Ti.App.getArguments();

		    if (args.url) {
			      Ti.API.info("URL = " + args.url);
		    }
	  });
}
```

The value of `args.url` represents an actual link that opened your iOS app.

By completing this, you should be able to handle direct deeplinking on **iOS 8 and earlier**.

### <a id="deeplinking-ios-new"></a>Deeplinking on iOS 9 and later

Starting from **iOS 9**, Apple has introduced suppressed support for the old style deeplinking with custom URL schemes, as described above, in favor of `universal links`. If you want to support deeplinking in your app for iOS 9 and higher, you need to add support for universal link handling.

The first thing you need to do is to enable universal links for your app in the Adjust dashboard. Instructions on how to do that can be found in our native iOS SDK [README][enable-ulinks].

**Note**: You can disregard any information in the README that states that you need to have a domain and website or you need to upload a file to the root of your domain: Adjust is taking care of this for you, and you can skip this chapter of the README.

Enabling universal link handling in an iOS Titanium app is a bit trickier than adding support for custom URL scheme, because it contains some extra steps.

After you have built your app for iOS, go to the `build/iphone` folder of your app's root folder. In there, you will find a file named `<YOUR_APP_NAME>.entitlements` which is autogenerated in the background by the `xcode-build` tool once you build your iOS app in Appcelerator Studio. Take this file and copy it to the `platform/ios` folder inside of your app's root folder. If this folder doesn't exist, feel free to add it. Open this file with a text editor, and you will notice that it has an XML structure where `plist` is the root element which contains `dict`. At the end of the dictionary items list, you need to add the universal link content which you generated in the Adjust dashboard. The part that you need to add looks like this:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:abcd.adj.st</string>
</array>
```

This is just an example, instead of `abcd.adj.st`, you should enter the universal link value from the dashboard.

Once done, your entitlements file should look something like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- ... -->
    <key>com.apple.developer.associated-domains</key>
    <array>
		    <string>applinks:abcd.adj.st</string>
    </array>
</dict>
</plist>
```

After completing this, you have successfully added support for handling Adjust universal links by your app and from this moment on, if a user clicks on a link that starts with `https://abcd.adj.st/`, the user's device will open your app if it is installed.

In order to obtain information about the link that caused your app to open, you need to add some additional code. If your app is running in the iOS environment, you need to subscribe to the `continueactivity` event in order to obtain content from the link that opened your app. That can be done like this:

```js
if (OS_IOS) {
    Ti.App.iOS.addEventListener('continueactivity', function(e) {
        if (e.activityType === "NSUserActivityTypeBrowsingWeb"){
            var deeplink = e.webpageURL;

            if (deeplink) {
                Ti.API.info("URL = " + deeplink);
            }
        }
    });
}
```

The value of the `deeplink` variable in the example above represents the actual link that opened your iOS app.

By completing this, you should be able to handle direct deeplinking on **iOS 9 and later**.


### <a id="deeplinking-android"></a>Deeplinking on Android

In order to support deeplinking on your Android app, you need to add support for handling the custom URL scheme that you want to use to open your Android app.

You can do this by editing your app's `tiapp.xml` file. In this file's `<android></android>` section, you need to ensure that certain modifications are made to your main app activity (or to the activity that you would like to be launched once your app is opened via a link with a custom URL scheme) via the resulting manifest file.

**Note**: In our example app, the name of the main activity is `AdjustexampleActivity`, so in the example code below this will be used.

You need to assign a custom URL scheme to the activity of your choice by adding `intent-filter` to it. Once added, your `<android></android>` section inside of the `tiapp.xml` file will look something like this:

```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- keep any custom attributes for manifest -->
    <manifest>
        <!-- keep any custom attributes for application -->
        <application>
            <activity android:name=".AdjustexampleActivity"
                      android:label="@string/app_name"
                      android:theme="@style/Theme.Titanium"
                      android:configChanges="keyboardHidden|orientation|screenSize">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN"/>
                    <category android:name="android.intent.category.LAUNCHER"/>
                </intent-filter>
                <intent-filter>
                    <data android:scheme="your-scheme" />
                    <action android:name="android.intent.action.VIEW" />
                    <category android:name="android.intent.category.DEFAULT" />
                    <category android:name="android.intent.category.BROWSABLE" />
                </intent-filter>
            </activity>
        </application>
    </manifest>
    <!-- other android stuff -->
</android>
```

Of course, you should replace certain values from our example above:

- `AdjustexampleActivity` should be your actual activity name.
- `your-scheme` should be the custom URL scheme of your choice which you want your app to handle

After completing this, you have successfully added handling of your custom scheme by your app, and from this moment on, if a user clicks on a link that starts with `your-scheme://`, the user's device will open your app if it is installed.

In order to obtain information about the link that caused your app to open, you need to add some additional code. If your app is running in the Android environment, you need to extract `data` from `intent` each time your app gets opened:

```js
if (OS_ANDROID) {
    var activity = Ti.Android.currentActivity;
    var url = activity.getIntent().getData();
}
```

The value of the `url` variable in the above example (if not `null`) represents the actual link that opened your Android app.

By completing this, you should be able to handle direct deeplinking on **Android**.

### <a id="deeplinking-deferred"></a>Deferred deeplinking

While deferred deeplinking is not supported out of the box on Android or iOS, the Adjust SDK makes it possible.

In order to get information about the URL content through deferred deeplinking, you should set a callback method on the the `AdjustConfig` object which will receive one parameter where the content of the URL will be delivered. You should set this method on the config object by calling the `setDeferredDeeplinkCallback` method:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setDeferredDeeplinkCallback(function(deeplink) {
    Ti.API.info("Deferred deep link URL content: " + deeplink);
});

Adjust.start(adjustConfig);
```

In deferred deeplinking, there is one additional setting available on the `AdjustConfig` object. Once the Adjust SDK gets the deferred deeplink information, you can choose whether our SDK opens this URL or not. You can choose to set this option by calling the `setShouldLaunchDeeplink` method on the config object:


```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setShouldLaunchDeeplink(true);
// or adjustConfig.setShouldLaunchDeeplink(false);

adjustConfig.setDeferredDeeplinkCallback(function(deeplink) {
    Ti.API.info("Deferred deep link URL content: " + deeplink);
});

Adjust.start(adjustConfig);
```

If nothing is set here, **the Adjust SDK will always try to launch the URL by default**.

### <a id="deeplinking-reattribution"></a>Reattribution via deeplinks

Adjust enables you to run re-engagement campaigns by using deeplinks. For more information on this, please check our [official docs][reattribution-with-deeplinks].

If you are using this feature, in order for your users to be properly reattributed, you need to make one additional call to the Adjust SDK in your app.

Once you have received information about the deeplink content in your app, add a call to the `appWillOpenUrl` method of the `Adjust` instance. By making this call, the Adjust SDK will try to find if there is any new attribution information inside of the deeplink, and, if there is any, it will be sent to the Adjust backend. If a user should be reattributed through a click on an Adjust tracker URL with deeplink content in it, you will see the [attribution callback](#attribution-callback) in your app being triggered with new attribution information for this user.

In the code examples described above, a call to the `appWillOpenUrl` method should be done like this:

```js
if (OS_IOS) {
    Ti.App.addEventListener('resumed', function() {
        var args = Ti.App.getArguments();

        if (args.url) {
            Adjust.appWillOpenUrl(args.url);
        }
    });
}
```

```js
if (OS_IOS) {
    Ti.App.iOS.addEventListener('continueactivity', function(e) {
        if (e.activityType === "NSUserActivityTypeBrowsingWeb"){
            var deeplink = e.webpageURL;

            if (deeplink) {
                Adjust.appWillOpenUrl(deeplink);
            }
        }
    });
}
```

```js
if (OS_ANDROID) {
    var activity = Ti.Android.currentActivity;
    var url = activity.getIntent().getData();

    if (url) {
        Adjust.appWillOpenUrl(url);
    }
}
```

Having added these calls, if the deeplink that opened your app contains any reattribution parameters, our SDK will pass that information to the backend, which will decide whether the user is going to be reattributed or not. As already mentioned, if a user gets reattributed, an attribution callback (if implemented) will be triggered with the new attribution value, and you will have this information in your app as well.

## <a id="troubleshooting"></a>Troubleshooting

### <a id="ts-gps-resources-not-found"></a>I'm seeing the "The Google Play services resources were not found" error

You might notice an error message in your Appcelerator Studio Console output originating from the Google Play Services library saying the following:

```
[ERROR] :  GooglePlayServicesUtil: The Google Play services resources were not found. Check your project configuration to ensure that the resources are included.
```

Even though this message indicates that the Google Play Services resources couldn't be found, nothing is actually wrong and the version number from these resources is being read correctly. The reason for this message being printed is unknown.

For reference: [Stackoverflow discussion](https://stackoverflow.com/questions/18068627/logcat-message-the-google-play-services-resources-were-not-found-check-your-pr)

If you see that the `gps_adid` parameter is being successfully sent with SDK packages from your Android app, it is completely safe to ignore this error message.

## <a id="license"></a>License

The Adjust SDK is licensed under the MIT License.

Copyright (c) 2012-2019 Adjust GmbH, http://www.adjust.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[dashboard]:    http://adjust.com
[adjust.com]:   http://adjust.com

[example]:      ./example
[releases]:     https://github.com/adjust/titanium_sdk/releases

[google-ad-id]:         https://developer.android.com/google/play-services/id.html
[enable-ulinks]:        https://github.com/adjust/ios_sdk#deeplinking-setup-new
[event-tracking]:       https://docs.adjust.com/en/event-tracking
[callbacks-guide]:      https://docs.adjust.com/en/callbacks
[attribution-data]:     https://github.com/adjust/sdks/blob/master/doc/attribution-data.md
[special-partners]:     https://docs.adjust.com/en/special-partners
[broadcast-receiver]:   https://github.com/adjust/android_sdk#gps-intent

[google-launch-modes]:    http://developer.android.com/guide/topics/manifest/activity-element.html#lmode
[currency-conversion]:    https://docs.adjust.com/en/event-tracking/#tracking-purchases-in-different-currencies
[google-play-services]:   http://developer.android.com/google/play-services/index.html

[bencooding-android-tools]: 	https://github.com/benbahrenburg/benCoding.Android.Tools
[broadcast-receiver-custom]:    https://github.com/adjust/android_sdk/blob/master/doc/english/referrer.md
[reattribution-with-deeplinks]: https://docs.adjust.com/en/deeplinking/#manually-appending-attribution-data-to-a-deep-link
