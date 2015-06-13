var MapTable = require('../src/index');
var should = require('should');

describe('MapTable', function() {

    var mapTable;

    var rules = [{
        id: 1,
        prop1: 'xyz',
        prop2: '123',
        prop3: 'qwe'
    }, {
        id: 1,
        prop1: 'xyz',
        prop2: '123',
        prop3: 'qwe'
    }];

    beforeEach(function() {
        mapTable = new MapTable(rules);
    });

    it('should instantiate new Map Table.', function() {
        mapTable.should.be.instanceOf(MapTable);
    });

    it('should do simple match', function() {
        var match = mapTable.match({ prop1: 'xyz' });

        should.exist(match);
        match.prop1.should.equal('xyz');
        match.id.should.equal(1);
    });

    it('should return null when match not found', function() {
        var match = mapTable.match({ prop1: 'qqqqq' });

        should.not.exist(match);
    });
});
