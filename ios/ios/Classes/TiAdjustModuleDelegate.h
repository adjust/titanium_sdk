//
//  TiAdjustModuleDelegate.h
//  AdjustSdk
//
//  Created by Uglješa Erceg on 18.05.17.
//
//

#import "TiAdjustModule.h"

@interface TiAdjustModuleDelegate : NSObject <AdjustDelegate>

@property (nonatomic) BOOL shouldLaunchDeferredDeeplink;
@property (nonatomic, strong) TiAdjustModule *adjustModule;

+ (id)getInstanceWithSwizzleOfAttributionCallback:(BOOL)swizzleAttributionCallback
                             eventSuccessCallback:(BOOL)swizzleEventSuccessCallback
                             eventFailureCallback:(BOOL)swizzleEventFailureCallback
                           sessionSuccessCallback:(BOOL)swizzleSessionSuccessCallback
                           sessionFailureCallback:(BOOL)swizzleSessionFailureCallback
                         deferredDeeplinkCallback:(BOOL)swizzleDeferredDeeplinkCallback
                     shouldLaunchDeferredDeeplink:(BOOL)shouldLaunchDeferredDeeplink
                                       withModule:(TiAdjustModule *)module;

@end
