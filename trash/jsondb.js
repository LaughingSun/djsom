
var JSONDBPlugin = require('./jsondbplugin.js')
  , Collection = require('./collection.js')
  , _prepareConf = JSONDBPlugin.prepareConf
  , _prepareInstance = JSONDBPlugin.prepareInstance

module.exports = JSONDB

; Object.defineProperties(JSONDB, {
  Collection: { value: Collection }
  , Table: { value: Collection.Table }
  , ResultSet: { value: Collection.Table.ResultSet }
})

; JSONDBPlugin.inherits(JSONDB, Object, {
  // parse: JSONDB_parse
  // , stringify: JSONDB_stringify
  // , loadJson: JSONDB_loadJson
  // , saveAsJson: JSONDB_saveAsJson
  // , getCollection: _getCollection
  // , attachCollection: _attachCollection
  // , moveCollection: _moveCollection
  // , dropCollection: _dropCollection
  // , loadCollection: _loadCollection
  // , saveCollection: _SaveCollection
})

;

function JSONDB (conf) {
  var conf = _prepareConf(arguments, 'jsondb', JSONDB, ['load', 'save'])
  ; if ( ! (this instanceof JSONDB)) throw new Error(['constructor JSONDB called as function'].join(''))
  ; _prepareInstance.call(this, conf)
}
