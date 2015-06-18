var MapTable = function MapTable(rules) {
    if (! Array.isArray(rules)) {
        throw new Error('rules are required for MapTable.');
    }

    this.rules = [];
    this.cols = [];

    this.init(rules);
};

MapTable.prototype.clone = function(obj) {
    var out, i = 0;

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

MapTable.prototype.init = function(rules) {
    rules = this.clone(rules);

    this.match = MapTable.prototype.match;

    this.cols = rules.shift();

    if (! Array.isArray(this.cols)) {
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
    if (values !== null && typeof values !== 'object') {
        throw new Error('values should be object');
    }

    var that = this;

    var matchedRule = null;
    var valueKeys = Object.keys(values);

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

if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

if (module && module.exports) {
    module.exports = MapTable;
}
