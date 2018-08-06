/**
 * TiAdjustTestModuleAssets.h
 * Adjust SDK
 *
 * Created by Uglješa Erceg (@uerceg) on 6th August 2018.
 * Copyright (c) 2018 Adjust GmbH. All rights reserved.
 */

@interface TiAdjustTestModuleAssets : NSObject {

}

- (NSData *)moduleAsset;
- (NSData *)resolveModuleAsset:(NSString*)path;

@end
