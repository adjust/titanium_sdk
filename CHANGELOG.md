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

[android_sdk_v4.11.4]: https://github.com/adjust/android_sdk/tree/v4.11.4
[android_sdk_v4.12.0]: https://github.com/adjust/android_sdk/tree/v4.12.0
[android_sdk_v4.12.3]: https://github.com/adjust/android_sdk/tree/v4.12.3
[android_sdk_v4.12.4]: https://github.com/adjust/android_sdk/tree/v4.12.4
[android_sdk_v4.13.0]: https://github.com/adjust/android_sdk/tree/v4.13.0
[android_sdk_v4.14.0]: https://github.com/adjust/android_sdk/tree/v4.14.0
