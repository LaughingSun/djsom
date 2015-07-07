
var pluginManager = require('./plugin-manager.js')
  , Collection = require('./collection.js')
  , _prepareConf = pluginManager.prepareConf
  , _prepareInstance = pluginManager.prepareInstance

module.exports = AJSODM

; Object.defineProperties(AJSODM, {
  Collection: { value: Collection }
  , Table: { value: Collection.Table }
  , ResultSet: { value: Collection.Table.ResultSet }
})

; pluginManager.inherits(AJSODM, Object, {
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

function AJSODM (conf) {
  var conf = _prepareConf(arguments, 'ajsodm', AJSODM, ['load', 'save'])
  ; if ( ! (this instanceof AJSODM)) throw new Error(['constructor AJSODM called as function'].join(''))
  ; _prepareInstance.call(this, conf)
}
