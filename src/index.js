/* global MapTable:true */

MapTable = function MapTable(rules, options) {
    if (! options) {
        options = {};
    }

    if (! Array.isArray(rules)) {
        throw new Error('rules are required for MapTable.');
    }

    this.rules = [];
    this.cols = [];

    this.init(rules, options);
};

MapTable.prototype.clone = function(obj) {
    var out, i = 0;

    if (obj == null) {
        return obj;
    }

    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var len = obj.length;
        out = [];

        for ( ; i < len; i++ ) {
            out[i] = this.clone(obj[i]);
        }

        return out;
    }

    if (typeof obj === 'object') {
        out = {};

        for ( i in obj ) {
            out[i] = this.clone(obj[i]);
        }

        return out;
    }

    return obj;
};

MapTable.prototype.init = function(rules, options) {
    if (! options) {
        options = {};
    }

    if (options.optionalCols) {
        this.optionalCols = options.optionalCols;
    }
    else {
        this.optionalCols = [];
    }

    this.rules = this.clone(rules);
    this.match = MapTable.prototype.match;
    this.cols = this.rules.shift();

    if (! Array.isArray(this.cols)) {
        throw new Error('First row of rules array should be array of columns.');
    }

    // Detect optional columns
    for (var i = 0; i < this.rules.length; i++) {
        var cols = this.rules[i];
        for (var j = 0; j < cols.length; j++) {
            if (cols[j] == null && this.optionalCols.indexOf(this.cols[j]) === -1) {
                this.optionalCols.push(this.cols[j]);
            }
        }
    }
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
    if (values !== null && typeof values !== 'object') {
        throw new Error('values should be object');
    }

    var that = this;

    var matchedRule = null;

    this.rules.some(function(rule) {
        var match = true;

        for (var idx = 0; idx < that.cols.length; idx++) {
            var key = that.cols[idx];

            // If current rule criterion is null, skip it as optional
            if (rule[idx] == null) {
                continue;
            }

            // If value passed for this key is null, then check
            // optionality first, and if it is optional - skip check,
            // otherwise - fail match.
            if (values[key] == null) {
                if (that.optionalCols.indexOf(key) > -1) {
                    continue;
                }
                else {
                    match = false;
                    break;
                }
            }

            var matchType = that.getTypeOfMatch(rule[idx]);
            var matcher = that.matchers[matchType];

            if (!matcher(values[key], rule[idx])) {
                match = false;
                break;
            }
        }

        if (match) {
            matchedRule = rule;
            return true;
        }
    });

    return this.rowToObject(matchedRule);
};

if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
