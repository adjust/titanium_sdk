/**
 * TiAdjustModuleAssets.h
 * Adjust Sdk
 *
 * Created by Uglješa Erceg (@uerceg) on 18th May 2017.
 * Copyright (c) 2012-2018 GmbH. All rights reserved.
 */

@interface TiAdjustModuleAssets : NSObject {

}

- (NSData *)moduleAsset;
- (NSData *)resolveModuleAsset:(NSString*)path;

@end
