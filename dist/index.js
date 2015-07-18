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

/* global MapTable:true */

/**
 * Instantiate MapTable.
 *
 * options:
 * - optionalKeys: array of optional keys when searching for match.
 * - matchCb: callback called on each matchRule call with rule, values and result.
 */
MapTable = function MapTable(rules, options) {
    if (! Array.isArray(rules)) {
        throw new Error('rules are required for MapTable.');
    }

    this.options = options;
    this.init(rules, options);
};

/**
 * (Re-)Init rules engine. Called during instance creation. But also can be called
 * to apply new rules.
 */
MapTable.prototype.init = function(rules, options) {
    this.rules = [];

    if (! options) {
        options = {};
    }

    if (options.optionalKeys) {
        this.optionalKeys = options.optionalKeys;
    }
    else {
        this.optionalKeys = [];
    }

    // Rules expected to be defined with first row containing columns names
    this.cols = [].concat(rules[0]);

    // Next we iterate over left rules rows, and make a copy only of rows
    // where at least one column has non-null/undefined value
    for (var i = 1; i < rules.length; i++) {
        var skip = true;

        for (var j = 0; j < rules[i].length; j++) {
            if (rules[i][j] != null) {
                skip = false;
                break;
            }
        }

        if (! skip) {
            this.rules.push([].concat(rules[i]));
        }
    }

    this.match = MapTable.prototype.match;
};

/**
 * Converts row array to object using columns array.
 */
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

/**
 * Available matchers:
 *
 * - **string** - simple match. Case sensitive.
 * - **regexp** - Tries to convert passed string to RegExp and use it to match passed value.
 * - **gt** - simple greater-then matcher. Uses strings like `>19.12`
 * - **lt** - similar to greater-then, less-then matcher. Uses strings like `<123.12`
 */
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

/**
 * Deduct type of the match based on the string.
 */
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

/**
 * Match function. This is used to do actual values match.
 *
 * @param values - Object, with keys matching columns names.
 * @param options - Match-specific options:
 *                    - `optionalKeys` - allows to specify which keys can be optional during this match.
 *                    - `matchCb` - specify match callback.
 */
MapTable.prototype.match = function(values, options) {
    if (values !== null && typeof values !== 'object') {
        throw new Error('values should be object');
    }

    if (! options) {
        options = {};
    }

    var that = this;
    var optionalKeys = this.optionalKeys.concat( options.optionalKeys || [] );
    var matchedRule = null;

    this.rules.some(function(rule) {
        matchedRule = that.matchRule(rule, values, optionalKeys);

        if (that.options.matchCb) {
            that.options.matchCb.call(that, rule, values, optionalKeys, !!matchedRule);
        }

        if (options.matchCb) {
            options.matchCb.call(that, rule, values, optionalKeys, !!matchedRule);
        }

        return !!matchedRule;
    });

    return this.rowToObject(matchedRule);
};

MapTable.prototype.matchRule = function(rule, values, optionalKeys) {
    for (var idx = 0; idx < this.cols.length; idx++) {
        var key = this.cols[idx];

        // If current rule criterion is null, skip it as optional
        if (rule[idx] == null) {
            continue;
        }

        // If value passed for this key is null, then check
        // optionality first, and if it is optional - skip check,
        // otherwise - fail match.
        if (values[key] == null) {
            if (optionalKeys.indexOf(key) > -1) {
                continue;
            }
            else {
                return null;
            }
        }

        var matchType = this.getTypeOfMatch(rule[idx]);
        var matcher = this.matchers[matchType];

        if (!matcher(values[key], rule[idx])) {
            return null;
        }
    }

    return rule;
};

if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

return MapTable;

}));
