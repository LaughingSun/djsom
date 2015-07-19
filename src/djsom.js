
var pluginManager = require('./plugin-manager.js')
  , Collection = require('./collection.js')
  , _prepareConf = pluginManager.prepareConf
  , _prepareInstance = pluginManager.prepareInstance

module.exports = DJSOM

; Object.defineProperties(DJSOM, {
  Collection: { value: Collection }
  , Table: { value: Collection.Table }
  , ResultSet: { value: Collection.Table.ResultSet }
})

; pluginManager.inherits(DJSOM, Object, {
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

function DJSOM (conf) {
  var conf = _prepareConf(arguments, 'djsom', DJSOM, ['load', 'save'])
  ; if ( ! (this instanceof DJSOM)) throw new Error(['constructor DJSOM called as function'].join(''))
  ; _prepareInstance.call(this, conf)
}
