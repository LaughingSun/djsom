var assert = require('assert')
  , FNNAME_REGEX = /^function(?:\s+(\w+))?\(/
  , copy = require('../src/copy.js') || {}
  , deepCopy = copy.deep
  , deepClone = copy.clone
  , deepCloneRecursive = copy.cloneRecursive
  , testdata, testargs, a, b, c, n

; testdata = {
  copy: [
    [{a:1, b:2, c:3}]
    , [[0,1,2,3,4,5,6,7,8,9]]
    , [/\w+/gim]
    , [[[0,1,2,3,4],[5,6,7,8,9]]]
    , [{first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}]
    , [[c = [0,1,2,3,4], c]]
    , [{first: c = {a:1, b:2, c:3}, second: c}]
    , [[0,1,2,3,4,5,6,7,8,9]
      , incADecB, [-1,0,1,2,3,4,5,6,7,8], [1,2,3,4,5,6,7,8,9,10]]
    , [{a:1, b:2, c:3}
      , incADecB, {a:0, b:1, c:2}, {a:2, b:3, c:4}]
    , [[[0,1,2,3,4],[5,6,7,8,9]]
      , incASDecBS, [[0,1,2,3,4],[5,6,7,8,9]], [[0,1,2,3,4],[5,6,7,8,9]]]
    , [{first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}
      , incASDecBS
      , {first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}
      , {first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}]
    , [[c = [0,1,2,3,4], c]
      , incASDecBS, [c = [0,1,2,3,4], c], [c = [0,1,2,3,4], c]]
    , [{first: c = {a:1, b:2, c:3}, second: c}
      , incASDecBS
      , {first: c = {a:1, b:2, c:3}, second: c}
      , {first: c = {a:1, b:2, c:3}, second: c}]
  ]
  , deep: [
   [[0,1,2,3,4,5,6,7,8,9]]
    , [{a:1, b:2, c:3}]
    , [/\w+/gim]
    , [[[0,1,2,3,4],[5,6,7,8,9]]]
    , [{first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}]
    , [[c = [0,1,2,3,4], c]]
    , [{first: c = {a:1, b:2, c:3}, second: c}]
    , [[0,1,2,3,4,5,6,7,8,9]
      , incADecB, [-1,0,1,2,3,4,5,6,7,8], [1,2,3,4,5,6,7,8,9,10]]
    , [{a:1, b:2, c:3}
      , incADecB, {a:0, b:1, c:2}, {a:2, b:3, c:4}]
    , [[[0,1,2,3,4],[5,6,7,8,9]]
      , incASDecBS, [[-1,0,1,2,3],[4,5,6,7,8]], [[1,2,3,4,5],[6,7,8,9,10]]]
    , [{first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}
      , incASDecBS
      , {first: {a:0, b:1, c:2}, second: {a:3, b:4, c:5}}
      , {first: {a:2, b:3, c:4}, second: {a:5, b:6, c:7}}]
    , [[c = [0,1,2,3,4], c]
      , incASDecBS, [c = [-2,-1,0,1,2], c], [c = [1,2,3,4,5], c]]
    , [{first: c = {a:1, b:2, c:3}, second: c}
      , incASDecBS
      , {first: c = {a:-1, b:0, c:1}, second: c}
      , {first: c = {a:2, b:3, c:4}, second: c}]
  ]
  , clone: c = [
    [[0,1,2,3,4,5,6,7,8,9]]
    , [{a:1, b:2, c:3}]
    , [/\w+/gim]
    , [[[0,1,2,3,4],[5,6,7,8,9]]]
    , [{first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}]
    , [[c = [0,1,2,3,4], c]]
    , [{first: c = {a:1, b:2, c:3}, second: c}]

    , [[0,1,2,3,4,5,6,7,8,9]
      , incADecB, [-1,0,1,2,3,4,5,6,7,8], [1,2,3,4,5,6,7,8,9,10]]
    , [{a:1, b:2, c:3}
      , incADecB, {a:0, b:1, c:2}, {a:2, b:3, c:4}]
    , [[[0,1,2,3,4],[5,6,7,8,9]]
      , incASDecBS, [[-1,0,1,2,3],[4,5,6,7,8]], [[1,2,3,4,5],[6,7,8,9,10]]]
    , [{first: {a:1, b:2, c:3}, second: {a:4, b:5, c:6}}
      , incASDecBS
      , {first: {a:0, b:1, c:2}, second: {a:3, b:4, c:5}}
      , {first: {a:2, b:3, c:4}, second: {a:5, b:6, c:7}}]
    , [[c = [0,1,2,3,4], c]
      , incASDecBS, [c = [-2,-1,0,1,2], c], [c = [2,3,4,5,6], c]]
    , [{first: c = {a:1, b:2, c:3}, second: c}
      , incASDecBS
      , {first: c = {a:-1, b:0, c:1}, second: c}
      , {first: c = {a:3, b:4, c:5}, second: c}]
  ]
  , cloneRecursive: JSON.parse(JSON.stringify(c, textifier), untextifier)
}
for (n in testdata) {
  doTest1All(n)
}

;


function incADecB (a,b) {
  var keys = Object.keys(a)
    , i = 0, k
  ; while (i < keys.length) {
    a[k = keys[i++]]--
    ; b[k]++
  }
}

function incASDecBS (a,b) {
  var keys = Object.keys(a)
    , i = 0, k
  ; while (i < keys.length) incADecB(a[k = keys[i++]], b[k])
}

function textifier (key, val) {
  if (val instanceof Object) {
    if (val.constructor === RegExp) return ['constructor:', val.constructor.name, '(', val.toString(), ')'].join('')
  }
  return val
} 

function untextifier (key, val) {
  var t = 'constructor:'
    , i = t.length
    , cn, j
  ; if (typeof val === 'string' && val.indexOf(t) === 0
      && (j = val.indexOf('(', i)) > i) {
    switch (cn = val.slice(i, j).trim()) {
      case 'RegExp':
      default:
        return eval(['new ', cn, val.slice(j)].join(''))
    }
  }
  return val
} 


function doTest1All (n) {
  var cases = testdata[n]
    , i, testargs
  ; describe('copy.' + n, function() {
    var a, b
    ; it('should be a function', function(){
      assert.equal(typeof copy[n], 'function', ['copy.', n, ' is missing or not a function'].join(''));
      ; for (i = 0; i < cases.length; i++) {
        (testargs = cases[i].slice()).unshift(n)
        ; doTest1.apply(null, testargs)
      }
    })
  })
}

function doTest1 (mn, a, fn, aftera, afterb) {
  var as = JSON.stringify(a, textifier)
    , expect = JSON.parse(as, untextifier)
    , b, bs, fs, c, d
  ; describe(['b = copy.', mn, '(', as, ')'].join(''), function() {
    b = copy[mn](a)
    ; it('should have same constructor ', function(){
      assert(a.constructor === b.constructor
          , 'a and b do not have the same constructor')
    })
    /*@TODO: I think that __proto__`s treated differently*/
    ; it('should deepEqual __proto__`s ', function(){
      assert.deepEqual(a.__proto__, b.__proto__
        , 'a and b do not deepEqual __proto__`s')
    })
    
    ; it('should have same __proto__.constructor ', function(){
      assert(a.__proto__.constructor === b.__proto__.constructor
        , 'a and b do not have the same __proto__.constructor')
    })
    ; it('should not be the same object', function(){
      assert(a !== b, 'a and b the same object')
    })
    ; if(fn instanceof Function) {
      fs = [fn.name || fn.toString().match(FNNAME_REGEX)[1]
          || '<anonymous>', '(a,b)'].join('')
      if (aftera == undefined) aftera = JSON.parse(JSON.stringify(a))
      ; if (afterb == undefined) afterb = JSON.parse(JSON.stringify(b))
      
      ; fn(a, b)

      ; it(['a should be ', JSON.stringify(aftera), ' after ', fs].join(''), function(){
        assert.deepEqual(a, aftera)
      })
      ; it(['b should be ', JSON.stringify(afterb), ' after ', fs].join(''), function(){
        assert.deepEqual(b, afterb)
      })
    } else {
      it('should return as deeply equal', function(){
        assert.deepEqual(a, b, 'a and b are not deeply equal')
      })
    }
  })
}

