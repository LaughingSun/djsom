
var fs = require('fs')
  , path = require('path')
  , MIMETYPES = {
    "application/json": '.json'
  }
  , EXTENSIONS = (function(){
    var e2m = {}, x, k, v; for (k in MIMETYPES) for (x of MIMETYPES[k])
        (x in e2m) || (e2m[x] = k); return e2m })()

module.exports = JSONDBPlugin
;

; _clone.call({
  inherits: _inherits
  , extend: _extend
  , install: _installPlugin
  , prepareConf: _prepareConf
  , prepareInstance: _prepareInstance
  , clone: _clone
}, JSONDBPlugin)



function JSONDBPlugin (name) {

}

function _inherits (ctor, superCtor, props, enumerable) {
  var propdefs = {}
    , k
  ; if (props) for (k in props) propdefs[k] = {
    value: props[k],
    enumerable: !! enumerable,
    writable: true,
    configurable: true
  }
  propdefs.constructor = {
    value: ctor,
    enumerable: false,
    writable: true,
    configurable: true
  }
  ctor.prototype = Object.create(superCtor.prototype, propdefs)
}

function _extend (obj, props, enumerable) {
  var propdefs = {}
    , k
  ; for (k in props) propdefs[k] = {
    value: props[k],
    enumerable: !! enumerable,
    writable: true,
    configurable: true
  }
  Object.defineProperties(obj, propdefs)
}


function _installPlugin (path, cb) {
  var plugin
  try {
    if ( ! ((plugin = require(path)) instanceof JSONDBPlugin)
        || typeof plugin.name !== 'string') {
      throw new Error(['unsupported JSONDBPlugin: ', path].join(''))
    }
    if (plugin.name in JSONDB) {
      if (plugin !== JSONDB[plugin.name]) {
        throw new Error(['JSONDBPlugin "', plugin.name, '" conflicts with existing feature or plugin'].join(''))
      }
      return
    }
    JSONDB[plugin.name] = plugin
  } catch (e) {
    return cb.call(e, plugin)
  }
  cb.call(null, plugin)
}

function _prepareConf (args, name, class_, reserved) {
  var i = -1
    , fp, type, extn, conf, autosave, autoload, cb, a, t
  ; while (++i < args.length) {
    if ((t = typeof (a = args[i])) === 'string') {
      if (path.extname(a)) {
        if (fp) throw new Error(['invalid argument[', i, ']: duplicate filepath'].join(''))
        ; fp = a
      } else if (a in MIMETYPES) {
        if (type) throw new Error(['invalid argument[', i, ']: duplicate mimetype'].join(''))
        ; type = a
      } else if (a in EXTENSIONS) {
        if (extn) throw new Error(['invalid argument[', i, ']: duplicate extension'].join(''))
        ; extn = a
      } else {
        if (name) throw new Error(['invalid argument[', i, ']: duplicate name'].join(''))
        ; name = a
      }
    } else if (t === 'boolean') {
      autosave = autoload = a
    } else if (a instanceof Function && ! conf.callback) {
      conf.callback = a
    } else if (a instanceof Object && ! conf) {
      conf = a
    } else throw new Error(['invalid argument[', i, ']: ', typeof a].join(''))
  }
  conf || (conf = {})
  ; if (autosave != null) conf.autosave = !! autosave
  ; if (autoload != null) conf.autoload = !! autoload
  ; if (name) {
    conf.name = name
  } else if (!this.name) {
    this.name = 'default'
  }
  if (extn) conf.extn = extn
  ; if (type) {
    conf.type = type
  } else if (! conf.type && conf.extn && conf.extn in EXTENSIONS) {
    conf.type = EXTENSIONS[conf.type] || 'application/json'
  }
  if (fp) {
    conf.path = fp
  } else if (! conf.path && extn) {
    conf.path = [conf.prepath || './', conf.name || 'jsondb', conf.extn
      || MIMETYPES[conf.type] ||'.json'].join('')
  }
  if (! conf.callback) conf.callback = function (err) { throw new Error(err) }
  ; if (conf.path in class_.prototype || reserved.indexOf(conf.name) > 0) {
    throw new Error(['name ', conf.name, ' conflicts with ', class_, '.', conf.name].join(''))
  }
  return conf
}

function _prepareInstance (conf) {
  ; name = conf.name
  ; fp = conf.path
  ; type = conf.type
  ; cb = this.callback
  ; if (conf.fp) {
    Object.defineProperties(this, {
      load: {
        value: function () {
          fs.readFile(fp, type, function (err, buff) {
            if (! err) {
              if (conf.parser) {
                _cloneRow.call(conf.parser(buff), this)
              } else switch (type) {
                case 'application/json':
                  _cloneRow.call(JSON.parse(buff.toString()), this)
                default:
                  err = new Error(['unsupported mimetype ', type, ' for ', fp].join(''))
              }
            }
            return cb.call(this, err, 'load', fd)
          })
        }
      }
      , save: {
        value: function () {
          var buff
          ; if (! err) {
            if (conf.stringifier) {
              buff = new Buffer(conf.stringifier(this))
            } else switch (type) {
              case 'application/json':
                buff = new Buffer(JSON.stringify(this))
              default:
                err = new Error(['unsupported mimetype ', type, ' for ', fp].join(''))
            }
          }
          fs.writeFile(fp, buff, type, function (err, fd) { cb.call(this, err, 'save', fd)})
        }
      }
    })
    ; if (conf.filepath && conf.autoload) this.load()
    ; if (conf.saveInterval && ! isNaN(conf.saveInterval)) {
      require('timers').setInterval(__autosave, conf.saveInterval)
    }
    ; process.on('exit', __autosave)

    function __autosave () {
      if (conf.filepath && conf.autosave && this.save instanceof Function) this.save()
    }

  }

  return this
}

function _clone (result) {
  var k
  ; result || (result = {})
  ; for (k in this) result[k] = this[k]
  ; return result
}

