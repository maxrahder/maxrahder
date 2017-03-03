Ext.define('Engine.util.MarkedOverrides', {
    extend: 'Ext.panel.Panel',
    requires: [],
    singleton: true,
    constructor: function() {
        var me = this;

        // var callouts = [
        // 	/^ *(TIP:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(NOTE:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(WARNING:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(STOP:) *([^\n]+?) *#* *(?:\n+|$)/,
        // 	/^ *(EXPERIMENT:) *([^\n]+?) *#* *(?:\n+|$)/
        // ];
        // var domString = '<div class="block"><span class="{0} content">{1}</div>';
        // marked.InlineLexer.prototype.outputOriginal = marked.InlineLexer.prototype.output;
        // marked.InlineLexer.prototype.output = function(src) {
        // 	var result;
        // 	for (var i = 0; i < callouts.length; i++) {
        // 		var cap = callouts[i].exec(src);
        // 		if (cap) {
        // 			var cls = cap[1];
        // 			cls = cls.substr(0, cls.length - 1).toLowerCase();
        // 			result = Ext.String.format(domString, cls, cap[2]);
        // 			break;
        // 		}
        // 	}
        // 	return result || this.outputOriginal(src);
        // };

        var me = this;
        marked.InlineLexer.prototype.outputSave = marked.InlineLexer.prototype.output;
        var tasks = ['doCallouts', 'doOlStep', 'doDocsUrl'];
        marked.InlineLexer.prototype.output = function(line) {
            for (var i = 0; i < tasks.length; i++) {
                line = me[tasks[i]](line);
            }
            // "this" is the lexer.
            return this.outputSave(line);
        }

    },

    callouts: ['TIP:', 'NOTE:', 'WARNING:', 'STOP:', 'EXPERIMENT:'],
    calloutHtml: '<div class="block"><span class="{0} content">{1}</span></div>',
    doCallouts: function(line) {
        for (var i = 0; i < this.callouts.length; i++) {
            var c = this.callouts[i];
            if (Engine.util.String.beginsWith(line, c)) {
                var cls = c.substr(0, c.length - 1).toLowerCase();
                return Ext.String.format(this.calloutHtml, cls, line.substr(c.length));
            }
        }
        return line;
    },

    classicApiRE: /href="classicAPI/i,
    classicGuidesRE: /href="classicGuides/i,
    doDocsUrl: function(line) {
        // From: <a href="classic/#!/api/String-method-replace">Hi there</a>
        // To:   <a href="http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/String-method-replace>Hi there</a>"

        line = line.replace(this.classicApiRE, 'href="' + Engine.Global.docsUrl.classicAPI);
        line = line.replace(this.classicGuidesRE, 'href="' + Engine.Global.docsUrl.classicGuides);

        return line;
    },

    doOlHtml: '<ol start={0}><li>{1}</li></ol>',
    olStepToken: '??',
    doOlStep: function(line) {
        if (Engine.util.String.beginsWith(line, this.olStepToken)) {
            var result = line.substr(this.olStepToken.length);
            // console.log('result = ' + result);
            return Ext.String.format(this.doOlHtml, ++this.engine.olStart, result);
        }
        return line;
    }

});