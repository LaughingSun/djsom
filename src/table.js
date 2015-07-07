
var JSONDBPlugin = require('./jsondbplugin.js')
  , Constrainer = require('./constrainer.js')
  , _prepareConf = JSONDBPlugin.prepareConf
  , _prepareInstance = JSONDBPlugin.prepareInstance
  , _uindex = Date.now() | 0
  , _TableMethods = {
    toArray: Array.prototype.slice
    , toString: function () { return '[table JSONDBTable]' }
    , deref: _deref
    , clone: _clone
    , copy: _copy
    , deepCopy: _deepCopy
    , extract: _extract
    , find: _find
    , findForEach: _findForEach
    , findRS: _findRS
    , findForEachRS: _findForEachRS
    , remove: _remove
    , removeRS: _removeRS
    , move: _remove   // alias
    , drop: _drop
    , constrain: _constrain
  }

; module.exports = JSONDBTable

; Object.defineProperty(JSONDBTable, 'JSONDBResultSet', {
  value: JSONDBResultSet, enumerable: true
})

; JSONDBPlugin.inherits(JSONDBTable, Array, _TableMethods, true)

; JSONDBPlugin.inherits(JSONDBResultSet, Array, {})

function JSONDBTable (data) {
  var isWrapper = ! (this instanceof JSONDBTable)
    , this_ = isWrapper ? (data instanceof Array ? data : []) : this
    , i = arguments.length - 1
    , conf = (i && arguments[i] instanceof Object) ? arguments[i--] : {}
    , parser, stringifier, constraint
  ; parser = (conf.parser instanceof Function) && conf.parser
  ; stringifier = (conf.stringifier instanceof Function)
      ? conf.stringifier : _stringifier
  ; constraint = (conf.constraint instanceof Object) ? conf.constraint : null
  ; Object.defineProperty(this_, 'name', {
    name: {
      value: (i && typeof arguments[i] === 'string' && arguments[i--])
        || conf.name || ('unnamed-' + new Buffer(++_uindex + '').toString('hex'))
      , enumerable: false, configurable: true, writable: true
    }
  })
  ; JSONDBPlugin.extend(this_, {
    parse: function _parse (json, cb) {
      return _clone.call(JSON.parse(json, cb || parser), this)
    }
    , stringify: function _stringify (cb) {
      return JSON.stringify(this, cb || stringifier)
    }
  }, false)
  ; if (isWrapper) JSONDBPlugin.extend(this_, _TableMethods, true)
  ; if (data && data !== this_) {
    if (typeof data === 'string') data = JSON.parse(data, parser)
    ; _clone.call(data, this_)
  }
  return this_
}

function _stringifier(key, val) {
  return (val instanceof JSONDBTable) ? val.slice() : val
}

function _deref (this_) {
  this_ || (this_ = this)
  ; return new JSONDBTable(this_.stringify(), this_.name)
}

function _clone (result) {
  var i, r
  ; i = (result || (result = [])).length
  ; for (r of this) if (r) result[i++] = r
  ; return result
}

function _copy (result) {
  var i, k, o, r
  ; i = (result || (result = [])).length
  ; for (o of this) {
    ; if (o) {
      result[i++] = r = {}
      ; for (k in o) r[k] = o[k]
    }
  }
    ; return result
}

function _deepCopy (result) {
  var i, k, o, r
  ; i = (result || (result = [])).length
  ; for (o of this) {
    ; if (o) {
      ; result[i++] = r = {}
      ; for (k in o) r[k] = o[k]
    }
  }
    ; return result
}

function _extract (q, cb) {
  var result = []
    , i = 0
    , r, s
  ; cb instanceof Function || (cb = function (r) { return r })
  ; for (r of this) if (s = cb(r)) result[i++] = s
  ; return result
}

function _find (q) {
  var result = []
    , j = 0
    , b, k, r
  ;
  for (r of this) {
    if (! r) continue
    ; b = false
    ; for (k in q) if (b = (r[k] !== q[k])) break
    ; if (!b) result[j++] = r
  }
  return result.length ? result : null
}

