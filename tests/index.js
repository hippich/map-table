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
        ['ID', 'Prop1', 'prop2', 'prop3', 'prop4'],
        [ 1  , 'xyz'  , '123'  , 'qwe'  , null   ],
        [ 2  , 'zyx'  , '321'  , 'ewq'  , null   ],
        [ 3  , '/\/abc/', '123'  , 'asd'  , null   ],
        [ 4  , 'xyz'  , ''     , ''     , null   ],
        [ null,   null, null   , null   , null   ]
    ];

    beforeEach(function() {
        mapTable = new MapTable(rules, { optionalKeys: ['id'] });
    });

    it('should instantiate new Map Table.', function() {
        mapTable.should.be.instanceOf(MapTable);
        mapTable.cols.should.deep.equal(['id', 'prop1', 'prop2', 'prop3', 'prop4']);
        mapTable.rules.length.should.equal(4);
        mapTable.rowToObject([1, 2, 3, 4, 5]).should.deep.equal({ id: 1, prop1: 2, prop2: 3, prop3: 4, prop4: 5 });
    });

    it('should correctly store optional keys', function() {
        mapTable.optionalKeys.should.deep.equal(['id']);
    });

    // Match type detection
    it('should detect plain string match', function() {
        mapTable.getTypeOfMatch('qwerty123').should.equal('string');
    });

    it('should detect regex match', function() {
        mapTable.getTypeOfMatch('/qwerty123/').should.equal('regexp');
        mapTable.getTypeOfMatch('/qwerty123/i').should.equal('regexp');
        mapTable.getTypeOfMatch('/qwerty123/g').should.equal('string');
    });

    it('should detect string match when RegExp match is not available for usage', function() {
        mapTable.options.matchers = ['string', 'gt', 'lt'];
        mapTable.getTypeOfMatch('/qwerty123/').should.equal('string');
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
        var match = mapTable.match({ prop1: 'xyz', Prop2: '123', prop3: 'qwe' });
        should.exist(match);
        match.id.should.equal(1);

        var secondMatch = mapTable.match({ prop1: 'xyz' });
        should.exist(secondMatch);
        secondMatch.id.should.equal(4);
    });

    it('should allow do supply multiple variants to matcher', function() {
        var match = mapTable.match({ prop1: ['zzzzzz', 'xyz'] });
        should.exist(match);
        match.id.should.equal(4);
    });

    it('should do simple match with wildcard rule', function() {
        var match = mapTable.match({ prop1: 'xyz', prop2: '9999' });
        should.exist(match);
        should.not.exist(match.prop4);
        match.id.should.equal(4);
    });

    it('should do simple match with optional key', function() {
        var match = mapTable.match({ prop1: 'xyz' }, { optionalKeys: ['prop2', 'prop3'] });
        should.exist(match);
        match.id.should.equal(1);
    });

    it('should do regexp match', function() {
        var match = mapTable.match({ prop1: 'o\/abcd', prop2: '123', prop3: 'asd' });
        should.exist(match);
        match.id.should.equal(3);
    });

    // Callbacks
    it('should call match callbacks', function() {
        var matchA, matchB;

        mapTable.options.matchCb = function(rule) {
            matchA = this.rowToObject(rule);
        };

        mapTable.match({ prop1: 'xyz' }, {
            matchCb: function(rule) {
                matchB = this.rowToObject(rule);
            }
        });

        matchA.id.should.equal(4);
        matchB.id.should.equal(4);
    });
});
