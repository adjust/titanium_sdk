### Version 4.23.1 (29th September 2020)
#### Fixed
- Fixed duplicate `ADJUrlStrategy` symbol error.

#### Native SDKs
- [iOS@v4.23.2][ios_sdk_v4.23.2]
- [Android@v4.24.1][android_sdk_v4.24.1]

---

### Version 4.23.0 (2nd September 2020)
#### Added
- Added `trackAdRevenue` method to `Adjust` interface to allow tracking of ad revenue. With this release added support for `MoPub` ad revenue tracking.
- Added reading of Facebook anonymous ID if available on iOS platform.
- Added `disableThirdPartySharing` method to `Adjust` interface to allow disabling of data sharing with third parties outside of Adjust ecosystem.
- Added support for signature library as a plugin.
- Added more aggressive sending retry logic for install session package.
- Added external device ID support.
- Added support for Huawei App Gallery install referrer.
- Added subscription tracking feature.
- Added communication with SKAdNetwork framework by default on iOS 14.
- Added method `deactivateSKAdNetworkHandling` method to `AdjustConfig` to switch off default communication with SKAdNetwork framework in iOS 14.
- Added wrapper method `requestTrackingAuthorizationWithCompletionHandler` to `Adjust` to allow asking for user's consent to be tracked in iOS 14 and immediate propagation of user's choice to backend.
- Added handling of new iAd framework error codes introduced in iOS 14.
- Added sending of value of user's consent to be tracked with each package.
- Added `setUrlStrategy` method to `AdjustConfig` class to allow selection of URL strategy for specific market.

#### Changed
- Updated Titanium SDK version used to build Adjust SDK to `9.1.0.GA`.

⚠️ **Note**: This SDK update contains support for iOS 14 and that makes it compatible with Titanium SDK 9.1.0 and later.

⚠️ **Note**: iOS 14 beta versions prior to 5 appear to have an issue when trying to use iAd framework API like described in [here](https://github.com/adjust/ios_sdk/issues/452). For testing of v4.23.0 version of SDK in iOS, please make sure you're using **iOS 14 beta 5 or later**.

#### Native SDKs
- [iOS@v4.23.0][ios_sdk_v4.23.0]
- [Android@v4.24.0][android_sdk_v4.24.0]

---

### Version 4.17.0 (15th January 2019)
#### Added
- Added `getSdkVersion` method to `Adjust` interface to obtain current SDK version string.
- Added `setCallbackId` method on `AdjustEvent` object for users to set custom ID on event object which will later be reported in event success/failure callbacks.
- Added `callbackId` field to event tracking success callback object.
- Added `callbackId` field to event tracking failure callback object.

#### Changed
- Updated Android SDK and build tools to `28`.
- Marked `setReadMobileEquipmentIdentity` method of `AdjustConfig` object as deprecated.
- SDK will now fire attribution request each time upon session tracking finished in case it lacks attribution info.

#### Native SDKs
- [iOS@v4.17.1][ios_sdk_v4.17.1]
- [Android@v4.17.0][android_sdk_v4.17.0]

---

### Version 4.14.0 (16th July 2018)
#### Added
- Added deep link caching in case `appWillOpenUrl` method is called before SDK is initialised.

#### Changed
- Updated the way how iOS plugin handles push tokens from Titanium interface - they are now being passed directly as strings to native iOS SDK.
- Removed `google-play.services.jar` dependency from Android plugin.
- Updated `Google Play Services` section of `README` with new instructions on how dependency can be added to your app.

#### Native SDKs
- [iOS@v4.14.1][ios_sdk_v4.14.1]
- [Android@v4.14.0][android_sdk_v4.14.0]

---

### Version 4.13.0 (23rd May 2018)
#### Added
- Added `gdprForgetMe` method to `Adjust` interface enable possibility for user to be forgotten in accordance with GDPR law.

#### Native SDKs
- [iOS@v4.13.0][ios_sdk_v4.13.0]
- [Android@v4.13.0][android_sdk_v4.13.0]

---

### Version 4.12.1 (12th March 2018)
#### Native changes
- Updated Android SDK to `v4.12.4`.

#### Native SDKs
- [iOS@v4.12.3][ios_sdk_v4.12.3]
- [Android@v4.12.4][android_sdk_v4.12.4]

---

### Version 4.12.0 (9th March 2018)
#### Added
- Added support for `Titanium 7.0.0.GA`.
- Added `setAppSecret` method to `AdjustConfig` interface.
- Added `getAmazonAdId` method to `Adjust` interface.
- Added `setReadMobileEquipmentIdentity` method to `AdjustConfig` interface.

#### Native SDKs
- [iOS@v4.12.3][ios_sdk_v4.12.3]
- [Android@v4.12.3][android_sdk_v4.12.3]

---

### Version 4.11.2 (28th September 2017)
#### Added
- Improved iOS 11 support.

#### Changed
- Removed iOS connection validity checks.
- Updated native iOS SDK to version **4.11.5**.

#### Native SDKs
- [iOS@v4.11.5][ios_sdk_v4.11.5]
- [Android@v4.11.4][android_sdk_v4.11.4]

---

### Version 4.11.1 (17th July 2017)
#### Added
- Added `adjust_config.js` and `adjust_event.js` files to `js` folder in repository.

#### Fixed
- Fixed attempts to trigger JavaScript callbacks from native iOS code if they are not implemented.

#### Native SDKs
- [iOS@v4.11.4][ios_sdk_v4.11.4]
- [Android@v4.11.4][android_sdk_v4.11.4]

---

### Version 4.11.0 (30th May 2017)
#### Added
- Initial release of Titanium SDK. Supported platforms: `iOS` and `Android`.

#### Native SDKs
- [iOS@v4.11.4][ios_sdk_v4.11.4]
- [Android@v4.11.4][android_sdk_v4.11.4]


[ios_sdk_v4.11.4]: https://github.com/adjust/ios_sdk/tree/v4.11.4
[ios_sdk_v4.11.5]: https://github.com/adjust/ios_sdk/tree/v4.11.5
[ios_sdk_v4.12.1]: https://github.com/adjust/ios_sdk/tree/v4.12.1
[ios_sdk_v4.12.3]: https://github.com/adjust/ios_sdk/tree/v4.12.3
[ios_sdk_v4.13.0]: https://github.com/adjust/ios_sdk/tree/v4.13.0
[ios_sdk_v4.14.1]: https://github.com/adjust/ios_sdk/tree/v4.14.1
[ios_sdk_v4.23.0]: https://github.com/adjust/ios_sdk/tree/v4.23.0
[ios_sdk_v4.23.2]: https://github.com/adjust/ios_sdk/tree/v4.23.2

[android_sdk_v4.11.4]: https://github.com/adjust/android_sdk/tree/v4.11.4
[android_sdk_v4.12.0]: https://github.com/adjust/android_sdk/tree/v4.12.0
[android_sdk_v4.12.3]: https://github.com/adjust/android_sdk/tree/v4.12.3
[android_sdk_v4.12.4]: https://github.com/adjust/android_sdk/tree/v4.12.4
[android_sdk_v4.13.0]: https://github.com/adjust/android_sdk/tree/v4.13.0
[android_sdk_v4.14.0]: https://github.com/adjust/android_sdk/tree/v4.14.0
[android_sdk_v4.17.0]: https://github.com/adjust/android_sdk/tree/v4.17.0
[android_sdk_v4.24.0]: https://github.com/adjust/android_sdk/tree/v4.24.0
[android_sdk_v4.24.1]: https://github.com/adjust/android_sdk/tree/v4.24.1
