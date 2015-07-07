
var assert = require("assert")
  , Table = require('../src/jsondbtable.js')
  , ResultSet = Table.ResultSet
  , obj, rs, before, after

obj = new Table
; obj.push({uid: 0})
; obj.push({uid: 1})
; obj.push({uid: 2})

; console.log(obj.length)
; console.log(obj.find())
; console.log(rs = obj.findRS())
; if (rs) console.log(rs.length)

// ; after = (obj = new Table).forEach(function(row, i) { return row.uid === i })
// ; console.log(obj, after)
// ; assert(after === obj, 'obj !== (new Table).forEach')
// ; after = (obj = Table()).forEach(function(row, i) { return row.uid === i })
// ; ; assert(after === obj, 'obj !== Table().forEach')

// rs = (obj = new Table).findRS({uid: 1})
// console.log(rs);
// ; assert(rs === null || rs instanceof Table.ResultSet, '#findRS() did not return null or a ResultSet');
// ; assert.deepEqual(rs, null, '#findRS() result should be null');

// ; describe('table#parse()', function() {
//   it('table#parse() return same', function() {
//     var obj
//     ;
//     assert.deepEqual((obj = new Table).parse('[]'), obj, '#parse() bad result');
//     assert.deepEqual((obj = Table()).parse('[]'), obj, '#parse() bad result');
//   })
// })

// ; describe('#deref()', function() {
//   it('should return same', function(){
//     var obj
//     ; assert.deepEqual((obj = new Table).deref().slice(), obj.slice(), '#deref() bad result');
//     ; assert.deepEqual((obj = Table()).deref().slice(), obj.slice(), '#deref() bad result');
//   })
// })

