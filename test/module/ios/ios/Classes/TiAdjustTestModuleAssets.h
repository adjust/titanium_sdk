//
//  TiAdjustTestModuleAssets.h
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 6th August 2018.
//  Copyright © 2018-2019 Adjust GmbH. All rights reserved.
//

@interface TiAdjustTestModuleAssets : NSObject {}

- (NSData *)moduleAsset;
- (NSData *)resolveModuleAsset:(NSString *)path;

@end
