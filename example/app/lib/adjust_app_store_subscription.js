//
//  adjust_app_store_subscription.js
//  Adjust SDK
//
//  Created by Uglješa Erceg (@ugi) on 2nd September 2020.
//  Copyright © 2017-2020 Adjust GmbH. All rights reserved.
//

function AdjustAppStoreSubscription(price, currency, transactionId, receipt) {
    this.price = price;
    this.currency = currency;
    this.transactionId = transactionId;
    this.receipt = receipt;
    this.transactionDate = undefined;
    this.salesRegion = undefined;
    this.callbackParameters = {};
    this.partnerParameters = {};
}

AdjustAppStoreSubscription.prototype.setTransactionDate = function(transactionDate) {
    this.transactionDate = transactionDate;
};

AdjustAppStoreSubscription.prototype.setSalesRegion = function(salesRegion) {
    this.salesRegion = salesRegion;
};

AdjustAppStoreSubscription.prototype.addCallbackParameter = function(key, value) {
    this.callbackParameters[key] = value;
};

AdjustAppStoreSubscription.prototype.addPartnerParameter = function(key, value) {
    this.partnerParameters[key] = value;
};

module.exports = AdjustAppStoreSubscription;
