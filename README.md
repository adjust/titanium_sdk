## Summary

This is the Titanium SDK of Adjust™. You can read more about Adjust™ at [adjust.com].

## Table of contents

* [Example app](#example-app)
* [Basic integration](#basic-integration)
   * [Get the SDK](#sdk-get)
   * [Add the SDK to your project](#sdk-add)
   * [Integrate the SDK into your app](#sdk-integrate)
   * [Adjust logging](#adjust-logging)
   * [Adjust project settings](#adjust-project-settings)
      * [Android permissions](#android-permissions)
      * [Google Play Services](#android-gps)
      * [Proguard settings](#android-proguard)
      * [Android install referrer](#android-broadcast-receiver)
      * [iOS frameworks](#ios-frameworks)
* [Additional features](#additional-features)
   * [Event tracking](#event-tracking)
      * [Revenue tracking](#revenue-tracking)
      * [Revenue deduplication](#revenue-deduplication)
      * [Callback parameters](#callback-parameters)
      * [Partner parameters](#partner-parameters)
    * [Session parameters](#session-parameters)
      * [Session callback parameters](#session-callback-parameters)
      * [Session partner parameters](#session-partner-parameters)
      * [Delay start](#delay-start)
    * [Attribution callback](#attribution-callback)
    * [Session and event callbacks](#session-event-callbacks)
    * [Disable tracking](#disable-tracking)
    * [Offline mode](#offline-mode)
    * [Event buffering](#event-buffering)
    * [Background tracking](#background-tracking)
    * [Device IDs](#device-ids)
      * [iOS advertising identifier](#di-idfa)
      * [Google Play Services advertising identifier](#di-gps-adid)
      * [Adjust device identifier](#di-adid)
    * [User attribution](#user-attribution)
    * [Push token](#push-token)
    * [Pre-installed trackers](#pre-installed-trackers)
    * [Deep linking](#deeplinking)
        * [Standard deep linking scenario](#deeplinking-standard)
        * [Deep linking on iOS 8 and earlier](#deeplinking-ios-old)
        * [Deep linking on iOS 9 and later](#deeplinking-ios-new)
        * [Deep linking on Android](#deeplinking-android)
        * [Deferred deep linking scenario](#deeplinking-deferred)
        * [Reattribution via deep links](#deeplinking-reattribution)
* [License](#license)


## <a id="example-app"></a>Example app

There is example inside the [`example` directory][example]. In there you can check how to integrate the Adjust SDK into your app. Example app in there was built with usage of `Appcelerator Studio` as `Alloy Mobile App Project`.

## <a id="basic-integration">Basic integration

These are the minimal steps required to integrate the Adjust SDK into your Appcelerator Titanium app project.

### <a id="sdk-get">Get the SDK

You can get the latest version of the Adjust SDK modules from our [releases page][releases].

### <a id="sdk-add">Add the SDK to your project

Add Adjust SDK to Titanium SDK installed on your machine and after that add it to your app by opening your `tiapp.xml` file in Appcelerator Studio and adding `ti.adjust` module in `Modules` section.

After adding Adjust SDK module, you should see following in your `tiapp.xml` source code:

```xml
<modules>
    <!-- ... -->
    <module platform="android">ti.adjust</module>
    <module platform="iphone">ti.adjust</module>
    <!-- ... -->
</modules>
```

In addition to Titanium module, we have created two additional JavaScript classes (which can also be found on [releases page][releases]) to help you while using Adjust SDK:

- `adjust_config.js`
- `adjust_event.js`

Please, add these two JavaScript files to your app as well. In order to be able to use these two classes like they will be used in code examples in this README, please add following line(s) on places where you want to use objects of these two classes:

```js
var AdjustEvent = require('adjust_event');
var AdjustConfig = require('adjust_config');
```

### <a id="sdk-integrate">Integrate the SDK into your app

You should initialise Adjust SDK **as soon as possible** in your application, pretty much right upon app launches. Run the initialisation code once per app launch, no need to run it more than once during app lifetime, since Adjust SDK exist in your app as static instance. In order to initialise Adjust SDK in your app, please do the following:

```js
var adjustConfig = new AdjustConfig("{YourAppToken}", AdjustConfig.EnvironmentSandbox);

Adjust.start(adjustConfig);
```

Replace `{YourAppToken}` with your app token. You can find this in your [dashboard].

Depending on whether you build your app for testing or for production, you must set `environment` with one of these values:

```javascript
AdjustConfig.EnvironmentSandbox
AdjustConfig.EnvironmentProduction
```

**Important:** This value should be set to `AdjustConfig.EnvironmentSandbox` if and only if you or someone else is testing your app. Make sure to set the environment to `AdjustConfig.EnvironmentProduction` just before you publish the app. Set it back to `AdjustConfig.EnvironmentSandbox` when you start developing and testing it again.

We use this environment to distinguish between real traffic and test traffic from test devices. It is very important that you keep this value meaningful at all times! This is especially important if you are tracking revenue.

### <a id="sdk-logging">Adjust logging

You can increase or decrease the amount of logs you see in tests by calling `setLogLevel` on your `AdjustConfig` instance with one of the following parameters:

```js
adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);   // enable all logging
adjustConfig.setLogLevel(AdjustConfig.LogLevelDebug);     // enable more logging
adjustConfig.setLogLevel(AdjustConfig.LogLevelInfo);      // the default
adjustConfig.setLogLevel(AdjustConfig.LogLevelWarn);      // disable info logging
adjustConfig.setLogLevel(AdjustConfig.LogLevelError);     // disable warnings as well
adjustConfig.setLogLevel(AdjustConfig.LogLevelAssert);    // disable errors as well
adjustConfig.setLogLevel(AdjustConfig.LogLevelSuppress);  // disable all logging
```

### <a id="adjust-project-settings">Adjust project settings

Once the Adjust SDK has been added to your app, certain tweeks are being performed so that the Adjust SDK can work properly. Everything that is being done in this process is written in the `plugin.xml` file of the Adjust SDK plugin. Below you can find a description of every additional thing that the Adjust SDK performs after you've added it to your app.

### <a id="android-permissions">Android permissions

The Adjust SDK adds two permissions to your Android manifest file: `INTERNET` and `ACCESS_WIFI_STATE`. You can find this setting in the `timodule.xml` file of the Adjust SDK Android module:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    
    <!-- ... -->
</manifest>
```

`INTERNET` permission is the permission that our SDK might need at any point in time. `ACCESS_WIFI_STATE` is the permission which the Adjust SDK needs in case your app is not targetting the Google Play Store and doesn't use Google Play Services. If you are targetting the Google Play Store and you are using Google Play Services, the Adjust SDK doesn't need this permission and, if you don't need it anywhere else in your app, you can remove it.

### <a id="android-gps">Google Play Services

Since the August 1, 2014, apps in the Google Play Store must use the [Google Advertising ID][google-ad-id] to uniquely identify each device. To allow the Adjust SDK to use the Google Advertising ID, you must integrate [Google Play Services][google-play-services].

The Adjust SDK adds Google Play Services by default to your app. This is done with this line in the `timodule.xml` file of the Adjust SDK Android module:

```xml
<manifest>
    <!-- ... -->
    <application>
        <!-- ... -->
        <meta-data android:name="com.google.android.gms.version"
                   android:value="@integer/google_play_services_version" />
    </application>
</manifest>
```

If you are using other Titanium modules, they might also be importing Google Play Services by default into your app. If this is the case, Google Play Services from our SDK and other plugins can conflict and cause build time errors. Google Play Services does not have to be present in your app as part of our SDK exclusively. As long as you have the **analytics part of the Google Play Services library integrated in your app**, our SDK will be able to read all the necessary information. In case you choose to add Google Play Services into your app as part of another Cordova plugin, you can simply remove the above line from the `plugin.xml` file of our SDK.

To check whether the analytics part of the Google Play Services library has been successfully added to your app so that the Adjust SDK can read it properly, you should start your app by configuring the SDK to run in `sandbox` mode and set the log level to `verbose`. After that, track a session or some events in your app and observe the list of parameters in the verbose logs which are being read once the session or event has been tracked. If you see a parameter called `gps_adid` in there, you have successfully added the analytics part of the Google Play Services library to your app and our SDK is reading the necessary information from it.

Important thing to mention is that Adjust SDK doesn't include full version of Google Play Services library which can potentially lead to hitting `65K DEX Reference Limit`, but rather just part needed for successful reading of Google Play Advertising Identifier (named `basement` in latest Android SDK versions).

### <a id="android-proguard">Proguard settings

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
-keep class dalvik.system.VMRuntime {
    java.lang.String getRuntime();
}
-keep class android.os.Build {
    java.lang.String[] SUPPORTED_ABIS;
    java.lang.String CPU_ABI;
}
-keep class android.content.res.Configuration {
    android.os.LocaledList getLocales();
    java.util.Locale locale;
}
-keep class android.os.LocaledList {
    java.util.Locale get(int);
}
```

### <a id="android-broadcast-receiver">Android install referrer

The Adjust install referrer broadcast receiver is added to your app by default. For more information, you can check our native [Android SDK README][broadcast-receiver]. You can find this setting in the `timodule.xml` file of the Adjust SDK Android module:

```xml
<manifest>
    <!-- ... -->
    <application>
        <receiver android:name="com.adjust.sdk.AdjustReferrerReceiver" android:exported="true">
            <intent-filter>
                <action android:name="com.android.vending.INSTALL_REFERRER" />
            </intent-filter>
        </receiver>
        <!-- ... -->
    </application>
</manifest>
```

Please bear in mind that, if you are using your own broadcast receiver which handles the `INSTALL_REFERRER` intent, you don't need the Adjust broadcast receiver to be added to your manifest file. You can remove it, but inside your own receiver add the call to the Adjust broadcast receiver as described in our [Android guide][broadcast-receiver-custom].

### <a id="ios-frameworks">iOS frameworks

Adjust SDK iOS module adds three iOS frameworks to your generated Xcode project:

* `iAd.framework` - in case you are running iAd campaigns.
* `AdSupport.framework` - for reading iOS Advertising Id (IDFA).
* `AdjustSdk.framework` - our native iOS SDK framework.

In order to support some features from `AdjustSdk.framework`, our iOS module will also add `-ObjC` flag to `Other Linker Flags` setting in Xcode project.

Additional setting we're adding as well is the setting for `Framework Search Paths` value of iOS Xcode project which says where to look for `AdjustSdk.framework` when building your app, since it's not a default iOS framework like `iAd.framework` or `AdSupport.framework`.

Settings for this can also be found in the `module.xcconfig` file of the Adjust SDK iOS module:

```
FRAMEWORK_SEARCH_PATHS=$(SRCROOT)/../../modules/iphone/ti.adjust/4.11.0/platform "~/Library/Application Support/Titanium/modules/iphone/ti.adjust/4.11.0/platform"
OTHER_LDFLAGS=$(inherited) -framework AdSupport -framework iAd -framework AdjustSdk -ObjC
```

If you are not running any iAd campaigns, you can feel free to remove the `iAd.framework` dependency.

## <a id="additional-features">Additional features

You can take advantage of the following features once the Adjust SDK is integrated into your project.

### <a id="event-tracking">Event tracking

You can use Adjust to track all kinds of events. Let's say you want to track every tap on a button. Simply create a new event token in your [dashboard]. Let's say that event token is `abc123`. You can add the following line in your button’s click handler method to track the click:

```js
var adjustEvent = new AdjustEvent("abc123");
Adjust.trackEvent(adjustEvent);
```

### <a id="revenue-tracking">Revenue tracking

If your users can generate revenue by tapping on advertisements or making In-App Purchases, then you can track those revenues with events. Let's say a tap is worth €0.01. You could track the revenue event like this:

```js
var adjustEvent = new AdjustEvent("abc123");

adjustEvent.setRevenue(0.01, "EUR");

Adjust.trackEvent(adjustEvent);
```

When you set a currency token, Adjust will automatically convert the incoming revenues into a reporting revenue of your choice. Read more about [currency conversion here][currency-conversion].


### <a id="revenue-deduplication"></a>Revenue deduplication

You can also add an optional transaction ID to avoid tracking duplicate revenues. The last ten transaction IDs are remembered, and revenue events with duplicate transaction IDs are skipped. This is especially useful for In-App Purchase tracking. You can see an example below.

If you want to track in-app purchases, please make sure to call the `trackEvent` only if the transaction is finished and an item is purchased. That way you can avoid tracking revenue that is not actually being generated.

```js
var adjustEvent = new AdjustEvent("abc123");

adjustEvent.setRevenue(0.01, "EUR");
adjustEvent.setTransactionId("{YourTransactionId}");

Adjust.trackEvent(adjustEvent);
```

**Note**: Transaction ID is the iOS term, unique identifier for successfully finished Android In-App-Purchases is named **Order ID**.

### <a id="callback-parameters">Callback parameters

You can also register a callback URL for that event in your [dashboard][dashboard] and we will send a GET request to that URL whenever the event gets tracked. In that case you can also put some key-value pairs in an object and pass it to the `trackEvent` method. We will then append these named parameters to your callback URL.

For example, suppose you have registered the URL `http://www.adjust.com/callback` for your event with event token `abc123` and execute the following lines:

```js
var adjustEvent = new AdjustEvent("abc123");

adjustEvent.addCallbackParameter("key", "value");
adjustEvent.addCallbackParameter("foo", "bar");

Adjust.trackEvent(adjustEvent);
```

In that case we would track the event and send a request to:

```
http://www.adjust.com/callback?key=value&foo=bar
```

It should be mentioned that we support a variety of placeholders like `{idfa}` for iOS or `{gps_adid}` for Android that can be used as parameter values.  In the resulting callback the `{idfa}` placeholder would be replaced with the ID for Advertisers of the current device for iOS and the `{gps_adid}` would be replaced with the Google Advertising ID of the current device for Android. Also note that we don't store any of your custom parameters, but only append them to your callbacks. If you haven't registered a callback for an event, these parameters won't even be read.

You can read more about using URL callbacks, including a full list of available values, in our [callbacks guide][callbacks-guide].

### <a id="partner-parameters">Partner parameters

Similarly to the callback parameters mentioned above, you can also add parameters that Adjust will transmit to the network partners of your choice. You can activate these networks in your Adjust dashboard.

This works similarly to the callback parameters mentioned above, but can be added by calling the `addPartnerParameter` method on your `AdjustEvent` instance.

```js
var adjustEvent = new AdjustEvent("abc123");

adjustEvent.addPartnerParameter("key", "value");
adjustEvent.addPartnerParameter("foo", "bar");

Adjust.trackEvent(adjustEvent);
```

You can read more about special partners and networks in our [guide to special partners][special-partners].

### <a id="session-parameters">Session parameters

Some parameters are saved to be sent in every event and session of the Adjust SDK. Once you have added any of these parameters, you don't need to add them every time, since they will be saved locally. If you add the same parameter twice, there will be no effect.

These session parameters can be called before the Adjust SDK is launched to make sure they are sent even on install. If you need to send them with an install, but can only obtain the needed values after launch, it's possible to [delay](#delay-start) the first launch of the Adjust SDK to allow this behaviour.

### <a id="session-callback-parameters"> Session callback parameters

The same callback parameters that are registered for [events](#callback-parameters) can be also saved to be sent in every event or session of the Adjust SDK.

The session callback parameters have a similar interface of the event callback parameters. Instead of adding the key and its value to an event, it's added through a call to method `addSessionCallbackParameter` of the `Adjust` instance:

```js
Adjust.addSessionCallbackParameter("foo", "bar");
```

The session callback parameters will be merged with the callback parameters added to an event. The callback parameters added to an event have precedence over the session callback parameters. Meaning that, when adding a callback parameter to an event with the same key to one added from the session, the value that prevails is the callback parameter added to the event.

It's possible to remove a specific session callback parameter by passing the desiring key to the method `removeSessionCallbackParameter` of the `Adjust` instance:

```js
Adjust.removeSessionCallbackParameter("foo");
```

If you wish to remove all key and values from the session callback parameters, you can reset it with the method `resetSessionCallbackParameters` of the `Adjust` instance:

```js
Adjust.resetSessionCallbackParameters();
```

### <a id="session-partner-parameters">Session partner parameters

In the same way that there are [session callback parameters](#session-callback-parameters) that are sent for every event or session of the Adjust SDK, there are also session partner parameters.

These will be transmitted to network partners, for the integrations that have been activated in your Adjust [dashboard].

The session partner parameters have a similar interface to the event partner parameters. Instead of adding the key and its value to an event, it's added through a call to method `addSessionPartnerParameter` of the `Adjust` instance:

```js
Adjust.addSessionPartnerParameter("foo", "bar");
```

The session partner parameters will be merged with the partner parameters added to an event. The partner parameters added to an event have precedence over the session partner parameters. Meaning that, when adding a partner parameter to an event with the same key to one added from the session, the value that prevails is the partner parameter added to the event.

It's possible to remove a specific session partner parameter by passing the desiring key to the method `removeSessionPartnerParameter` of the `Adjust` instance:

```js
Adjust.removeSessionPartnerParameter("foo");
```

If you wish to remove all keys and values from the session partner parameters, you can reset it with the method `resetSessionPartnerParameters` of the `Adjust` instance:

```js
Adjust.resetSessionPartnerParameters();
```

### <a id="delay-start">Delay start

Delaying the start of the Adjust SDK allows your app some time to obtain session parameters, such as unique identifiers, to be sent on install.

Set the initial delay time in seconds with the `setDelayStart` field of the `AdjustConfig` instance:

```js
adjustConfig.setDelayStart(5.5);
```

In this case this will make the Adjust SDK not send the initial install session and any event created for 5.5 seconds. After this time is expired or if you call `sendFirstPackages()` of the `Adjust` instance in the meanwhile, every session parameter will be added to the delayed install session and events and the Adjust SDK will resume as usual.

**The maximum delay start time of the Adjust SDK is 10 seconds**.

### <a id="attribution-callback">Attribution callback

You can register a listener to be notified of tracker attribution changes. Due to the different sources considered for attribution, this information cannot by provided synchronously. The simplest way is to create a single anonymous listener which is going to be called **each time your user's attribution value changes**:

With the `AdjustConfig` instance, before starting the SDK, attribution callback method:

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

Within the listener function you have access to the `attribution` parameters. Here is a quick summary of its properties:

- `trackerToken`    the tracker token of the current install.
- `trackerName`     the tracker name of the current install.
- `network`         the network grouping level of the current install.
- `campaign`        the campaign grouping level of the current install.
- `adgroup`         the ad group grouping level of the current install.
- `creative`        the creative grouping level of the current install.
- `clickLabel`      the click label of the current install.
- `adid`            the Adjust device identifier.

Please make sure to consider our [applicable attribution data policies][attribution-data].

### <a id="session-event-callbacks">Session and event callbacks

You can register a callback to be notified of successful and failed tracked events and/or sessions.

Follow the same steps as for attribution callback to implement the following callback function for successfully tracked events:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setEventTrackingSuccessCallback(function(eventSuccess) {
    // Printing all event success properties.
    Ti.API.info("Event tracking succeeded!");
    Ti.API.info("Message: " + eventSuccess.message);
    Ti.API.info("Timestamp: " + eventSuccess.timestamp);
    Ti.API.info("Adid: " + eventSuccess.adid);
    Ti.API.info("Event token: " + eventSuccess.eventToken);
    Ti.API.info("JSON response: " + eventSuccess.jsonResponse);
});

Adjust.start(adjustConfig);
```

The following callback function for failed tracked events:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setEventTrackingFailureCallback(function(eventFailure) {
    // Printing all event failure properties.
    Ti.API.info("Event tracking failed!");
    Ti.API.info("Message: " + eventFailure.message);
    Ti.API.info("Timestamp: " + eventFailure.timestamp);
    Ti.API.info("Adid: " + eventFailure.adid);
    Ti.API.info("Event token: " + eventFailure.eventToken);
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

And for failed tracked sessions:

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

- `var message` the message from the server or the error logged by the SDK.
- `var timestamp` timestamp from the server.
- `var adid` a unique device identifier provided by Adjust.
- `var jsonResponse` the JSON object with the response from the server.

Both event response data objects contain:

- `var eventToken` the event token, if the package tracked was an event.

And both event and session failed objects also contain:

- `var willRetry` indicates there will be an attempt to resend the package at a later time.

### <a id="disable-tracking">Disable tracking

You can disable the Adjust SDK from tracking by invoking the method `setEnabled` of the `Adjust` instance with the enabled parameter as `false`. This setting is **remembered between sessions**, but it can only be activated after the first session.

```js
Adjust.setEnabled(false);
```

You can verify if the Adjust SDK is currently active with the method `isEnabled` of the `Adjust` instance. It is always possible to activate the Adjust SDK by invoking `setEnabled` with the parameter set to `true`.

### <a id="offline-mode">Offline mode

You can put the Adjust SDK in offline mode to suspend transmission to our servers while retaining tracked data to be sent later. When in offline mode, all information is saved in a file, so be careful not to trigger too many events while in offline mode.

You can activate offline mode by calling the method `setOfflineMode` of the `Adjust` instance with the parameter `true`.

```js
Adjust.setOfflineMode(true);
```

Conversely, you can deactivate offline mode by calling `setOfflineMode` with `false`. When the Adjust SDK is put back in online mode, all saved information is send to our servers with the correct time information.

Unlike disabling tracking, **this setting is not remembered** between sessions. This means that the SDK is in online mode whenever it is started, even if the app was terminated in offline mode.

### <a id="event-buffering">Event buffering

If your app makes heavy use of event tracking, you might want to delay some HTTP requests in order to send them in one batch every minute. You can enable event buffering with your `AdjustConfig` instance by calling `setEventBufferingEnabled` method:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setEventBufferingEnabled(true);

Adjust.start(adjustConfig);
```

### <a id="background-tracking">Background tracking

The default behaviour of the Adjust SDK is to **pause sending HTTP requests while the app is in the background**. You can change this in your `AdjustConfig` instance by calling `setSendInBackground` method:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setSendInBackground(true);

Adjust.start(adjustConfig);
```

If nothing is set, sending in background is **disabled by default**.

### <a id="device-ids">Device IDs

Certain services (such as Google Analytics) require you to coordinate Device and Client IDs in order to prevent duplicate reporting.

### <a id="di-idfa">iOS Advertising Identifier

To obtain the IDFA, call the `getIdfa` method of the `Adjust` instance. You need to pass a callback to that method in order to obtain the value:

```js
Adjust.getIdfa(function(idfa) {
    // Use idfa value.
});
```


### <a id="di-gps-adid">Google Play Services advertising identifier

If you need to obtain the Google Advertising ID, you can call the `getGoogleAdId` method of the `Adjust` instance. You need to pass a callback to that method in order to obtain the value:

```js
Adjust.getGoogleAdId(function(googleAdId) {
    // Use googleAdId value.
});
```

Inside the callback method you will have access to the Google Advertising ID as the variable `googleAdId`.

### <a id="di-adid"></a>Adjust device identifier

For every device with your app installed on it, the Adjust backend generates a unique **Adjust device identifier** (**adid**). In order to obtain this identifier, call the `getAdid` method of the `Adjust` instance. You need to pass a callback to that method in order to obtain the value:

```js
Adjust.getAdid(function(adid) {
    // Use adid value.
});
```

**Note**: Information about the **adid** is only available after an app installation has been tracked by the Adjust backend. From that moment on, the Adjust SDK has information about the device **adid** and you can access it with this method. So, **it is not possible** to access the **adid** value before the SDK has been initialised and installation of your app has been successfully tracked.

### <a id="user-attribution"></a>User attribution

As described in the [attribution callback section](#attribution-callback), this callback is triggered, providing you with information about a new attribution whenever it changes. If you want to access information about a user's current attribution whenever you need it, you can make a call to the `getAttribution` method of the `Adjust` instance:

```js
Adjust.getAttribution(function(attribution) {
    // Use attribution object in same way like in attribution callback.
});
```

**Note**: Information about current attribution is only available after an app installation has been tracked by the Adjust backend and the attribution callback has been triggered. From that moment on, the Adjust SDK has information about a user's attribution and you can access it with this method. So, **it is not possible** to access a user's attribution value before the SDK has been initialised and an attribution callback has been triggered.

### <a id="push-token">Push token

To send us the push notification token, add the following call to Adjust **whenever you get your token in the app or when it gets updated**:

```js
Adjust.setPushToken("YourPushNotificationToken");
```

### <a id="pre-installed-trackers">Pre-installed trackers

If you want to use the Adjust SDK to recognize users that found your app pre-installed on their device, follow these steps.

1. Create a new tracker in your [dashboard].
2. Open your app delegate and add set the default tracker of your `AdjustConfig` instance:

    ```js
    var adjustConfig = new AdjustConfig(appToken, environment);

    adjustConfig.setDefaultTracker("{TrackerToken}");
    
    Adjust.start(adjustConfig);
    ```

  Replace `{TrackerToken}` with the tracker token you created in step 2. Please note that the dashboard displays a tracker 
  URL (including `http://app.adjust.com/`). In your source code, you should specify only the six-character token and not the
  entire URL.

3. Build and run your app. You should see a line like the following in the app's log output:

    ```
    Default tracker: 'abc123'
    ```

### <a id="deeplinking">Deep linking

If you are using the Adjust tracker URL with an option to deep link into your app from the URL, there is the possibility to get info about the deep link URL and its content. Hitting the URL can happen when the user has your app already installed (standard deep linking scenario) or if they don't have the app on their device (deferred deep linking scenario).

### <a id="deeplinking-standard">Standard deep linking scenario

Standard deep linking scenario is a platform specific feature and in order to support it, you need to add some additional settings to your app. If your user already has the app installed and hits the tracker URL with deep link information in it, your application will be opened and the content of the deep link will be sent to your app so that you can parse it and decide what to do next. 

**Note for iOS**: With the introduction of iOS 9, Apple has changed the way deep linking is handled in the app. Depending on which scenario you want to use for your app (or if you want to use them both to support a wide range of devices), you need to set up your app to handle one or both of the following scenarios.

### <a id="deeplinking-ios-old"> Deep linking on iOS 8 and earlier

To support deep linking handling in your app for iOS 8 and earlier versions, you need to set `Custom URL Scheme` setting for your iOS app.

You can do this by editing `tiapp.xml` file of your app. Locate `<ios></ios>` section inside of it `<plist></plist>` section. It is a dictionary (it contains `<dict></dict>` section it itself) to which you need to add following at the end of items list:

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

Of course, you should replace dummy values from our example above:

- `app.bundle.id` should be your actual app bundle identifier.
- `your-scheme` should be the custom URL scheme of your choice which you want your app to handle.

After completing this, you have successfully added handling of chosen scheme by your app and from this moment on, if user clicks on a link that starts with `your-scheme://`, your app will get opened on user's device if it's installed.

In order to obtain the information about link that caused your app to get opened, you need to add some additional code. If your app is running in iOS environment, you need to subscribe to `resumed` event in order to obtain link content that opened your app. That can be done this:

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

Value of `args.url` represents actual link that opened your iOS app.

By completing this, you should be able to handle direct deep linking in **iOS 8 and lower**.

### <a id="deeplinking-ios-new"> Deep linking on iOS 9 and later

Starting from **iOS 9**, Apple has introduced suppressed support for old style deep linking with custom URL schemes like described above in favour of `universal links`. If you want to support deep linking in your app for iOS 9 and higher, you need to add support for universal links handling.

First thing you need to do is to enable universal links for your app in the Adjust dashboard. Instructions on how to do that can be found in our native iOS SDK [README][enable-ulinks].

After you have enabled universal links handling for your app in your dashboard, you need to add support for it in your app as well. You can achieve this by adding this [plugin][plugin-ulinks] to your cordova app. Please, read the README of this plugin, because it precisely describes what should be done in order to properly integrate it.

**Note**: You can disregard any information in the README that states that you need to have a domain and website or you need to upload a file to the root of your domain. Adjust is taking care of this instead of you and you can skip this chapter of the README.

Enabling universal links handling in iOS Titanium app is a bit trickier than adding support for custom URL scheme, because it contains some extra steps.

After you have built your app for iOS, go to `build/iphone` folder of your app's root folder. In there, you will find a file named `<YOUR_APP_NAME>.entitlements` which is autogenerated in the background by `xcode-build` tool once you build your iOS app from Appcelerator Studio. Take this file and copy it to `platform/ios` folder inside of your app's root folder. If this folder doesn't exist, feel free to add it. Open this file with text editor, and you will notice that it has XML structure where `plist` is the root element which contains `dict` inside. At the end of the dictionary items list, you need to add universal link content which you got generated on the Adjust dashboard. Part you need to add looks like this:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:abcd.adj.st</string>
</array>
```

This is just example, instead of `abcd.adj.st`, you should enter universal link value from your dashboard.

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

After completing this, you have successfully added handling of Adjust universal link by your app and from this moment on, if user clicks on a link that starts with `https://abcd.adj.st/`, your app will get opened on user's device if it's installed.

In order to obtain the information about link that caused your app to get opened, you need to add some additional code. If your app is running in iOS environment, you need to subscribe to `continueactivity` event in order to obtain link content that opened your app. That can be done this:

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

Value of `deeplink` variable in example above represents actual link that opened your iOS app.

By completing this, you should be able to handle direct deep linking in **iOS 9 and newer**.


### <a id="deeplinking-android"> Deep linking on Android

In order to support deep linking for your Android app, you need to add support for handling some custom URL scheme of your choice which you want to be used to open your Android app.

You can do this by editing `tiapp.xml` file of your app. Locate `<android></android>` section and inside of it, you should instruct that certaing modifications in resulting Android app's manifest file should be done to your main app activity (or to the activity that you would like to be launched once your app is opened with click on link which contains your custom URL scheme). 

**Note**: In our example app, name of main activity in the app is `AdjustexampleActivity`, so in code example below this will be used.

You need to assign custom URL scheme to activity of your choice by adding `intent-filter` to it. Once added, your `<android></android> section inside of `tiapp.xml` file can look like this:

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

Of course, you should replace values from our example above:

- `AdjustexampleActivity` should be your actual activity name.
- `your-scheme` should be the custom URL scheme of your choice which you want your app to handle.

After completing this, you have successfully added handling of chosen scheme by your app and from this moment on, if user clicks on a link that starts with `your-scheme://`, your app will get opened on user's device if it's installed.

In order to obtain the information about link that caused your app to get opened, you need to add some additional code. If your app is running in Android environment, you need to extract `data` from `intent` each time when your app gets opened:

```js
if (OS_ANDROID) {
    var activity = Ti.Android.currentActivity;
    var url = activity.getIntent().getData();
}
```

Value of `url` variable in example above (if not `null`) represents actual link that opened your Android app.

By completing this, you should be able to handle direct deep linking in **Android**.

### <a id="deeplinking-deferred">Deferred deep linking scenario

While deferred deep linking is not supported out of the box on Android and iOS, our Adjust SDK makes it possible.
 
In order to get info about the URL content in a deferred deep linking scenario, you should set a callback method on the `AdjustConfig` object which will receive one parameter where the content of the URL will be delivered. You should set this method on the config object by calling the method `setDeferredDeeplinkCallback`:

```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setDeferredDeeplinkCallback(function(deeplink) {
    Ti.API.info("Deferred deep link URL content: " + deeplink);
});

Adjust.start(adjustConfig);
```

In deferred deep linking scenario, there is one additional setting which can be set on the `AdjustConfig` object. Once the Adjust SDK gets the deferred deep link info, we are offering you the possibility to choose whether our SDK should open this URL or not. You can choose to set this option by calling the `setShouldLaunchDeeplink` method on the config object:


```js
var adjustConfig = new AdjustConfig(appToken, environment);

adjustConfig.setShouldLaunchDeeplink(true);
// or adjustConfig.setShouldLaunchDeeplink(false);

adjustConfig.setDeferredDeeplinkCallback(function(deeplink) {
    Ti.API.info("Deferred deep link URL content: " + deeplink);
});

Adjust.start(adjustConfig);
```

If nothing is set, **the Adjust SDK will always try to launch the URL by default**.

### <a id="deeplinking-reattribution">Reattribution via deep links

Adjust enables you to run re-engagement campaigns by using deep links. For more information on this, please check our [official docs][reattribution-with-deeplinks].

If you are using this feature, in order for your user to be properly reattributed, you need to make one additional call to the Adjust SDK in your app.

Once you have received deep link content information in your app, add a call to `appWillOpenUrl` method of the `Adjust` instance. By making this call, the Adjust SDK will try to find if there is any new attribution info inside of the deep link and if any, it will be sent to the Adjust backend. If your user should be reattributed due to a click on the Adjust tracker URL with deep link content in it, you will see the [attribution callback](#attribution-callback) in your app being triggered with new attribution info for this user.

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

With having these calls added, if deep link that opened your app maybe contained potential reattribution parameters, our SDK will pass that information to backend which will make the decision whether user is going to be reattributed or not. Like already mentioned, in case that your user gets reattributed, attribution callback (if implemented) will be triggered with new attribution value and you will have this information in your app as well.

## <a id="license">License

The Adjust SDK is licensed under the MIT License.

Copyright (c) 2012-2017 Adjust GmbH, http://www.adjust.com

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
[custom-url-scheme]:    https://github.com/EddyVerbruggen/Custom-URL-scheme
[broadcast-receiver]:   https://github.com/adjust/android_sdk#sdk-broadcast-receiver

[google-launch-modes]:    http://developer.android.com/guide/topics/manifest/activity-element.html#lmode
[currency-conversion]:    https://docs.adjust.com/en/event-tracking/#tracking-purchases-in-different-currencies
[google-play-services]:   http://developer.android.com/google/play-services/index.html

[custom-url-scheme-usage]:      https://github.com/EddyVerbruggen/Custom-URL-scheme#3-usage
[broadcast-receiver-custom]:    https://github.com/adjust/android_sdk/blob/master/doc/english/referrer.md
[reattribution-with-deeplinks]: https://docs.adjust.com/en/deeplinking/#manually-appending-attribution-data-to-a-deep-link
