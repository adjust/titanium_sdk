var _ = require('/alloy/underscore')._,
    backbone = require('/alloy/backbone');

var ALLOY_DB_DEFAULT = '_alloy_';
var ALLOY_ID_DEFAULT = 'alloy_id';

function S4() {
	return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

var cache = {
	config: {},
	Model: {}
};

function Migrator(config, transactionDb) {
	this.db = transactionDb;
	this.dbname = config.adapter.db_name;
	this.table = config.adapter.collection_name;
	this.idAttribute = config.adapter.idAttribute;

	this.column = function (name) {
		var parts = name.split(/\s+/);
		var type = parts[0];
		switch (type.toLowerCase()) {
			case 'string':
			case 'varchar':
			case 'date':
			case 'datetime':
				Ti.API.warn('"' + type + '" is not a valid sqlite field, using TEXT instead');
			case 'text':
				type = 'TEXT';
				break;
			case 'int':
			case 'tinyint':
			case 'smallint':
			case 'bigint':
			case 'boolean':
				Ti.API.warn('"' + type + '" is not a valid sqlite field, using INTEGER instead');
			case 'integer':
				type = 'INTEGER';
				break;
			case 'double':
			case 'float':
			case 'decimal':
			case 'number':
				Ti.API.warn('"' + name + '" is not a valid sqlite field, using REAL instead');
			case 'real':
				type = 'REAL';
				break;
			case 'blob':
				type = 'BLOB';
				break;
			case 'null':
				type = 'NULL';
				break;
			default:
				type = 'TEXT';
				break;
		}
		parts[0] = type;
		return parts.join(' ');
	};

	this.createTable = function (config) {
		var columns = [];
		var found = false;
		for (var k in config.columns) {
			if (k === this.idAttribute) {
				found = true;
			}
			columns.push(k + ' ' + this.column(config.columns[k]));
		}

		if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
			columns.push(ALLOY_ID_DEFAULT + ' TEXT UNIQUE');
		}
		var sql = 'CREATE TABLE IF NOT EXISTS ' + this.table + ' ( ' + columns.join(',') + ')';

		this.db.execute(sql);
	};

	this.dropTable = function () {
		this.db.execute('DROP TABLE IF EXISTS ' + this.table);
	};

	this.insertRow = function (columnValues) {
		var columns = [];
		var values = [];
		var qs = [];

		var found = false;
		for (var key in columnValues) {
			if (key === this.idAttribute) {
				found = true;
			}
			columns.push(key);
			values.push(columnValues[key]);
			qs.push('?');
		}

		if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
			columns.push(this.idAttribute);
			values.push(guid());
			qs.push('?');
		}

		this.db.execute('INSERT INTO ' + this.table + ' (' + columns.join(',') + ') VALUES (' + qs.join(',') + ');', values);
	};

	this.deleteRow = function (columns) {
		var sql = 'DELETE FROM ' + this.table;
		var keys = _.keys(columns);
		var len = keys.length;
		var conditions = [];
		var values = [];

		if (len) {
			sql += ' WHERE ';
		}
		for (var i = 0; i < len; i++) {
			conditions.push(keys[i] + ' = ?');
			values.push(columns[keys[i]]);
		}
		sql += conditions.join(' AND ');

		this.db.execute(sql, values);
	};
}

