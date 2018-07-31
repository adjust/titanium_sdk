
var _ = require('/alloy/underscore')._,
    Backbone = require('/alloy/backbone'),
    CONST = require('/alloy/constants');

exports.version = '1.12.0';
exports._ = _;
exports.Backbone = Backbone;

var DEFAULT_WIDGET = 'widget';
var TI_VERSION = Ti.version;
var MW320_CHECK = false && TI_VERSION >= '3.2.0';
var IDENTITY_TRANSFORM = true ? Ti.UI.create2DMatrix() : undefined;
var RESET = {
	bottom: null,
	left: null,
	right: null,
	top: null,
	height: null,
	width: null,
	shadowColor: null,
	shadowOffset: null,
	backgroundImage: null,
	backgroundRepeat: null,
	center: null,
	layout: null,
	backgroundSelectedColor: null,
	backgroundSelectedImage: null,

	opacity: 1.0,
	touchEnabled: true,
	enabled: true,
	horizontalWrap: true,
	zIndex: 0,

	backgroundColor: true ? 'transparent' : null,

	font: null,

	visible: true,

	color: true ? '#000' : null,

	transform: true ? IDENTITY_TRANSFORM : null,

	backgroundGradient: !true ? {} : null,

	borderColor: true ? null : 'transparent',

	borderRadius: false ? 0 : null,

	borderWidth: false ? 0 : null
};

if (false) {
	RESET = _.extend(RESET, {
		backgroundLeftCap: 0,
		backgroundTopCap: 0
	});
} else if (true) {
	RESET = _.extend(RESET, {
		backgroundDisabledColor: null,
		backgroundDisabledImage: null,
		backgroundFocusedColor: null,
		backgroundFocusedImage: null,
		focusable: false,
		keepScreenOn: false
	});
}

function ucfirst(text) {
	if (!text) {
		return text;
	}
	return text[0].toUpperCase() + text.substr(1);
}

function addNamespace(apiName) {
	return (CONST.IMPLICIT_NAMESPACES[apiName] || CONST.NAMESPACE_DEFAULT) + '.' + apiName;
}

exports.M = function (name, modelDesc, migrations) {
	var config = (modelDesc || {}).config || {};
	var adapter = config.adapter || {};
	var extendObj = {};
	var extendClass = {};
	var mod;

	if (adapter.type) {
		mod = require('/alloy/sync/' + adapter.type);
		extendObj.sync = function (method, model, opts) {
			return mod.sync(method, model, opts);
		};
	} else {
		extendObj.sync = function (method, model, opts) {
			Ti.API.warn('Execution of ' + method + '#sync() function on a model that does not support persistence');
			Ti.API.warn('model: ' + JSON.stringify(model.toJSON()));
		};
	}
	extendObj.defaults = config.defaults;

	if (migrations) {
		extendClass.migrations = migrations;
	}

	if (mod && _.isFunction(mod.beforeModelCreate)) {
		config = mod.beforeModelCreate(config, name) || config;
	}

	var Model = Backbone.Model.extend(extendObj, extendClass);
	Model.prototype.config = config;

	if (_.isFunction(modelDesc.extendModel)) {
		Model = modelDesc.extendModel(Model) || Model;
	}

	if (mod && _.isFunction(mod.afterModelCreate)) {
		mod.afterModelCreate(Model, name);
	}

	return Model;
};

exports.C = function (name, modelDesc, model) {
	var extendObj = { model: model };
	var config = (model ? model.prototype.config : {}) || {};
	var mod;

	if (config.adapter && config.adapter.type) {
		mod = require('/alloy/sync/' + config.adapter.type);
		extendObj.sync = function (method, model, opts) {
			return mod.sync(method, model, opts);
		};
	} else {
		extendObj.sync = function (method, model, opts) {
			Ti.API.warn('Execution of ' + method + '#sync() function on a collection that does not support persistence');
			Ti.API.warn('model: ' + JSON.stringify(model.toJSON()));
		};
	}

	var Collection = Backbone.Collection.extend(extendObj);
	Collection.prototype.config = config;

	if (_.isFunction(modelDesc.extendCollection)) {
		Collection = modelDesc.extendCollection(Collection) || Collection;
	}

	if (mod && _.isFunction(mod.afterCollectionCreate)) {
		mod.afterCollectionCreate(Collection);
	}

	return Collection;
};

