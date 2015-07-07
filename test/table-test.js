var assert = require("assert")
  , Table = require('../src/table.js')
  , ProtoProperties = {
    toArray: 'function'
    , toString: 'function'
    , deref: 'function'
    , clone: 'function'
    , copy: 'function'
    , deepCopy: 'function'
    , extract: 'function'
    , find: 'function'
    , findForEach: 'function'
    , findRS: 'function'
    , findForEachRS: 'function'
    , move: 'function'
    , remove: 'function'
    , removeRS: 'function'
    , drop: 'function'
    , forEach: 'function'
    , push: 'function'
  }
  , InstProperties = {
    toArray: 'function'
    , toString: 'function'
    , deref: 'function'
    , stringify: 'function'
    , parse: 'function'
    , clone: 'function'
    , copy: 'function'
    , deepCopy: 'function'
    , extract: 'function'
    , find: 'function'
    , findForEach: 'function'
    , findRS: 'function'
    , findForEachRS: 'function'
    , move: 'function'
    , remove: 'function'
    , removeRS: 'function'
    , drop: 'function'
    , forEach: 'function'
    , push: 'function'
  }
  , array = Table(null, 'array')
  , table = new Table(null, 'table')

describe('Table', function() {
  var pname, desc
  ; it('should be a function', function(){
    assert.equal(typeof Table, 'function', 'Table is missing or not a function');
  })
  ; for (pname in ProtoProperties) {
    it('should have prototype method #' + pname, function(){
      assert.equal(typeof Table.prototype[pname]
        , ProtoProperties[pname]
        , 'missing or incorrect Table.prototype.' + pname);
    })
    ; if (desc = Object.getOwnPropertyDescriptor(Table.prototype, pname)) {
      // console.log(pname, desc)
      ; it('prototype method #' + pname + ' should be enumerable', (function(pname, desc){
        return function() {
          assert.equal(desc.enumerable
            , true
            , 'non-enumerable property Table.prototype.' + pname);
        }
      })(pname, desc))
    }
  }
})

; InstanceTest(Table(), true)
; InstanceTest(new Table, false)


