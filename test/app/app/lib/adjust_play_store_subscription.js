//
//  adjust_play_store_subscription.js
//  Adjust SDK
//
//  Created by Uglješa Erceg (@ugi) on 2nd September 2020.
//  Copyright © 2017-2020 Adjust GmbH. All rights reserved.
//

function AdjustPlayStoreSubscription(price, currency, sku, orderId, signature, purchaseToken) {
    this.price = price;
    this.currency = currency;
    this.sku = sku;
    this.orderId = orderId;
    this.signature = signature;
    this.purchaseToken = purchaseToken;
    this.purchaseTime = undefined;
    this.callbackParameters = {};
    this.partnerParameters = {};
}

AdjustPlayStoreSubscription.prototype.setPurchaseTime = function(purchaseTime) {
    this.purchaseTime = purchaseTime;
};

AdjustPlayStoreSubscription.prototype.addCallbackParameter = function(key, value) {
    this.callbackParameters[key] = value;
};

AdjustPlayStoreSubscription.prototype.addPartnerParameter = function(key, value) {
    this.partnerParameters[key] = value;
};

module.exports = AdjustPlayStoreSubscription;
