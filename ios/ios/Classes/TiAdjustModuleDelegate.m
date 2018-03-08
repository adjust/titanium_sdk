/**
 * TiAdjustModuleDelegate.m
 * Adjust SDK
 *
 * Created by Uglješa Erceg (@uerceg) on 18th May 2017.
 * Copyright (c) 2012-2018 Adjust GmbH. All rights reserved.
 */

#import <objc/runtime.h>

#import "TiAdjustModuleDelegate.h"

@implementation TiAdjustModuleDelegate

+ (id)getInstanceWithSwizzleOfAttributionCallback:(BOOL)swizzleAttributionCallback
                             eventSuccessCallback:(BOOL)swizzleEventSuccessCallback
                             eventFailureCallback:(BOOL)swizzleEventFailureCallback
                           sessionSuccessCallback:(BOOL)swizzleSessionSuccessCallback
                           sessionFailureCallback:(BOOL)swizzleSessionFailureCallback
                         deferredDeeplinkCallback:(BOOL)swizzleDeferredDeeplinkCallback
                     shouldLaunchDeferredDeeplink:(BOOL)shouldLaunchDeferredDeeplink
                                       withModule:(TiAdjustModule *)module {
    static dispatch_once_t onceToken;
    static TiAdjustModuleDelegate *defaultInstance = nil;

    dispatch_once(&onceToken, ^{
        defaultInstance = [[TiAdjustModuleDelegate alloc] init];

        // Do the swizzling where and if needed.
        if (swizzleAttributionCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustAttributionChanged:)
                                  swizzledSelector:@selector(adjustAttributionChangedWannabe:)];
        }

        if (swizzleEventSuccessCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustEventTrackingSucceeded:)
                                  swizzledSelector:@selector(adjustEventTrackingSucceededWannabe:)];
        }

        if (swizzleEventFailureCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustEventTrackingFailed:)
                                  swizzledSelector:@selector(adjustEventTrackingFailedWannabe:)];
        }

        if (swizzleSessionSuccessCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustSessionTrackingSucceeded:)
                                  swizzledSelector:@selector(adjustSessionTrackingSucceededWannabe:)];
        }

        if (swizzleSessionFailureCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustSessionTrackingFailed:)
                                  swizzledSelector:@selector(adjustSessionTrackingFailedWananbe:)];
        }

        if (swizzleDeferredDeeplinkCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustDeeplinkResponse:)
                                  swizzledSelector:@selector(adjustDeeplinkResponseWannabe:)];
        }

        [defaultInstance setShouldLaunchDeferredDeeplink:shouldLaunchDeferredDeeplink];
        [defaultInstance setAdjustModule:module];
    });

    return defaultInstance;
}

- (id)init {
    self = [super init];

    if (nil == self) {
        return nil;
    }

    return self;
}

- (void)adjustAttributionChangedWannabe:(ADJAttribution *)attribution {
    if (nil == attribution) {
        return;
    }

    if (nil == self.adjustModule.jsAttributionCallback) {
        return;
    }

    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [self addValueOrEmpty:dictionary key:@"trackerToken" value:attribution.trackerToken];
    [self addValueOrEmpty:dictionary key:@"trackerName" value:attribution.trackerName];
    [self addValueOrEmpty:dictionary key:@"network" value:attribution.network];
    [self addValueOrEmpty:dictionary key:@"campaign" value:attribution.campaign];
    [self addValueOrEmpty:dictionary key:@"creative" value:attribution.creative];
    [self addValueOrEmpty:dictionary key:@"adgroup" value:attribution.adgroup];
    [self addValueOrEmpty:dictionary key:@"clickLabel" value:attribution.clickLabel];
    [self addValueOrEmpty:dictionary key:@"adid" value:attribution.adid];

    NSArray *array = [NSArray arrayWithObjects:dictionary, nil];
    [self.adjustModule.jsAttributionCallback call:array thisObject:nil];
}

- (void)adjustEventTrackingSucceededWannabe:(ADJEventSuccess *)eventSuccessResponseData {
    if (nil == eventSuccessResponseData) {
        return;
    }
    if (nil == self.adjustModule.jsEventSuccessCallback) {
        return;
    }

    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [self addValueOrEmpty:dictionary key:@"message" value:eventSuccessResponseData.message];
    [self addValueOrEmpty:dictionary key:@"timestamp" value:eventSuccessResponseData.timeStamp];
    [self addValueOrEmpty:dictionary key:@"adid" value:eventSuccessResponseData.adid];
    [self addValueOrEmpty:dictionary key:@"eventToken" value:eventSuccessResponseData.eventToken];
    [self addValueOrEmpty:dictionary key:@"jsonResponse" value:eventSuccessResponseData.jsonResponse];

    NSArray *array = [NSArray arrayWithObjects:dictionary, nil];
    [self.adjustModule.jsEventSuccessCallback call:array thisObject:nil];
}