function _findRS (q) {
  var result = new JSONDBResultSet(this)
    , x = result.index
    , b, i, j, k, r
  ;
  for (i in this) {
    ; if (isNaN(i) || ! (r = this[i])) continue
    ; b = false
    ; for (k in q) if (b = (r[k] !== q[k])) break
    ; if (!b) {
      ; x[result.push(r)-1] = i
    }
  }
  return result.length ? result : null
}

function _findForEach (cb, q, this_) {
  var result = []
    , i = 0
    , b, k, r
  ; this_ || (this_ = this)
  ; if (q instanceof Object) {
    ; for (r of this) {
      if ( ! (r && r instanceof Array)) continue
      b = true
      for (k in q) if (b = (r[k] !== q[k])) break
      if (!b && (b = cb.call(this_, r, i)) != null) result[i++] = b
    }
  } else {
    ; for (r of this) {
      if (r && r instanceof Array && (b = cb.call(this_, r, i)) != null) result[i++] = b
    }
  }
  return result
}

function _remove (q, dst) {
  var j = (dst || (dst = this instanceof JSONDBTable ? new JSONDBTable : [])).length
    , b, i, k, r
  ; if (isNaN(j)) throw new Error('cannot move to destination that is not array-like')
  ; for (i in this) {
    if (! (r = this[i])) continue
    for (k in q) if (b = (r[k] !== q[k])) break
    ; if (!b ) {
      dst[j++] = r
      ; this[i] = null
    }
  }
  return dst
}

function _removeRS (q, dst) {
  var b, i, j, k, r
  ; if (dst) {
    if ( ! (dst instanceof JSONDBResultSet && rst.source === this)) {
      throw new Error('cannot move to non JSONDBResultSet or JSONDBResultSet from different JSONDBTable')
    }
  } else dst = new JSONDBResultSet(this)
  ; j = dst.length
  ; for (i in this) {
    if (! (r = this[i])) continue
    for (k in q) if (b = (r[k] !== q[k])) break
    ; if (!b ) {
      dst[j++] = r
      ; this[i] = null
    }
  }
  return dst


  var result = new JSONDBResultSet(this)
    , x = result.index
    , j = 0
    , b, i, k, r
  ; result.index = x
  ;
  // for (r of this) {
  for (i in this) {
    if (! (r = this[i])) continue
    for (k in q) if (b = (r[k] !== q[k])) break
    ; if (!b ) {
      result[j] = r
      ; x[j++] = i
      ; this[i] = null
    }
  }
  return result
}

function _drop (q) {
  var n = 0
    , b, i, k, r
  ;
  for (i in this) {
    if (! (r = this[i])) continue
    for (k in q) if (b = (r[k] !== q[k])) break
    ; if (!b) {
      n++
      ; this[i] = null
    }
  }
  return n
}

function _findForEachRS (cb, q, this_) {
  var result, x, j, b, i, k, r
  ; if (this_ instanceof Function) {
    cb = this_ ; this_ = this
  } else this_ || (this_ = this)
  ; result = new JSONDBResultSet(this_)
  ; x = result.index
  ; j = 0
  ; if (q instanceof Object) {
    ; for (i in this_) {
      if (isNaN(i) || ! (r = this_[i])) continue
      ; b = true
      ; for (k in q) if (b = (r[k] !== q[k])) break
      ; if (!b && (b = cb.call(this_, r, i)) != null) {
        // console.log('_findForEachRS', k, r[k] !== q[k])
        ; result[j] = b
        ; x[j++] = i
      }
    }
  } else {
    ; for (r of this) {
      if (r && r instanceof Array && (b = cb.call(this_, r, i)) != null) result[i++] = b
    }
  }
  return result
}

function JSONDBResultSet (source) {
  if ( ! (this instanceof JSONDBResultSet)) throw new Error('constructor called as function')
  if ( ! (source instanceof Array)) throw new Error('JSONDBTable or Array expected (first argument)')
  ; this.source = source
  ; this.index = []
}