function Sync(method, model, opts) {
	var table = model.config.adapter.collection_name,
	    columns = model.config.columns,
	    dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT,
	    resp = null,
	    db,
	    sql;

	switch (method) {
		case 'create':
		case 'update':
			resp = function () {
				var attrObj = {};

				if (!model.id) {
					model.id = model.idAttribute === ALLOY_ID_DEFAULT ? guid() : null;
					attrObj[model.idAttribute] = model.id;
					backbone.VERSION === '0.9.2' ? model.set(attrObj, { silent: true }) : model.set(attrObj);
				}

				var names = [],
				    values = [],
				    q = [];
				for (var k in columns) {
					names.push(k);
					values.push(model.get(k));
					q.push('?');
				}

				sql = 'REPLACE INTO ' + table + ' (' + names.join(',') + ') VALUES (' + q.join(',') + ');';
				db = Ti.Database.open(dbName);
				db.execute(sql, values);

				if (model.id === null) {
					model.id = db.lastInsertRowId;
					attrObj[model.idAttribute] = model.id;
					backbone.VERSION === '0.9.2' ? model.set(attrObj, { silent: true }) : model.set(attrObj);
				}

				db.close();

				return model.toJSON();
			}();
			break;

		case 'read':
			if (opts.query && opts.id) {
				Ti.API.warn('Both "query" and "id" options were specified for model.fetch(). "id" will be ignored.');
			}

			sql = 'SELECT * FROM ' + table;
			if (opts.query) {
				sql = opts.query;
			} else if (opts.id) {
				sql += ' WHERE ' + (model.idAttribute ? model.idAttribute : ALLOY_ID_DEFAULT) + ' = ' + (_.isString(opts.id) ? '"' + opts.id + '"' : opts.id);
			}

			db = Ti.Database.open(dbName);
			var rs;

			if (_.isString(sql)) {
				rs = db.execute(sql);
			} else {
				rs = db.execute(sql.statement, sql.params);
			}

			var values = [];
			var fieldNames = [];
			var fieldCount = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;
			var getField = true || false ? rs.field.bind(rs) : rs.field;
			var i = 0;

			for (; i < fieldCount; i++) {
				fieldNames.push(rs.fieldName(i));
			}

			while (rs.isValidRow()) {
				var o = {};
				for (i = 0; i < fieldCount; i++) {
					o[fieldNames[i]] = getField(i);
				}
				values.push(o);
				rs.next();
			}

			rs.close();
			db.close();

			var len = values.length;

			if (backbone.VERSION === '0.9.2') {
				model.length = len;
			}

			resp = len === 1 ? values[0] : values;
			break;

		case 'delete':
			sql = 'DELETE FROM ' + table + ' WHERE ' + model.idAttribute + '=?';

			db = Ti.Database.open(dbName);
			db.execute(sql, model.id);
			db.close();

			resp = model.toJSON();
			break;
	}

	if (resp) {
		if (_.isFunction(opts.success)) {
			opts.success(resp);
		}
		if (method === 'read' && !opts.silent) {
			model.trigger('fetch', { fromAdapter: true });
		}
	} else {
		if (_.isFunction(opts.error)) {
			opts.error(resp);
		}
	}
}

function GetMigrationFor(dbname, table) {
	var mid = null;
	var db = Ti.Database.open(dbname);
	db.execute('CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT);');
	var rs = db.execute('SELECT latest FROM migrations where model = ?;', table);
	if (rs.isValidRow()) {
		mid = rs.field(0) + '';
	}
	rs.close();
	db.close();
	return mid;
}

function Migrate(Model) {
	var migrations = Model.migrations || [];

	var lastMigration = {};
	if (migrations.length) {
		migrations[migrations.length - 1](lastMigration);
	}

	var config = Model.prototype.config;

	config.adapter.db_name = config.adapter.db_name || ALLOY_DB_DEFAULT;
	var migrator = new Migrator(config);

	var targetNumber = typeof config.adapter.migration === 'undefined' || config.adapter.migration === null ? lastMigration.id : config.adapter.migration;
	if (typeof targetNumber === 'undefined' || targetNumber === null) {
		var tmpDb = Ti.Database.open(config.adapter.db_name);
		migrator.db = tmpDb;
		migrator.createTable(config);
		tmpDb.close();
		return;
	}
	targetNumber = targetNumber + '';
	var currentNumber = GetMigrationFor(config.adapter.db_name, config.adapter.collection_name);

	var direction;
	if (currentNumber === targetNumber) {
		return;
	} else if (currentNumber && currentNumber > targetNumber) {
		direction = 0;
		migrations.reverse();
	} else {
		direction = 1;
	}

	db = Ti.Database.open(config.adapter.db_name);
	migrator.db = db;
	db.execute('BEGIN;');

	if (migrations.length) {
		for (var i = 0; i < migrations.length; i++) {
			var migration = migrations[i];
			var context = {};
			migration(context);

			if (direction) {
				if (context.id > targetNumber) {
					break;
				}
				if (context.id <= currentNumber) {
					continue;
				}
			} else {
				if (context.id <= targetNumber) {
					break;
				}
				if (context.id > currentNumber) {
					continue;
				}
			}

			var funcName = direction ? 'up' : 'down';
			if (_.isFunction(context[funcName])) {
				context[funcName](migrator, config);
			}
		}
	} else {
		migrator.createTable(config);
	}

	db.execute('DELETE FROM migrations where model = ?', config.adapter.collection_name);
	db.execute('INSERT INTO migrations VALUES (?,?)', targetNumber, config.adapter.collection_name);

	db.execute('COMMIT;');
	db.close();
	migrator.db = null;
}

