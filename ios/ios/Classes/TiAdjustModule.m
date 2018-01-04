/**
 * TiAdjustModule.m
 * Adjust Sdk
 *
 * Created by Uglješa Erceg (@uerceg) on 18th May 2017.
 * Copyright (c) 2012-2018 GmbH. All rights reserved.
 */

#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"

#import "TiAdjustModule.h"
#import "TiAdjustModuleDelegate.h"

@implementation TiAdjustModule

#pragma mark - Internal

// This is generated for your module, please do not change it
- (id)moduleGUID {
    return @"4cf76f14-c96e-49e7-91c2-5136c790c39e";
}

// This is generated for your module, please do not change it
- (NSString *)moduleId {
    return @"ti.adjust";
}

#pragma mark - Lifecycle

- (void)startup {
    // This method is called when the module is first loaded
    // You *must* call the superclass
    [super startup];
    
    NSLog(@"[INFO] %@ loaded",self);
}

#pragma mark - Cleanup

- (void)dealloc {
    // Release any resources that have been retained by the module
    [super dealloc];
}

#pragma mark - Internal Memory Management

- (void)didReceiveMemoryWarning:(NSNotification *)notification {
    // Optionally release any resources that can be dynamically
    // reloaded once memory is available - such as caches
    [super didReceiveMemoryWarning:notification];
}


#pragma - Public APIs

- (void)start:(id)args {
    NSArray *configArray = (NSArray *)args;
    NSDictionary *params = (NSDictionary *)[configArray objectAtIndex:0];
    
    NSString *appToken              = [params objectForKey:@"appToken"];
    NSString *environment           = [params objectForKey:@"environment"];

    NSString *logLevel              = [params objectForKey:@"logLevel"];
    NSString *sdkPrefix             = [params objectForKey:@"sdkPrefix"];
    NSString *userAgent             = [params objectForKey:@"userAgent"];
    NSString *defaultTracker        = [params objectForKey:@"defaultTracker"];

    NSNumber *delayStart            = [params objectForKey:@"delayStart"];
    NSNumber *sendInBackground      = [params objectForKey:@"sendInBackground"];
    NSNumber *shouldLaunchDeeplink  = [params objectForKey:@"shouldLaunchDeeplink"];
    NSNumber *eventBufferingEnabled = [params objectForKey:@"eventBufferingEnabled"];
    NSString *isDeviceKnown         = [params objectForKey:@"isDeviceKnown"];

    NSString *secretId_str          = [params objectForKey:@"secretId"];
    NSString *info1_str             = [params objectForKey:@"info1"];
    NSString *info2_str             = [params objectForKey:@"info2"];
    NSString *info3_str             = [params objectForKey:@"info3"];
    NSString *info4_str             = [params objectForKey:@"info4"];
    
    self.jsAttributionCallback      = [[params objectForKey:@"attributionCallback"] retain];
    self.jsSessionSuccessCallback   = [[params objectForKey:@"sessionSuccessCallback"] retain];
    self.jsSessionFailureCallback   = [[params objectForKey:@"sessionFailureCallback"] retain];
    self.jsEventSuccessCallback     = [[params objectForKey:@"eventSuccessCallback"] retain];
    self.jsEventFailureCallback     = [[params objectForKey:@"eventFailureCallback"] retain];
    self.jsDeferredDeeplinkCallback = [[params objectForKey:@"deferredDeeplinkCallback"] retain];
    
    BOOL allowSuppressLogLevel = NO;
    
    if ([self isFieldValid:logLevel]) {
        if ([logLevel isEqualToString:@"SUPPRESS"]) {
            allowSuppressLogLevel = YES;
        }
    }
    
    ADJConfig *adjustConfig = [ADJConfig configWithAppToken:appToken environment:environment allowSuppressLogLevel:allowSuppressLogLevel];
    
    if ([adjustConfig isValid]) {
        // Log level
        if ([self isFieldValid:logLevel]) {
            [adjustConfig setLogLevel:[ADJLogger logLevelFromString:[logLevel lowercaseString]]];
        }
        
        // Event buffering
        if ([self isFieldValid:eventBufferingEnabled]) {
            [adjustConfig setEventBufferingEnabled:[eventBufferingEnabled boolValue]];
        }
        
        // SDK prefix
        if ([self isFieldValid:sdkPrefix]) {
            [adjustConfig setSdkPrefix:sdkPrefix];
        }
        
        // Default tracker
        if ([self isFieldValid:defaultTracker]) {
            [adjustConfig setDefaultTracker:defaultTracker];
        }
        
        // Send in background
        if ([self isFieldValid:sendInBackground]) {
            [adjustConfig setSendInBackground:[sendInBackground boolValue]];
        }
        
        // User agent
        if ([self isFieldValid:userAgent]) {
            [adjustConfig setUserAgent:userAgent];
        }
        
        // Delay start
        if ([self isFieldValid:delayStart]) {
            [adjustConfig setDelayStart:[delayStart doubleValue]];
        }

        // App Secret
        if ([self isFieldValid:secretId_str]
            && [self isFieldValid:info1_str]
            && [self isFieldValid:info2_str]
            && [self isFieldValid:info3_str]
            && [self isFieldValid:info4_str]
            ) {
            NSNumber *secretId = [NSNumber numberWithLongLong: [secretId_str longLongValue]];
            NSNumber *info1 = [NSNumber numberWithLongLong: [info1_str longLongValue]];
            NSNumber *info2 = [NSNumber numberWithLongLong: [info2_str longLongValue]];
            NSNumber *info3 = [NSNumber numberWithLongLong: [info3_str longLongValue]];
            NSNumber *info4 = [NSNumber numberWithLongLong: [info4_str longLongValue]];

            [adjustConfig setAppSecret:secretId.unsignedIntegerValue
                                info1:info1.unsignedIntegerValue
                                 info2:info2.unsignedIntegerValue
                                 info3:info3.unsignedIntegerValue
                                 info4:info4.unsignedIntegerValue];
        }

        // is device known
        if ([self isFieldValid:isDeviceKnown]) {
            [adjustConfig setIsDeviceKnown:[isDeviceKnown boolValue]];
        }

        // User defined callbacks
        BOOL isAttributionCallbackImplemented = self.jsAttributionCallback != nil ? YES : NO;
        BOOL isEventSuccessCallbackImplemented = self.jsEventSuccessCallback != nil ? YES : NO;
        BOOL isEventFailureCallbackImplemented = self.jsEventFailureCallback != nil ? YES : NO;
        BOOL isSessionSuccessCallbackImplemented = self.jsSessionSuccessCallback != nil ? YES : NO;
        BOOL isSessionFailureCallbackImplemented = self.jsSessionFailureCallback != nil ? YES : NO;
        BOOL isDeferredDeeplinkCallbackImplemented = self.jsDeferredDeeplinkCallback != nil ? YES : NO;
        BOOL shouldLaunchDeferredDeeplink = [self isFieldValid:shouldLaunchDeeplink] ? [shouldLaunchDeeplink boolValue] : YES;
        
        // Attribution delegate & other delegates
        if (isAttributionCallbackImplemented ||
            isEventSuccessCallbackImplemented ||
            isEventFailureCallbackImplemented ||
            isSessionSuccessCallbackImplemented ||
            isSessionFailureCallbackImplemented ||
            isDeferredDeeplinkCallbackImplemented) {
            [adjustConfig setDelegate:
             [TiAdjustModuleDelegate getInstanceWithSwizzleOfAttributionCallback:isAttributionCallbackImplemented
                                                            eventSuccessCallback:isEventSuccessCallbackImplemented
                                                            eventFailureCallback:isEventFailureCallbackImplemented
                                                          sessionSuccessCallback:isSessionSuccessCallbackImplemented
                                                          sessionFailureCallback:isSessionFailureCallbackImplemented
                                                        deferredDeeplinkCallback:isDeferredDeeplinkCallbackImplemented
                                                    shouldLaunchDeferredDeeplink:shouldLaunchDeferredDeeplink
                                                                      withModule:self]];
        }
        
        [Adjust appDidLaunch:adjustConfig];
        [Adjust trackSubsessionStart];
    }
}

