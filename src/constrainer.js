/* 
 * The MIT License
 *
 * Copyright 2015 Erich Horn (laughing sun at github)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict"

/** constrains object data
  * 
  * @module Constrainer
  */
; module.exports = Object.freeze(Object.defineProperties(Constrainer, {
  jsonify: { value: _jsonify, enumerable: true }
  , copy: { value: _copy, enumerable: true }
  , deepCopy: { value: _deepCopy, enumerable: true }
  , clone: { value: _clone, enumerable: true }
  , deepClone: { value: _deepClone, enumerable: true }
  , iterate: { value: _iterate, enumerable: true }
  , getInstanceof: { value: _getInstanceof, enumerable: true }
  , getTypeof: { value: _getTypeof, enumerable: true }
  , isTypeof: { value: _isTypeof, enumerable: true }
  , defsToCons: { value: _defsToCons, enumerable: true }
}))

/** Constraint callback
  * 
  * @callback constraint
  */

/** Error callback
  * 
  * @callback errcb
  */


/**
  * Constraint generator
  * 
  * @function
  * @static
  * @param {?object}  cons      - constraints
  * @param {?object}  defs      - defaults
  * @param {?goDeep}  _goDeep   - if deep constraints required
  * @returns {constraint}       - a constraint
  */
function Constrainer (cons, defs, _goDeep) {
  var _cons, _defs

  ; if (this instanceof Constrainer) {
    throw new Error("I am not a constructor, use me as a function")
  }

  _cons = cons instanceof Object ? (Object.isFrozen(cons)
        ? cons : Object.freeze(_deepCopy(cons, {}))) : null
  ; _defs = defs instanceof Object ? (Object.isFrozen(defs)
        ? defs : Object.freeze(_deepCopy(defs, {}))) : null

  ; return Object.freeze(Object.defineProperties(_constrain, {
  /**
    * validate data object
    * 
    * @method validate
    * @instanceof {constrainer}
    * @param {?object}  data      - data object
    * @param {?goDeep}  goDeep    - if deep constraints required
    * @param {?errcb} errcb       - error callback, will throw errors if no errcb
    * @returns {boolean}          - true if valid
    */
    validate: { value: _validate, enumerable: true }
  /**
    * populate data object
    * 
    * @method populate
    * @instanceof {constrainer}
    * @param {?object}  data      - data object
    * @param {?goDeep}  goDeep    - if deep constraints required
    * @param {?errcb} errcb       - error callback, will throw errors if no errcb
    * @returns {boolean}          - true if successfully populated
    */
    , populate: { value: _populate, enumerable: true }
    , constraints: { value: _cons, enumerable: true }
    , defaults: { value: _defs, enumerable: true }
  }))
  ;
  
  function _validate (data, goDeep, errcb) {
    return _constrain(data, goDeep, errcb, true, false)
  }

  function _populate (data, goDeep, cb) {
    return _constrain(data, goDeep, cb, false, true)
  }

  function _constrain (data, goDeep, cb, noCons, noDefs) {
    var iter, cons, defs, stack, args, pair, pre, c, f, k, m, t, x

    ; cb || (cb = _throwErr)
    ; if ( ! (data instanceof Object)) {
      return cb(new Error('object expected, found ' + typeof data))
    }

    stack = []
    ; if (goDeep == null) goDeep = _goDeep

    ; try {
      args = {iter: _iterate(_cons), cons: _cons, defs: _defs, data: data, pre: ''}
      ; do {
        iter = args.iter
        ; cons = args.cons
        ; defs = args.defs
        ; data = args.data
        ; pre = args.pre
        ; k = ''
        ; while (pair = iter()) {
          f = null
          ; if ((k = pair[0]) in data) {
            d = data[k]
            ; if ((t = typeof (c = pair[1])) === 'boolean') {
              // true for any non-null/undefined, false anything at all
              if (c) {
                if (d != null) continue
              } else {
                if (d !== undefined) continue
                ; f = 'undefined'
              }
            } else if (t === 'string') {
              switch (c) {
                case 'undefined':
                  if (d === undefined) continue
                  ; break
                ; case 'null':
                  if (d === null) continue
                  ; break
                ; case 'empty':
                  if (d) break
                  ; continue
                ; case 'notempty':
                  if (d) continue
                  ; break
                ; case 'numeric':
                  if (isNaN(d)) break
                  ; continue
                ; case 'NaN':
                  if (isNaN(d)) continue
                  ; break
                ; case 'int':
                  if (d === (d|0)) continue
                  ; break
                ; case 'float':
                  if (d === d+0)continue
                  ; break
                ; case 'object':
                  if (d == null) break
                ; case 'objectOrNull':
                  c = 'object'
                ; case 'boolean':
                case 'number':
                case 'string':
                case 'array':
                case 'function':
                case 'symbol':
                  if ((f = typeof d) === c) continue
                  ; break

                ; default:
                  if (d instanceof Object && (
                    (c[0] === '[' && d.toString() === c) || d.constructor.name === c)) continue
              }
            } else if (c instanceof Object) {
              if (d instanceof Object) {
                if (c.constructor !== Object) {
                  if (d instanceof c) continue
                } else {
                  // go deep
                  if (goDeep) {
                    stack.push({iter: iter, _cons: _cons, defs: _defs, data: data, pre: ''})
                    ; iter = _iterate(_cons = c)
                    ; data = d
                    ; pre = pre ? [pre, k].join('.') : k
                  }
                  continue
                }
              }
            } else {
              throw new Error(['invalid constrainer at ', pre, k, ': ', d].join(''))
            }
          } else {
            d = data[k]
          }

          // throw error
          if (typeof (x = pair[1]) !== 'string') x = x.toString().replace(/(function(?:\s+[\w\$]+)?\s*\([^\)]*\))[^]+/, '$1')
          ; if ( ! f) {
            try {
              f = JSON.stringify(d)
            } catch (e) {
              f = (d === null) ? 'null' : (d === undefined) ? 'undefined' : d.toString().replace(/(function(?:\s+[\w\$]+)?\s*\([^\)]*\))[^]+/, '$1')
            }
          }
          throw new Error(['at ', pre, k, ' found ', f, ', expected ', x].join(''))

        } // end while (pair = iter())

      } while (args=stack.pop())

    } catch (e) {
      cb(e, pre + k)
      ; return false
    }

    return true
  }

}

