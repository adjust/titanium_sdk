//
//  TiAdjustModuleAssets.h
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 18th May 2017.
//  Copyright © 2017-2019 Adjust GmbH. All rights reserved.
//

@interface TiAdjustModuleAssets : NSObject {}

- (NSData *)moduleAsset;
- (NSData *)resolveModuleAsset:(NSString *)path;

@end
