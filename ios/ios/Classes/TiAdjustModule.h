/**
 * TiAdjustModule.h
 * Adjust Sdk
 *
 * Created by Uglješa Erceg (@uerceg) on 18th May 2017.
 * Copyright (c) 2012-2018 GmbH. All rights reserved.
 */

#import <AdjustSdk/Adjust.h>

#import "TiModule.h"

@interface TiAdjustModule : TiModule

@property (nonatomic, assign) KrollCallback *jsAttributionCallback;
@property (nonatomic, assign) KrollCallback *jsSessionSuccessCallback;
@property (nonatomic, assign) KrollCallback *jsSessionFailureCallback;
@property (nonatomic, assign) KrollCallback *jsEventSuccessCallback;
@property (nonatomic, assign) KrollCallback *jsEventFailureCallback;
@property (nonatomic, assign) KrollCallback *jsDeferredDeeplinkCallback;

@end

