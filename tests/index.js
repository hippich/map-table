/* global MapTable: true, chai: true */
var should = chai.should();

describe('MapTable.prototype', function() {
    it('should have matchers work correctly', function() {
        var matchers = MapTable.prototype.matchers;
        should.exist( matchers.string('asd', 'asd') );
        should.exist( matchers.regexp('asd', '/^as/') );
        should.exist( matchers.gt('asd', '>abb') );
        should.exist( matchers.lt(10, '<11') );
    });
});

describe('MapTable', function() {

    var mapTable;

    var rules = [
        ['id', 'prop1', 'prop2', 'prop3', 'prop4'],
        [ 1  , 'xyz'  , '123'  , 'qwe'  , null   ] ,
        [ 2  , 'zyx'  , '321'  , 'ewq'  , null   ] ,
        [ 3  , '/abc/', '123'  , 'asd'  , null   ] ,
        [ 4  , 'xyz'  , null   , null   , null   ]
    ];

    beforeEach(function() {
        mapTable = new MapTable(rules, { optionalCols: ['id'] });
    });

    it('should instantiate new Map Table.', function() {
        mapTable.should.be.instanceOf(MapTable);
        mapTable.cols.should.deep.equal(['id', 'prop1', 'prop2', 'prop3', 'prop4']);
        mapTable.rowToObject([1, 2, 3, 4, 5]).should.deep.equal({ id: 1, prop1: 2, prop2: 3, prop3: 4, prop4: 5 });
    });

    it('should correctly identify optional columns', function() {
        mapTable.optionalCols.should.deep.equal(['id', 'prop4', 'prop2', 'prop3']);
    });

    // Match type detection
    it('should detect plain string match', function() {
        mapTable.getTypeOfMatch('qwerty123').should.equal('string');
    });

    it('should detect regex match', function() {
        mapTable.getTypeOfMatch('/qwerty123/').should.equal('regexp');
    });

    it('should detect greater than match', function() {
        mapTable.getTypeOfMatch('>123').should.equal('gt');
    });

    it('should detect less than match', function() {
        mapTable.getTypeOfMatch('<123').should.equal('lt');
    });

    // Testing matching
    it('should return null when match not found', function() {
        var match = mapTable.match({ prop1: 'qqqqq' });
        should.not.exist(match);
    });

    it('should do simple match', function() {
        var match = mapTable.match({ prop1: 'xyz' });
        should.exist(match);
        match.prop2.should.equal('123');
        match.id.should.equal(1);
    });

    it('should do simple match with wildcard rule', function() {
        var match = mapTable.match({ prop1: 'xyz', prop2: '9999' });
        should.exist(match);
        should.not.exist(match.prop2);
        match.id.should.equal(4);
    });

    it('should do regexp match', function() {
        var match = mapTable.match({ prop1: 'oabcd' });
        should.exist(match);
        match.prop1.should.equal('/abc/');
        match.id.should.equal(3);
    });
});
