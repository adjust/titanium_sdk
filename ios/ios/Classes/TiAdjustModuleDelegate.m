//
//  TiAdjustModuleDelegate.m
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 18th May 2017.
//  Copyright © 2017-2018 Adjust GmbH. All rights reserved.
//

#import <objc/runtime.h>
#import "TiAdjustModuleDelegate.h"

static dispatch_once_t onceToken;
static TiAdjustModuleDelegate *defaultInstance = nil;

@implementation TiAdjustModuleDelegate

+ (id)getInstanceWithSwizzleOfAttributionCallback:(BOOL)swizzleAttributionCallback
                             eventSuccessCallback:(BOOL)swizzleEventSuccessCallback
                             eventFailureCallback:(BOOL)swizzleEventFailureCallback
                           sessionSuccessCallback:(BOOL)swizzleSessionSuccessCallback
                           sessionFailureCallback:(BOOL)swizzleSessionFailureCallback
                         deferredDeeplinkCallback:(BOOL)swizzleDeferredDeeplinkCallback
                     shouldLaunchDeferredDeeplink:(BOOL)shouldLaunchDeferredDeeplink
                                       withModule:(TiAdjustModule *)module {
    dispatch_once(&onceToken, ^{
        defaultInstance = [[TiAdjustModuleDelegate alloc] init];

        // Do the swizzling where and if needed.
        if (swizzleAttributionCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustAttributionChanged:)
                                        withMethod:@selector(adjustAttributionChangedWannabe:)];
        }
        if (swizzleEventSuccessCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustEventTrackingSucceeded:)
                                        withMethod:@selector(adjustEventTrackingSucceededWannabe:)];
        }
        if (swizzleEventFailureCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustEventTrackingFailed:)
                                        withMethod:@selector(adjustEventTrackingFailedWannabe:)];
        }
        if (swizzleSessionSuccessCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustSessionTrackingSucceeded:)
                                        withMethod:@selector(adjustSessionTrackingSucceededWannabe:)];
        }
        if (swizzleSessionFailureCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustSessionTrackingFailed:)
                                        withMethod:@selector(adjustSessionTrackingFailedWananbe:)];
        }
        if (swizzleDeferredDeeplinkCallback) {
            [defaultInstance swizzleCallbackMethod:@selector(adjustDeeplinkResponse:)
                                        withMethod:@selector(adjustDeeplinkResponseWannabe:)];
        }

        [defaultInstance setShouldLaunchDeferredDeeplink:shouldLaunchDeferredDeeplink];
        [defaultInstance setAdjustModule:module];
    });

    return defaultInstance;
}

