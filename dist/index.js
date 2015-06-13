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

    this.rules = rules;
    this.init();
};

MapTable.prototype.init = function() {
    this.match = _.memoize(MapTable.prototype.match);
};

MapTable.prototype.match = function(values) {
    if (!_.isObject(values)) {
        throw new Error('values should be object');
    }

    var matchedRule = null;
    var valueKeys = _.keys(values);

    this.rules.some(function(rule) {
        var match = true;

        valueKeys.some(function(key) {
            if (!rule[key] || rule[key] !== values[key]) {
                match = false;
                return true;
            }
        });

        if (match) {
            matchedRule = rule;
            return true;
        }
    });

    return matchedRule;
};

if (module && module.exports) {
    module.exports = MapTable;
}

return MapTable;

}));