exports.UI = {};
exports.UI.create = function (controller, apiName, opts) {
	opts = opts || {};

	var baseName, ns;
	var parts = apiName.split('.');
	if (parts.length === 1) {
		baseName = apiName;
		ns = opts.ns || CONST.IMPLICIT_NAMESPACES[baseName] || CONST.NAMESPACE_DEFAULT;
	} else if (parts.length > 1) {
		baseName = parts[parts.length - 1];
		ns = parts.slice(0, parts.length - 1).join('.');
	} else {
		throw 'Alloy.UI.create() failed: No API name was given in the second parameter';
	}
	opts.apiName = ns + '.' + baseName;
	baseName = baseName[0].toUpperCase() + baseName.substr(1);

	var style = exports.createStyle(controller, opts);

	return eval(ns)['create' + baseName](style);
};

exports.createStyle = function (controller, opts, defaults) {
	var classes, apiName;

	if (!opts) {
		return {};
	}

	if (_.isArray(opts.classes)) {
		classes = opts.classes.slice(0);
	} else if (_.isString(opts.classes)) {
		classes = opts.classes.split(/\s+/);
	} else {
		classes = [];
	}

	apiName = opts.apiName;
	if (apiName && apiName.indexOf('.') === -1) {
		apiName = addNamespace(apiName);
	}

	var styleArray;
	if (controller && _.isObject(controller)) {
		styleArray = require('/alloy/widgets/' + controller.widgetId + '/styles/' + controller.name);
	} else {
		styleArray = require('/alloy/styles/' + controller);
	}
	var styleFinal = {};

	var i, len;
	for (i = 0, len = styleArray.length; i < len; i++) {
		var style = styleArray[i];

		var styleApi = style.key;
		if (style.isApi && styleApi.indexOf('.') === -1) {
			styleApi = (CONST.IMPLICIT_NAMESPACES[styleApi] || CONST.NAMESPACE_DEFAULT) + '.' + styleApi;
		}

		if (style.isId && opts.id && style.key === opts.id || style.isClass && _.contains(classes, style.key)) {} else if (style.isApi) {
			if (style.key.indexOf('.') === -1) {
				style.key = addNamespace(style.key);
			}
			if (style.key !== apiName) {
				continue;
			}
		} else {
			continue;
		}

		if (style.queries && style.queries.formFactor && !exports[style.queries.formFactor]) {
			continue;
		}

		if (style.queries && style.queries.if && (style.queries.if.trim().toLowerCase() === 'false' || style.queries.if.indexOf('Alloy.Globals') !== -1 && exports.Globals[style.queries.if.split('.')[2]] === false)) {
			continue;
		}

		exports.deepExtend(true, styleFinal, style.style);
	}

	var extraStyle = _.omit(opts, [CONST.CLASS_PROPERTY, CONST.APINAME_PROPERTY]);
	exports.deepExtend(true, styleFinal, extraStyle);
	styleFinal[CONST.CLASS_PROPERTY] = classes;
	styleFinal[CONST.APINAME_PROPERTY] = apiName;

	if (MW320_CHECK) {
		delete styleFinal[CONST.APINAME_PROPERTY];
	}

	return defaults ? _.defaults(styleFinal, defaults) : styleFinal;
};

function processStyle(controller, proxy, classes, opts, defaults) {
	opts = opts || {};
	opts.classes = classes;
	if (proxy.apiName) {
		opts.apiName = proxy.apiName;
	}
	if (proxy.id) {
		opts.id = proxy.id;
	}
	proxy.applyProperties(exports.createStyle(controller, opts, defaults));
	if (true) {
		proxy.classes = classes;
	}
}

exports.addClass = function (controller, proxy, classes, opts) {
	if (!classes) {
		if (opts) {
			if (MW320_CHECK) {
				delete opts.apiName;
			}
			proxy.applyProperties(opts);
		}
		return;
	} else {
		var pClasses = proxy[CONST.CLASS_PROPERTY] || [];
		var beforeLen = pClasses.length;
		classes = _.isString(classes) ? classes.split(/\s+/) : classes;
		var newClasses = _.union(pClasses, classes || []);

		if (beforeLen === newClasses.length) {
			if (opts) {
				if (MW320_CHECK) {
					delete opts.apiName;
				}
				proxy.applyProperties(opts);
			}
			return;
		} else {
			processStyle(controller, proxy, newClasses, opts);
		}
	}
};

