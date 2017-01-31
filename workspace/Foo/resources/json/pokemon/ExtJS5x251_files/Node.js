Ext.define('Engine.model.Node', {
    extend: 'Ext.util.Observable',
    singleton: true,
    config: {
        record: null,
        fileId: '',
        slideText: ''
    },
    generateFileId: function() {
        // Returns something like:
        // "2012-09-18_16-17_12-118_Z"
        // Meaning, September 18, at 16:17 and 12.118 seconds, UTC.
        function pad(number, length) {
            // Hack to pad "number" with leading zeros
            // for a final length of "length"
            length = length || 2;
            number = number + ''; // Make it a string
            var toCopyLength = (length - number.length);
            toCopyLength = (toCopyLength < 0) ? 0 : toCopyLength;
            return '0000000000'.substr(0, toCopyLength) + number;
        }
        var d = new Date();
        return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + '_' + pad(d.getUTCHours()) + '-' + pad(d.getUTCMinutes()) + '_' + pad(d.getUTCSeconds()) + '-' + pad(d.getUTCMilliseconds(), 3) + '_Z';

    },
    data: {},
    slideHtml: '', // read-only
    updateSlideText: function(text) {
        if (this.getRecord().isMarkdown() && (typeof marked !== 'undefined')) {
            Engine.util.MarkedOverrides.engine = {
                olStart: 0
            }; // Try to auto number lab steps. See lexer code.
            this.slideHtml = marked(text);
        } else {
            this.slideHtml = text;
        }
        if (!Engine.isDev) {
            this.slideHtml = this.slideHtml.replace(/..\/_Shared/g, '_Shared');
        }
    },
    updateRecord: function(record) {
        var me = this;

        this.data = Ext.apply({}, record.getData());

        this.setFileId(record.data.fileId);

        function response(parameters, success, response) {
            var status = response.status;
            var text = response.responseText;

            if ((status >= 400) && (status <= 499)) {
                console.log('Not found: ' + parameters + '/n' + text);
            } else if ((status >= 200) && (status <= 299)) {

                me.setSlideText(text);
                Ext.apply(me.data, {
                    slideHtml: me.slideHtml
                });
            }
            me.fireEvent('change', me);

        }
        if (record.isLeaf() && record.data.fileId) {
            Ext.Ajax.request({
                url: record.getFilePathAndName(),
                callback: response
            });
        } else {
            me.fireEvent('change', me);
        }
    },
    isSlide: function() {
        var record = this.getRecord();
        return record ? this.getRecord().isLeaf() : false;
    },
    isTopic: function() {
        var record = this.getRecord();
        return record ? record.isTopic() : false;
    },
    getTopicArray: function() {
        var record = this.getRecord();
        return record ? record.getTopicArray() : [];
    },
    getTitle: function() {
        var record = this.getRecord();
        return record ? record.get('text') : '';
    },
    getTopicId: function() {
        var record = this.getRecord();
        return record ? record.get('topicId') : '';
    },
    isSplash: function() {
        var record = this.getRecord();
        return record ? (this.getTopicId() === 'splash') : true;
    }

})