/**
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         identifier: {
 *             type: 'fileid'
 *         }
 *     });
 *     // Assign id's of like "2017-01-28T20-58-26-790Z", meaning, January 28, at 20:50 and 26.790 seconds, UTC.
 *
 */
Ext.define('Deck.model.IdGenerator', {
    extend: 'Ext.data.identifier.Generator',
    alias: 'data.identifier.fileid',
    suffix: 0,
    generate: function() {
        // If two are created within a millisecond, you'd have duplicate IDs. Therefore,
        // check and add an incremented suffix if needed.
        var result = Ext.Date.format(new Date(), 'C').replace(/\.|\:/g, '-');
        if (result === this.previous) {
            result += ('-' + ++this.suffix);
        } else {
            // They aren't the same, so set the suffix back to zero.
            this.suffix = 0;
            this.previous = result;
        }
        return result;
    }
});
