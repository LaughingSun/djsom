
var JSONDBPlugin = require('./jsondbplugin.js')
  , Table = require('./table.js')
  , _prepareConf = JSONDBPlugin.prepareConf
  , _prepareInstance = JSONDBPlugin.prepareInstance

module.exports = Collection

; Object.defineProperties(Collection, {
  Table: { value: Table }
  , ResultSet: { value: Table.ResultSet }
})

; _inherits(Collection, Object, {
  // parse: _parse
  // , stringify: _stringify
  // , loadJson: _loadJson
  // , saveAsJson: _saveAsJson
  // , getTable: _getTable
  // , attachTable: _attachTable
  // , moveTable: _moveTable
  // , dropTable: _dropTable
  // , loadTable: _loadTable
  // , saveTable: _loadTable
})

function Collection (conf) {
  var conf = _prepareConf(arguments, 'jsondb.collection', Collection, ['load', 'save'])
  ; if ( ! (this instanceof Collection)) throw new Error(['constructor Collection called as function'].join(''))
  ; _prepareInstance.call(this, conf)
}
