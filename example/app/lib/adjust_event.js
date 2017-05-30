function AdjustEvent(eventToken) {
    this.eventToken = eventToken;
    this.revenue = null;
    this.currency = null;
    this.transactionId = null;
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