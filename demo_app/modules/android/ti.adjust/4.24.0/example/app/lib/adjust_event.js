//
//  adjust_event.js
//  Adjust SDK
//
//  Created by Uglješa Erceg (@uerceg) on 18th May 2017.
//  Copyright © 2017-2019 Adjust GmbH. All rights reserved.
//

function AdjustEvent(eventToken) {
    this.eventToken = eventToken;
    this.revenue = undefined;
    this.currency = undefined;
    this.transactionId = undefined;
    this.callbackId = undefined;
    this.callbackParameters = {};
    this.partnerParameters = {};
}

AdjustEvent.prototype.setRevenue = function(revenue, currency) {
    this.revenue = revenue;
    this.currency = currency;
};

AdjustEvent.prototype.addCallbackParameter = function(key, value) {
    this.callbackParameters[key] = value;
};

AdjustEvent.prototype.addPartnerParameter = function(key, value) {
    this.partnerParameters[key] = value;
};

AdjustEvent.prototype.setTransactionId = function(transactionId) {
    this.transactionId = transactionId;
};

AdjustEvent.prototype.setCallbackId = function(callbackId) {
    this.callbackId = callbackId;
};

module.exports = AdjustEvent;