function _iterate (subj) {
  var s = Object.keys(subj)
    , k, v
  ; return function() {
      return((k=s.shift())===undefined)?k:[k,subj[k]]
  }
}

function _throwErr (err) {
  err instanceof Error || (err = new Error(err))
  ; throw err
}

function _defsToCons (defs, cons) {
  if (cons instanceof Object) {
    if (Object.isFrozen(cons)) cons = _deepCopy(cons)
  } else cons = {}

  return cons
}

function _getInstanceof (data) {
  if (data instanceof Object) return data.constructor
}

function _getTypeof (data) {
  var c, m, s, t
  ; if (data == null) return (data === null) ? 'null' : 'undefined'
  switch (t = typeof data) {
    case 'object':
      if ( ! data) return 'null'
      ; if ((c = data.constructor) === Object) break
      ; if ((n = c.name)
          || (((m = (s = c.toString()).match(/^function\s+([\w\$]+)\s*\(/))
              || (m = data.match(/^\[\w+\s(\w+)\]$/))) && (n = m[1]))) {
        return ['[', n.toLowerCase(), ' ', n, ']'].join('')
      }
  }
  return t
}

function _isTypeof (type, data, errcb) {
  var d
  ; if (type instanceof Function) return data instanceof type
  ; if (typeof type !== 'string') (errcb || _throwErr)
      (new Error('string or Class expected (first argument), found: ' + typeof type))
  ; if (type[0] === '!') return ! _isTypeof(t.slice(1), data, errcb)
  ; d = typeof data
  ; if (type[0] !== '[') {
    switch (type) {
      case 'null': return data === null
      ; case 'notNull': return data !== null
      ; case 'empty': return ! data || (d === 'array' && ! d.length) || false
      ; case 'notEmpty': return !! (data && (d !== 'array' || d.length)) || false
      ; case 'numeric': return ! isNaN(data)
      ; case 'notNumeric': case 'NaN': return isNaN(data)
      ; case 'int': return data === (data|0)
      ; case 'notInt': return data !== (data|0)
      ; case 'float': return data === data+0
      ; case 'notFloat': return data !== data+0
      ; case 'object': return data && d === 'object'
      ; case 'notObject': return ! data || d !== 'object'
      ; case 'objectOrNull': return d === 'object'
      ; case 'notObjectOrNull': return d !== 'object'
      ; case 'notUndefined':
      ; case 'notBoolean':
      ; case 'notNumber':
      ; case 'notString':
      ; case 'notArray':
      ; case 'notFunction':
      ; case 'notSymbol': return d !== type
    }

    return d === type
  }

  return _getTypeof(data) === type
}

function _jsonify (src) {
  var i = arguments.length - 1
    , errcb = (i && arguments[i]) instanceof Function?arguments[i--]:_throwErr
    , pcb = (i > 1 && arguments[i]) instanceof Function?arguments[i--]:null
    , scb = (i && arguments[1]) instanceof Function?arguments[i]:null
    , json
  ; try {
    json = JSON.stringify(src, scb)
    ; return JSON.parse(json, pcb)
  } catch (e) {
    errcb(e)
  }
}

function _clone (src, dst, cb) {
  var k
  ; dst || (dst = {})
  ; for (k in src) dst[k] = src[k]
  ; return dst
}

function _deepCloneObject (src, dst, cb) {
  var ite = Object.keys(src)
    , parts = {ite: ite, src: src, dst: dst || (dst = {})}
    , stack = []
    , srcCache = [src]
    , si = srcCache.length
    , dstCache = [dst]
    , di = dstCache.length
    , parts, key, sval, dval, desc
    , i, k, o, t
  ; dst.__proto__ = Object.create(src.__proto__)

  if ( ! (src instanceof Object)) return src

  (res = dst || (dst = {})).__proto__ = Object.create(src.__proto__)
  ; parts = {
    src: src
    , dst: dst
    , ite: Object.getOwnPropertyNames(src)
  }
  do {
    src = parts.src
    ; dst = parts.dst
    ; ite = parts.ite
    ; while (key = ite.shift()) {
      if ((val = (des = Object.getOwnPropertyDescriptor(src, key)).value) instanceof Object) {
        stack.push({src: src, dst: dst, ite: ite, key: key, des: des})
        ; continue
      }
      Object.defineProperty(dst, key, desc)
    }
  } while (parts = stack.shift())

    ; while (true) {
      ; while (ite.length) {
        if (desc = Object.getOwnPropertyDescriptor(src, key = ite.shift())) {
          if ('value' in desc && (sval = desc.value) instanceof Object) {
            if ((i = srcCache.indexOf(sval)) < 0) {
              stack.push(src: src, dst: dst, key: key, ite: ite)
              ; src = sval
              ; dst = desc.value
              ; ite = Object.getOwnPropertyNames(src)
              ; break
            }
            desc.value = dstCache[i]
          }
          Object.defineProperty(dst, key, desc)
          ; continue
        }
        dst[key] = src[key]
      }
      if ( ! (parts = stack.shift())) break
      src = parse.src
      ; dst = parts.dst
      ; key = parts.key
      ; desc = parts.desc
      ; ite = parts.ite
      ; if (key) {
          if (desc) Object.defineProperties(dst, key, desc)
          ; else dst[key] = value
      }
    }
    ;

            }
            stack.push({src: srcCache[si++] = sval, dst: dst, key: key, des: descdstCache[di++] = dval})
            desc.value = dval = (dst.hasOwnProperty(key) && 'value' in (t = Object.getOwnPropertyDescriptor(dst, key)))
                ? t.value : {}
          }
          stack.push({src: srcCache[si++] = sval, dst: dst, key: key, des: descdstCache[di++] = dval})
          } else Object.defineProperty(dst, key, desc)
        } else throw new Error(['expected descriptor for src[', key, ']'].join(''))
        if ((sval = src[key]) instanceof Object) {
          if ((i = srcCache.indexOf(sval)) >= 0) {
            dst[key] = dstCache[i]
            ; continue
          }
          stack.push(src: sval, dst: (dval = dst.hasOwnProperty(key) ? dst[key] : (dst[key] = {})))
          ; dval.__proto__ = Object.create(sval.proto)
          ; continue
        }

        dst[key] = src[key]
      }    
    } while (parts = stack.shift())
  } else res = src

  return res

  while ( (t = stack.shift()))
    src = (t = stack.pop()).src
    ; dst = t.dst
    ; while (ite.length) {
      if ((sval = src[key = ite.shift()])) instanceof Object
          && (i = srcCache.indexOf(sval)) < 0) {
        (dst[key] = dval = {}).__proto__ = Object.create(val.proto)
        ; stack.push({src sval, dst: dval})
        ; continue
      }
      dst[key] = val
    }
  } while (src = (t = stack.shift()).src &&
  ; 
}

function _copy (src, dst) {
  var i, k, o, r
  ; i = (dst || (dst = [])).length
  // ; for (o of src) {
  ; for (var j in src) {
    // ; if (o) {
    ; if (o = src[j]) {
      dst[i++] = r = {}
      ; for (k in o) r[k] = o[k]
    }
  }
    ; return dst
}

function _deepCopy (src, dst, cb) {
  var i, k, o, r
  ; i = (dst || (dst = [])).length
  // ; for (o of src) {
  ; for (var j in src) {
    // ; if (o) {
    ; if (o = src[j]) {
      ; dst[i++] = r = {}
      ; for (k in o) r[k] = o[k]
    }
  }
  return dst
}

