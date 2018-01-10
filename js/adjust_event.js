/**
 * adjust_event.js
 * Adjust Sdk
 *
 * Created by Uglješa Erceg (@uerceg) on 18th May 2017.
 * Copyright (c) 2012-2018 Adjust GmbH. All rights reserved.
 */

function AdjustEvent(eventToken) {
    this.eventToken = eventToken;
    this.revenue = undefined;
    this.currency = undefined;
    this.transactionId = undefined;
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

module.exports = AdjustEvent;
