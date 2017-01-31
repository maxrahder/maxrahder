Ext.define('Engine.util.File', {
	extend: 'Ext.util.Observable',
	required: ['Engine.util.DomParser'],
	config: {
		path: ''
	},
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
	},
	// Returns an array of the child File objects.
	// If this is not a directory, getChildren()
	// returns an empty array. TODO: Passing true in
	// contents will return all children in sub-
	// directories. sub-directories is not yet
	// implemented,
	getChildren: function(callback, subdirectories) {
		var me = this;
		result = [];
		var p = this.getPath();
		if ((p.length > 0) && ((p.substr(0, 1) === '/') || p.substr(p.length - 1, 1) === '/')) {
			// p must start and end with /
			Ext.Ajax.request({
				url: p,
				success: function(response) {
					var text = response.responseText;

					text = text.substr(text.indexOf('<html>'));

					var dom = new DOMParser().parseFromString(text, "text/xml");

					var htmlArray = Ext.dom.Query.select('li a', dom);

					var result = [];
					Ext.Array.forEach(htmlArray, function(item) {
						var s = item.innerHTML.trim();
						var indexOfExtension = s.indexOf('.');
						if ((s !== '.DS_Store') && (indexOfExtension !== -1)) {
							result.push(s.substr(0, indexOfExtension));
						}
					});

					if (callback) {
						callback(result);
					}
				}
			});
		} else {
			return result;
		}
	}
});