- (void)adjustEventTrackingFailedWannabe:(ADJEventFailure *)eventFailureResponseData {
    if (nil == eventFailureResponseData) {
        return;
    }
    if (nil == self.adjustModule.jsEventFailureCallback) {
        return;
    }

    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [self addValueOrEmpty:dictionary key:@"message" value:eventFailureResponseData.message];
    [self addValueOrEmpty:dictionary key:@"timestamp" value:eventFailureResponseData.timeStamp];
    [self addValueOrEmpty:dictionary key:@"adid" value:eventFailureResponseData.adid];
    [self addValueOrEmpty:dictionary key:@"eventToken" value:eventFailureResponseData.eventToken];
    [dictionary setObject:(eventFailureResponseData.willRetry ? @"true" : @"false") forKey:@"willRetry"];
    [self addValueOrEmpty:dictionary key:@"jsonResponse" value:eventFailureResponseData.jsonResponse];

    NSArray *array = [NSArray arrayWithObjects:dictionary, nil];
    [self.adjustModule.jsEventFailureCallback call:array thisObject:nil];
}


- (void)adjustSessionTrackingSucceededWannabe:(ADJSessionSuccess *)sessionSuccessResponseData {
    if (nil == sessionSuccessResponseData) {
        return;
    }
    if (nil == self.adjustModule.jsSessionSuccessCallback) {
        return;
    }

    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [self addValueOrEmpty:dictionary key:@"message" value:sessionSuccessResponseData.message];
    [self addValueOrEmpty:dictionary key:@"timestamp" value:sessionSuccessResponseData.timeStamp];
    [self addValueOrEmpty:dictionary key:@"adid" value:sessionSuccessResponseData.adid];
    [self addValueOrEmpty:dictionary key:@"jsonResponse" value:sessionSuccessResponseData.jsonResponse];

    NSArray *array = [NSArray arrayWithObjects:dictionary, nil];
    [self.adjustModule.jsSessionSuccessCallback call:array thisObject:nil];
}

- (void)adjustSessionTrackingFailedWananbe:(ADJSessionFailure *)sessionFailureResponseData {
    if (nil == sessionFailureResponseData) {
        return;
    }
    if (nil == self.adjustModule.jsSessionFailureCallback) {
        return;
    }

    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [self addValueOrEmpty:dictionary key:@"message" value:sessionFailureResponseData.message];
    [self addValueOrEmpty:dictionary key:@"timestamp" value:sessionFailureResponseData.timeStamp];
    [self addValueOrEmpty:dictionary key:@"adid" value:sessionFailureResponseData.adid];
    [dictionary setObject:(sessionFailureResponseData.willRetry ? @"true" : @"false") forKey:@"willRetry"];
    [self addValueOrEmpty:dictionary key:@"jsonResponse" value:sessionFailureResponseData.jsonResponse];

    NSArray *array = [NSArray arrayWithObjects:dictionary, nil];
    [self.adjustModule.jsSessionFailureCallback call:array thisObject:nil];
}

- (BOOL)adjustDeeplinkResponseWannabe:(NSURL *)deeplink {
    NSString *path = [deeplink absoluteString];
    NSArray *array = [NSArray arrayWithObjects:@{@"uri": path}, nil];
    [self.adjustModule.jsDeferredDeeplinkCallback call:array thisObject:nil];

    return _shouldLaunchDeferredDeeplink;
}

- (void)swizzleCallbackMethod:(SEL)originalSelector
             swizzledSelector:(SEL)swizzledSelector {
    Class class = [self class];

    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);

    BOOL didAddMethod = class_addMethod(class,
                                        originalSelector,
                                        method_getImplementation(swizzledMethod),
                                        method_getTypeEncoding(swizzledMethod));

    if (didAddMethod) {
        class_replaceMethod(class,
                            swizzledSelector,
                            method_getImplementation(originalMethod),
                            method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

- (void)addValueOrEmpty:(NSMutableDictionary *)dictionary
                    key:(NSString *)key
                  value:(NSObject *)value {
    if (nil != value) {
        [dictionary setObject:[NSString stringWithFormat:@"%@", value] forKey:key];
    } else {
        [dictionary setObject:@"" forKey:key];
    }
}

@end