- (void)trackEvent:(id)args {
    NSArray *configArray = (NSArray *)args;
    NSDictionary *params = (NSDictionary *)[configArray objectAtIndex:0];
    
    NSString *eventToken = [params objectForKey:@"eventToken"];
    NSString *revenue = [params objectForKey:@"revenue"];
    NSString *currency = [params objectForKey:@"currency"];
    NSString *transactionId = [params objectForKey:@"transactionId"];
    
    NSDictionary *callbackParameters = [params objectForKey:@"callbackParameters"];
    NSDictionary *partnerParameters = [params objectForKey:@"partnerParameters"];
    
    ADJEvent *adjustEvent = [ADJEvent eventWithEventToken:eventToken];
    
    if ([adjustEvent isValid]) {
        if ([self isFieldValid:revenue]) {
            double revenueValue = [revenue doubleValue];
            
            [adjustEvent setRevenue:revenueValue currency:currency];
        }
        
        if ([self isFieldValid:callbackParameters]) {
            for (NSString *key in callbackParameters) {
                NSString *value = [callbackParameters objectForKey:key];
                
                [adjustEvent addCallbackParameter:key value:value];
            }
        }
        
        if ([self isFieldValid:partnerParameters]) {
            for (NSString *key in partnerParameters) {
                NSString *value = [partnerParameters objectForKey:key];
                
                [adjustEvent addPartnerParameter:key value:value];
            }
        }
        
        if ([self isFieldValid:transactionId]) {
            [adjustEvent setTransactionId:transactionId];
        }
        
        [Adjust trackEvent:adjustEvent];
    }
}

- (void)setOfflineMode:(id)args {
    NSNumber *isOffline = args;
    
    if (![self isFieldValid:isOffline]) {
        return;
    }
    
    [Adjust setOfflineMode:[isOffline boolValue]];
}