function InstanceTest (obj, isWrapper) {
  var itsTitle = isWrapper ? 'Table(...)' : 'new Table(...)'
    , itsNot = isWrapper ? 'NOT ' : ''
    , act, exp, before, after
  ; describe(itsTitle, function() {
    if (! isWrapper) {
      ; it('should have a name', function(){
        assert.equal(obj.constructor.name, 'Table', 'not named: ' + obj.constructor.name);
      })
    }
    ; it('should be an Object', function() {
      assert(obj instanceof Object, 'fail as Object');
    })
    ; it('should be an Array', function() {
      assert(obj instanceof Array, 'fail as Array');
    })
    ; it('should be ' + itsNot + 'be a Table', function() {
      assert((obj instanceof Table) ^ isWrapper, 'fail as ' + itsNot + 'a table');
    })
    ; for (pname in InstProperties) {
      it('should have method #' + pname, function(){
        assert.equal(typeof obj[pname]
          , InstProperties[pname]
          , 'missing or incorrect ' + itsTitle + '.' + pname);
      })
    }

    ; describe('#toString()', function() {
      it('should return [table Table]', function(){
        assert.equal(obj.toString(), '[table Table]', '#toString() bad result');
      })
    })

    ; describe('#toArray()', function() {
      it('should return []', function(){
        assert.deepEqual(obj.toArray(), [], '#toArray() bad result');
      })
    })

    ; describe('#stringify()', function() {
      it('should return []', function(){
        assert.equal(obj.stringify(), '[]', '#stringify() bad result');
      })
    })

    ; describe('#parse()', function() {
      it('should return same', function() {
        before = obj.slice()
        ; assert.deepEqual(obj.parse('[]').slice(), before, '#parse() bad result');
      })
    })

    ; describe('#deref()', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.deref().slice()
        ; assert(before !== after, '#clone() failed, because actually the same object');
        ; assert.deepEqual(before, after, '#deref() bad result');
      })
    })

    ; describe('#clone()', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.clone().slice()
        ; assert(before !== after, '#clone() failed, because actually the same object');
        ; assert.deepEqual(before, after, '#clone() bad result');
      })
    })

    ; describe('#copy()', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.copy().slice()
        ; assert(before !== after, '#copy() failed, because actually the same object');
        ; assert.deepEqual(before, after, '#copy() bad result');
      })
    })

    ; describe('#deepCopy()', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.deepCopy().slice()
        ; assert(before !== after, '#deepCopy() failed, because actually the same object');
        ; assert.deepEqual(before, after, '#deepCopy() bad result');
      })
    })

    ; describe('#drop({uid: 1})', function() {
      it('should return the number if rows dropped (none existed in this case)', function(){
        before = obj.slice()
        ; after = obj.drop({uid: 1})
        ; assert.equal(after, 0, '#drop({uid: 1}) bad result');
      })
    })

    ; describe('#move({uid: 1})', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.move({uid: 1}).slice()
        ; assert(before !== after, '#move({uid: 1}) failed, because actually the same object');
        ; assert.deepEqual(before, after, '#move({uid: 1}) bad result');
      })
    })

    ; describe('#remove({uid: 1})', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.remove({uid: 1}).slice()
        ; assert(before !== after, '#remove({uid: 1}) failed, because actually the same object');
        ; assert.deepEqual(before, after, '#remove({uid: 1}) bad result');
      })
    })

    ; describe('#removeRS({uid: 1})', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.removeRS({uid: 1}).slice()
        ; assert.deepEqual(before, after, '#removeRS({uid: 1}) bad result');
      })
    })

    ; describe('#extract()', function() {
      it('should return same', function(){
        before = obj.slice()
        ; after = obj.extract().slice()
        ; assert(before !== after, '#extract() failed, because actually the same object');
        ; assert.deepEqual(before, after, '#extract() bad result');
      })
    })

    ; describe('#find({uid: 1})', function() {
      it('should return empty Array', function(){
        var rs = obj.find({uid: 1})
        ; assert(rs === null || rs instanceof Array, '#find() did not return null or an Array');
        ; assert.deepEqual(rs, null, '#find() bad result');
      })
    })

    ; describe('#findForEach(function(row, i) { return row.uid === i })', function() {
      it('should return empty Array', function(){
        var rs = obj.findForEach(function(row, i) { return row.uid === i })
        ; assert(rs === null || rs instanceof Array, '#findForEach() did not return null or an Array');
        ; assert.deepEqual(rs, [], '#findForEach() bad result');
      })
    })

    ; describe('#findForEach(function(row, i) { return row.uid === i }, {uid: 1})', function() {
      it('should return empty Array', function(){
        var rs = obj.findForEach(function(row, i) { return row.uid === i })
        ; assert(rs === null || rs instanceof Array, '#findForEach() did not return null or an Array');
        ; assert.deepEqual(rs, [], '#findForEach() bad result');
      }, {uid: 1})
    })

    ; describe('#findRS({uid: 1})', function() {
      it('should return empty ResultSet', function(){
        var rs = obj.findRS({uid: 1})
        ; assert(rs === null || rs instanceof Table.ResultSet, '#findRS() did not return null or a ResultSet');
        ; assert.deepEqual(rs, null, '#findRS() bad result');
      })
    })

    ; describe('#findForEachRS(function(row, i) { return row.uid === i })', function() {
      it('should return empty ResultSet', function(){
        var empty = new Table.ResultSet(obj)
          , rs = obj.findForEachRS(function(row, i) { return row.uid === i })
        ; assert(rs === null || rs instanceof Table.ResultSet, '#findForEachRS() did not return null or an Array');
        ; assert.deepEqual(rs, empty, '#findForEachRS() bad result');
      })
    })

    ; describe('#findForEachRS(function(row, i) { return row.uid === i }, {uid: 1})', function() {
      it('should return empty ResultSet', function(){
        var empty = new Table.ResultSet(obj)
          , rs = obj.findForEachRS(function(row, i) { return row.uid === i })
        ; assert(rs === null || rs instanceof Table.ResultSet, '#findForEachRS() did not return null or an Array');
        ; assert.deepEqual(rs, empty, '#findForEachRS() bad result');
      }, {uid: 1})
    })

    ; describe('#forEach(function(row, i) { return row.uid === i })', function() {
      it('should return undefined', function(){
        var after = obj.forEach(function(row, i) { return row.uid === i })
        ; assert.equal(after, null, '#forEach() bad result');
      })
    })

    ; describe('#push({uid: 1})', function() {
      it('should return 1', function(){
        before = obj.slice()
        ; assert.equal(obj.push({uid: 1}), 1, '#push() bad result');
        ; assert.notDeepEqual(before, obj.slice(), '#push() Table still the same');
      })
    })

    ; describe('#unshift({uid: 0})', function() {
      it('should return 2', function(){
        before = obj.slice()
        ; assert.equal(obj.unshift({uid: 0}), 2, '#unshift() bad result');
        ; assert.notDeepEqual(before, obj.slice(), '#unshift() Table still the same');
      })
    })

    ; describe('#find({uid: 0})', function() {
      it('should return [{uid: 0}]', function(){
        ; assert.deepEqual(obj.find({uid: 0}).slice(), [{uid: 0}], '#find({uid: 0}) row not found');
      })
    })

    ; describe('#find({uid: 1})', function() {
      it('should return [{uid: 1}]', function(){
        ; assert.deepEqual(obj.find({uid: 1}).slice(), [{uid: 1}], '#find({uid: 1}) row not found');
      })
    })

    ; describe('#find({uid: 2})', function() {
      it('should return null', function(){
        ; assert.equal(obj.find({uid: 2}), null, '#find({uid: 2}) row not found');
      })
    })

    ; describe('#find()', function() {
      it('should return [{uid: 0}, {uid: 1}]', function(){
        ; assert.deepEqual(obj.find().slice(), [{uid: 0}, {uid: 1}], '#find() all rows not found');
      })
    })

    ; describe('#findRS({uid: 0})', function() {
      it('should return [{uid: 0}]', function(){
        act = obj.findRS({uid: 0})
        ; assert.deepEqual(act.slice(), [{uid: 0}], '#findRS({uid: 0}) row not found');
      })
    })

    ; describe('#findRS({uid: 1})', function() {
      it('should return [{uid: 1}]', function(){
        act = obj.findRS({uid: 1})
        ; assert.deepEqual(act.slice().slice(), [{uid: 1}], '#findRS({uid: 1}) row not found');
      })
    })

    ; describe('#findRS({uid: 2})', function() {
      it('should return null', function(){
        act = obj.findRS({uid: 2})
        ; assert.equal(act, null, '#findRS({uid: 2}) row not found');
      })
    })

    ; describe('#findRS()', function() {
      it('should return [{uid: 0}, {uid: 1}]', function(){
        act = obj.findRS()
        ; assert.deepEqual(act.slice(), [{uid: 0}, {uid: 1}], '#findRS() all rows not found');
      })
    })

  })

}