exports.removeClass = function (controller, proxy, classes, opts) {
	classes = classes || [];
	var pClasses = proxy[CONST.CLASS_PROPERTY] || [];
	var beforeLen = pClasses.length;

	if (!beforeLen || !classes.length) {
		if (opts) {
			if (MW320_CHECK) {
				delete opts.apiName;
			}
			proxy.applyProperties(opts);
		}
		return;
	} else {
		classes = _.isString(classes) ? classes.split(/\s+/) : classes;
		var newClasses = _.difference(pClasses, classes);

		if (beforeLen === newClasses.length) {
			if (opts) {
				if (MW320_CHECK) {
					delete opts.apiName;
				}
				proxy.applyProperties(opts);
			}
			return;
		} else {
			processStyle(controller, proxy, newClasses, opts, RESET);
		}
	}
};

exports.resetClass = function (controller, proxy, classes, opts) {
	classes = classes || [];
	classes = _.isString(classes) ? classes.split(/\s+/) : classes;
	processStyle(controller, proxy, classes, opts, RESET);
};

exports.createWidget = function (id, name, args) {
	if (typeof name !== 'undefined' && name !== null && _.isObject(name) && !_.isString(name)) {
		args = name;
		name = DEFAULT_WIDGET;
	}
	return new (require('/alloy/widgets/' + id + '/controllers/' + (name || DEFAULT_WIDGET)))(args);
};

exports.createController = function (name, args) {
	return new (require('/alloy/controllers/' + name))(args);
};

exports.createModel = function (name, args) {
	return new (require('/alloy/models/' + ucfirst(name)).Model)(args);
};

exports.createCollection = function (name, args) {
	return new (require('/alloy/models/' + ucfirst(name)).Collection)(args);
};

function isTabletFallback() {
	return Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) >= 700;
}

exports.isTablet = function () {
	if (false) {
		return 'android' === 'ipad';
	} else if (true) {
		var psc = Ti.Platform.Android.physicalSizeCategory;
		return psc === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_LARGE || psc === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_XLARGE;
	} else if (false) {
		return Math.min(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) >= 400;
	} else if (false) {
		return Math.max(Ti.Platform.displayCaps.platformHeight, Ti.Platform.displayCaps.platformWidth) >= 1024;
	} else {
		return isTabletFallback();
	}
}();

exports.isHandheld = !exports.isTablet;

exports.Globals = {};

exports.Models = {};

exports.Models.instance = function (name) {
	return exports.Models[name] || (exports.Models[name] = exports.createModel(name));
};

exports.Collections = {};

exports.Collections.instance = function (name) {
	return exports.Collections[name] || (exports.Collections[name] = exports.createCollection(name));
};

exports.CFG = require('/alloy/CFG');

if (true) {
	exports.Android = {};
	exports.Android.menuItemCreateArgs = ['itemId', 'groupId', 'title', 'order', 'actionView', 'checkable', 'checked', 'enabled', 'icon', 'showAsAction', 'titleCondensed', 'visible'];
}

exports.deepExtend = function () {
	var target = arguments[0] || {};
	var i = 1;
	var length = arguments.length;
	var deep = false;
	var options, name, src, copy, copy_is_array, clone;

	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};

		i = 2;
	}

	if (typeof target !== 'object' && !_.isFunction(target)) {
		target = {};
	}

	for (; i < length; i++) {
		options = arguments[i];
		if (options != null) {
			if (typeof options === 'string') {
				options = options.split('');
			}

			for (name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy && !_.isFunction(copy) && _.isObject(copy) && ((copy_is_array = _.isArray(copy)) || !_.has(copy, 'apiName'))) {
					if (copy_is_array) {
						copy_is_array = false;
						clone = src && _.isArray(src) ? src : [];
					} else if (_.isDate(copy)) {
						clone = new Date(copy.valueOf());
					} else {
						clone = src && _.isObject(src) ? src : {};
					}

					target[name] = exports.deepExtend(deep, clone, copy);
				} else {
					target[name] = copy;
				}
			}
		}
	}

	return target;
};