- (void)setEnabled:(id)args {
    NSNumber *isEnabled = args;
    
    if (![self isFieldValid:isEnabled]) {
        return;
    }
    
    [Adjust setEnabled:[isEnabled boolValue]];
}

- (void)setPushToken:(id)args {
    NSString *pushToken = args;
    
    if (![self isFieldValid:pushToken]) {
        return;
    }
    
    [Adjust setDeviceToken:[pushToken dataUsingEncoding:NSUTF8StringEncoding]];
}

- (void)sendFirstPackages:(id)args {
    [Adjust sendFirstPackages];
}

- (void)addSessionCallbackParameter:(id)args {
    NSArray *arrayArgs = (NSArray *)args;
    NSString *key = [args objectAtIndex:0];
    NSString *value = [args objectAtIndex:1];
    
    [Adjust addSessionCallbackParameter:key value:value];
}

- (void)removeSessionCallbackParameter:(id)args {
    NSArray *arrayArgs = (NSArray *)args;
    NSString *key = [args objectAtIndex:0];
    
    [Adjust removeSessionCallbackParameter:key];
}

- (void)resetSessionCallbackParameters:(id)args {
    [Adjust resetSessionCallbackParameters];
}

- (void)addSessionPartnerParameter:(id)args {
    NSArray *arrayArgs = (NSArray *)args;
    NSString *key = [args objectAtIndex:0];
    NSString *value = [args objectAtIndex:1];
    
    [Adjust addSessionPartnerParameter:key value:value];
}

- (void)removeSessionPartnerParameter:(id)args {
    NSArray *arrayArgs = (NSArray *)args;
    NSString *key = [args objectAtIndex:0];
    
    [Adjust removeSessionPartnerParameter:key];
}

- (void)resetSessionPartnerParameters:(id)args {
    [Adjust resetSessionPartnerParameters];
}

- (void)appWillOpenUrl:(id)args {
    NSArray *arrayArgs = (NSArray *)args;
    NSString *urlString = [args objectAtIndex:0];
    
    if (urlString == nil) {
        return;
    }
    
    NSURL *url = [NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
    
    [Adjust appWillOpenUrl:url];
}

- (void)isEnabled:(id)args {
    BOOL isEnabled = [Adjust isEnabled];
    KrollCallback *callback = [args objectAtIndex:0];
    NSArray *array = [NSArray arrayWithObjects:[NSNumber numberWithBool:isEnabled], nil];
    
    [callback call:array thisObject:nil];
}

- (void)getIdfa:(id)args {
    NSString *idfa = [Adjust idfa];
    KrollCallback *callback = [args objectAtIndex:0];
    NSArray *array = [NSArray arrayWithObjects:(nil != idfa ? idfa : @""), nil];
    
    [callback call:array thisObject:nil];
}

- (void)getAdid:(id)args {
    NSString *adid = [Adjust adid];
    KrollCallback *callback = [args objectAtIndex:0];
    NSArray *array = [NSArray arrayWithObjects:(nil != adid ? adid : @""), nil];
    
    [callback call:array thisObject:nil];
}

- (void)getAttribution:(id)args {
    ADJAttribution *attribution = [Adjust attribution];
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    
    [self addValueOrEmpty:dictionary key:@"trackerToken" value:attribution.trackerToken];
    [self addValueOrEmpty:dictionary key:@"trackerName" value:attribution.trackerName];
    [self addValueOrEmpty:dictionary key:@"network" value:attribution.network];
    [self addValueOrEmpty:dictionary key:@"campaign" value:attribution.campaign];
    [self addValueOrEmpty:dictionary key:@"creative" value:attribution.creative];
    [self addValueOrEmpty:dictionary key:@"adgroup" value:attribution.adgroup];
    [self addValueOrEmpty:dictionary key:@"clickLabel" value:attribution.clickLabel];
    [self addValueOrEmpty:dictionary key:@"adid" value:attribution.adid];
    
    KrollCallback *callback = [args objectAtIndex:0];
    NSArray *array = [NSArray arrayWithObjects:dictionary, nil];
    
    [callback call:array thisObject:nil];
}

- (void)getGoogleAdId:(id)args {
    KrollCallback *callback = [args objectAtIndex:0];
    NSArray *array = [NSArray arrayWithObjects:@"", nil];
    
    [callback call:array thisObject:nil];
}

- (void)getAmazonAdId:(id)args {
    KrollCallback *callback = [args objectAtIndex:0];
    NSArray *array = [NSArray arrayWithObjects:@"", nil];
    
    [callback call:array thisObject:nil];
}

- (void)onResume:(id)args {
    
}

- (void)onPause:(id)args {
    
}

- (void)setReferrer:(id)args {

}

- (BOOL)isFieldValid:(NSObject *)field {
    if (![field isKindOfClass:[NSNull class]]) {
        if (nil != field) {
            return YES;
        }
    }
    
    return NO;
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

