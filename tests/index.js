var MapTable = require('../src/index');

describe('MapTable', function() {
    it('should instantiate new Map Table.', function() {
        var mapTable = new MapTable({});
        mapTable.should.be.instanceOf(MapTable);
    });
});
