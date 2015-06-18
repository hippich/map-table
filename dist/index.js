(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['MapTable'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['MapTable'] = factory();
  }
}(this, function () {

var _ = require('lodash');

var MapTable = function MapTable(rules) {
    if (!_.isArray(rules)) {
        throw new Error('rules are required for MapTable.');
    }

    this.rules = [];
    this.cols = [];

    this.init(rules);
};

MapTable.prototype.init = function(rules) {
    rules = _.clone(rules);

    this.match = _.memoize(MapTable.prototype.match);

    this.cols = rules.shift();

    if (! _.isArray(this.cols)) {
        throw new Error('First row of rules array should be array of columns.');
    }

    this.rules = rules;
};

MapTable.prototype.rowToObject = function(row) {
    if (row == null) {
        return null;
    }

    var obj = {};

    this.cols.forEach(function(col, idx) {
        obj[col] = row[idx];
    });

    return obj;
};

MapTable.prototype.matchers = {
    string: function(value, match) {
        return value === match;
    },
    regexp: function(value, match) {
        var parts = match.split('/');
        var re = new RegExp(parts[1], parts[2]);
        return re.exec(value);
    },
    gt: function(value, match) {
        match = match.replace(/^>/, '');
        return value > match;
    },
    lt: function(value, match) {
        match = match.replace(/^</, '');
        return value < match;
    }
};

MapTable.prototype.getTypeOfMatch = function(matchStr) {
    var type = 'string';

    if (matchStr[0] === '/' && matchStr[matchStr.length - 1] === '/') {
        type = 'regexp';
    }
    else if (matchStr[0] === '>') {
        type = 'gt';
    }
    else if (matchStr[0] === '<') {
        type = 'lt';
    }

    return type;
};

MapTable.prototype.match = function(values) {
    if (!_.isObject(values)) {
        throw new Error('values should be object');
    }

    var that = this;

    var matchedRule = null;
    var valueKeys = _.keys(values);

    this.rules.some(function(rule) {
        var match = true;

        valueKeys.some(function(key) {
            var idx = that.cols.indexOf(key);

            // If key is not found in the rules table, assume it is not applicable,
            // and just move on without invalidating match.
            if (idx < 0) {
                return false;
            }

            if (!rule[idx] || rule[idx] !== values[key]) {
                match = false;
                return true;
            }
        });

        if (match) {
            matchedRule = rule;
            return true;
        }
    });

    return this.rowToObject(matchedRule);
};

if (module && module.exports) {
    module.exports = MapTable;
}

return MapTable;

}));