+ (void)teardown {
    defaultInstance = nil;
    onceToken = 0;
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
    [self addValueOrEmpty:attribution.trackerToken forKey:@"trackerToken" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.trackerName forKey:@"trackerName" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.network forKey:@"network" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.campaign forKey:@"campaign" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.creative forKey:@"creative" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.adgroup forKey:@"adgroup" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.clickLabel forKey:@"clickLabel" toDictionary:dictionary];
    [self addValueOrEmpty:attribution.adid forKey:@"adid" toDictionary:dictionary];

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
    [self addValueOrEmpty:eventSuccessResponseData.message forKey:@"message" toDictionary:dictionary];
    [self addValueOrEmpty:eventSuccessResponseData.timeStamp forKey:@"timestamp" toDictionary:dictionary];
    [self addValueOrEmpty:eventSuccessResponseData.adid forKey:@"adid" toDictionary:dictionary];
    [self addValueOrEmpty:eventSuccessResponseData.eventToken forKey:@"eventToken" toDictionary:dictionary];
    [self addValueOrEmpty:eventSuccessResponseData.callbackId forKey:@"callbackId" toDictionary:dictionary];
    if (eventSuccessResponseData.jsonResponse != nil) {
        NSData *dataJsonResponse = [NSJSONSerialization dataWithJSONObject:eventSuccessResponseData.jsonResponse options:0 error:nil];
        NSString *stringJsonResponse = [[NSString alloc] initWithBytes:[dataJsonResponse bytes]
                                                                length:[dataJsonResponse length]
                                                              encoding:NSUTF8StringEncoding];
        [dictionary setObject:stringJsonResponse forKey:@"jsonResponse"];
    }

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
    [self addValueOrEmpty:eventFailureResponseData.message forKey:@"message" toDictionary:dictionary];
    [self addValueOrEmpty:eventFailureResponseData.timeStamp forKey:@"timestamp" toDictionary:dictionary];
    [self addValueOrEmpty:eventFailureResponseData.adid forKey:@"adid" toDictionary:dictionary];
    [self addValueOrEmpty:eventFailureResponseData.eventToken forKey:@"eventToken" toDictionary:dictionary];
    [self addValueOrEmpty:eventFailureResponseData.callbackId forKey:@"callbackId" toDictionary:dictionary];
    [self addValueOrEmpty:(eventFailureResponseData.willRetry ? @"true" : @"false") forKey:@"willRetry" toDictionary:dictionary];
    if (eventFailureResponseData.jsonResponse != nil) {
        NSData *dataJsonResponse = [NSJSONSerialization dataWithJSONObject:eventFailureResponseData.jsonResponse options:0 error:nil];
        NSString *stringJsonResponse = [[NSString alloc] initWithBytes:[dataJsonResponse bytes]
                                                                length:[dataJsonResponse length]
                                                              encoding:NSUTF8StringEncoding];
        [dictionary setObject:stringJsonResponse forKey:@"jsonResponse"];
    }

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
    [self addValueOrEmpty:sessionSuccessResponseData.message forKey:@"message" toDictionary:dictionary];
    [self addValueOrEmpty:sessionSuccessResponseData.timeStamp forKey:@"timestamp" toDictionary:dictionary];
    [self addValueOrEmpty:sessionSuccessResponseData.adid forKey:@"adid" toDictionary:dictionary];
    if (sessionSuccessResponseData.jsonResponse != nil) {
        NSData *dataJsonResponse = [NSJSONSerialization dataWithJSONObject:sessionSuccessResponseData.jsonResponse options:0 error:nil];
        NSString *stringJsonResponse = [[NSString alloc] initWithBytes:[dataJsonResponse bytes]
                                                                length:[dataJsonResponse length]
                                                              encoding:NSUTF8StringEncoding];
        [dictionary setObject:stringJsonResponse forKey:@"jsonResponse"];
    }

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
    [self addValueOrEmpty:sessionFailureResponseData.message forKey:@"message" toDictionary:dictionary];
    [self addValueOrEmpty:sessionFailureResponseData.timeStamp forKey:@"timestamp" toDictionary:dictionary];
    [self addValueOrEmpty:sessionFailureResponseData.adid forKey:@"adid" toDictionary:dictionary];
    [self addValueOrEmpty:(sessionFailureResponseData.willRetry ? @"true" : @"false") forKey:@"willRetry" toDictionary:dictionary];
    if (sessionFailureResponseData.jsonResponse != nil) {
        NSData *dataJsonResponse = [NSJSONSerialization dataWithJSONObject:sessionFailureResponseData.jsonResponse options:0 error:nil];
        NSString *stringJsonResponse = [[NSString alloc] initWithBytes:[dataJsonResponse bytes]
                                                                length:[dataJsonResponse length]
                                                              encoding:NSUTF8StringEncoding];
        [dictionary setObject:stringJsonResponse forKey:@"jsonResponse"];
    }

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
                   withMethod:(SEL)swizzledSelector {
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

- (void)addValueOrEmpty:(NSObject *)value
                 forKey:(NSString *)key
           toDictionary:(NSMutableDictionary *)dictionary {
    if (nil != value) {
        [dictionary setObject:[NSString stringWithFormat:@"%@", value] forKey:key];
    } else {
        [dictionary setObject:@"" forKey:key];
    }
}

@end