function installDatabase(config) {
	var dbFile = _.isFunction(config.adapter.db_file) ? config.adapter.db_file(config) : config.adapter.db_file;
	var table = config.adapter.collection_name;

	var rx = /(^|.*\/)([^\/]+)\.[^\/]+$/;
	var match = dbFile.match(rx);
	if (match === null) {
		throw 'Invalid sql database filename "' + dbFile + '"';
	}

	config.adapter.db_name = config.adapter.db_name || match[2];
	var dbName = config.adapter.db_name;

	Ti.API.debug('Installing sql database "' + dbFile + '" with name "' + dbName + '"');
	var db = Ti.Database.install(dbFile, dbName);

	if (config.adapter.remoteBackup === false && false) {
		Ti.API.debug('iCloud "do not backup" flag set for database "' + dbFile + '"');
		db.file.setRemoteBackup(false);
	}

	var rs = db.execute('pragma table_info("' + table + '");');
	var columns = {},
	    cName,
	    cType;
	if (rs) {
		while (rs.isValidRow()) {
			cName = rs.fieldByName('name');
			cType = rs.fieldByName('type');
			columns[cName] = cType;

			if (cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute) {
				config.adapter.idAttribute = ALLOY_ID_DEFAULT;
			}

			rs.next();
		}
		rs.close();
	}
	if (Object.keys(columns).length === 0) {
		var idAttribute = config.adapter.idAttribute ? config.adapter.idAttribute : ALLOY_ID_DEFAULT;
		for (var k in config.columns) {
			cName = k;
			cType = config.columns[k];

			if (cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute) {
				config.adapter.idAttribute = ALLOY_ID_DEFAULT;
			} else if (k === config.adapter.idAttribute) {
				cType += ' UNIQUE';
			}
			columns[cName] = cType;
		}
	}
	config.columns = columns;

	if (config.adapter.idAttribute) {
		if (!_.contains(_.keys(config.columns), config.adapter.idAttribute)) {
			throw 'config.adapter.idAttribute "' + config.adapter.idAttribute + '" not found in list of columns for table "' + table + '"\n' + 'columns: [' + _.keys(config.columns).join(',') + ']';
		}
	} else {
		Ti.API.info('No config.adapter.idAttribute specified for table "' + table + '"');
		Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');

		var fullStrings = [],
		    colStrings = [];
		_.each(config.columns, function (type, name) {
			colStrings.push(name);
			fullStrings.push(name + ' ' + type);
		});
		var colsString = colStrings.join(',');
		db.execute('ALTER TABLE ' + table + ' RENAME TO ' + table + '_temp;');
		db.execute('CREATE TABLE ' + table + '(' + fullStrings.join(',') + ',' + ALLOY_ID_DEFAULT + ' TEXT UNIQUE);');
		db.execute('INSERT INTO ' + table + '(' + colsString + ',' + ALLOY_ID_DEFAULT + ') SELECT ' + colsString + ',CAST(_ROWID_ AS TEXT) FROM ' + table + '_temp;');
		db.execute('DROP TABLE ' + table + '_temp;');
		config.columns[ALLOY_ID_DEFAULT] = 'TEXT UNIQUE';
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}

	db.close();
}

module.exports.beforeModelCreate = function (config, name) {
	if (cache.config[name]) {
		return cache.config[name];
	}

	if ('android' === 'mobileweb' || typeof Ti.Database === 'undefined') {
		throw 'No support for Titanium.Database in MobileWeb environment.';
	}

	if (config.adapter.db_file) {
		installDatabase(config);
	}
	if (!config.adapter.idAttribute) {
		Ti.API.info('No config.adapter.idAttribute specified for table "' + config.adapter.collection_name + '"');
		Ti.API.info('Adding "' + ALLOY_ID_DEFAULT + '" to uniquely identify rows');
		config.columns[ALLOY_ID_DEFAULT] = 'TEXT UNIQUE';
		config.adapter.idAttribute = ALLOY_ID_DEFAULT;
	}

	cache.config[name] = config;

	return config;
};

module.exports.afterModelCreate = function (Model, name) {
	if (cache.Model[name]) {
		return cache.Model[name];
	}

	Model = Model || {};
	Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
	Migrate(Model);

	cache.Model[name] = Model;

	return Model;
};

module.exports.sync = Sync;