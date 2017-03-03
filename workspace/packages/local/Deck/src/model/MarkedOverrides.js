Ext.define('Deck.model.MarkedOverrides', {
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

        marked.InlineLexer.prototype.outputSave = marked.InlineLexer.prototype.output;
        var tasks = ['doCallouts'];
        marked.InlineLexer.prototype.output = function(line) {
            for (var i = 0; i < tasks.length; i++) {
                line = me[tasks[i]](line);
            }
            // "this" is the lexer.
            return this.outputSave(line);
        };

    },

    calloutCss: {
        'TIP:': 'tip',
        'NOTE:': 'note',
        'WARNING:': 'warning',
        'STOP:': 'caution',
        'EXPERIMENT:': 'experiment'
    },

    callouts: ['TIP:', 'NOTE:', 'WARNING:', 'STOP:', 'EXPERIMENT:'],
    calloutHtml: '<div class="block"><span class="{0} content">{1}</span></div>',
    doCallouts: function(line) {
        for (var i = 0; i < this.callouts.length; i++) {
            var c = this.callouts[i];
            if (line.startsWith(c)) {
                var cls = this.calloutCss[c].toLowerCase();
                return Ext.String.format(this.calloutHtml, cls, line.substr(c.length));
            }
        }
        return line;
    },
    expanderRe: /<div.*expander.*caption="(.*)".*>/,
    olStep: /(^\?\?)(.*)(\n\.\n)([^]*)/,
    olEndStep: /(.*)(\n\.\.$)/,
    doOlStep: function(line) {
        var result = line;
        // result = result.replace(this.expanderRe, function(match, s1) {
        //     debugger;
        //     return '<div class="expander"><span class="expandertitle">' + s1 + '</span>';
        // });
        result = result.replace(this.olStep, function(match, s1, s2, s3, s4) {
            return '<div class="expander collapsed"><span class="expandertitle">' + s2 + '</span><div class="content"><p>' + s4 + '</p>';
        });
        result = result.replace(this.olEndStep, function(match, s1, s2) {
            return s1 + '</div></div>';
        });
        return result;
    }

});
