
; _inherits(Cache, Object, {
  , get: function (key) {
    return = this[key] || null
  }
  , add: function (key, rs) {
    if ((rs instanceof ResultSet || ('index' in re && 'source' in re))
        && rs.index instanceof Array && rs.source instanceof Array) {
      return this[key] = rs
    }
    throw new Error(['incompatable result set'].join(''))
  }
  , addMany: function (rsmap) {
    var key, rs
    ; for (key in rsmap) if (((rs = rsmap[key]) instanceof ResultSet
        || ('index' in re && 'source' in re))
        && rs.index instanceof Array && rs.source instanceof Array) {
      this[key] = rs
    }
    throw new Error(['incompatable result set for ', key].join(''))
  }
  , remove: function (key) {
    var r, i, v
    ; if (arguments.length === 1) {
      r = this[key] || null
      ; this[key] = null
    } else {
      r = []
      ; for (i in arguments) if (v = this[k = arguments[i]]) r[k] = v
    }
    return r
  }
  , listen: function (key, table, cb) {
    
  }
  , ignore: function (key, table, cb) {
    
  }
})

function Cache () { }

