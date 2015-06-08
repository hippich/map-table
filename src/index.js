var MapTable = function MapTable(rules) {
    if (!rules) {
        throw new Error('rules are required for MapTable.');
    }

    this.rules = rules;
};

MapTable.prototype.init = function() {
};

MapTable.prototype.match = function() {
};

if (module && module.exports) {
    module.exports = MapTable;
}
