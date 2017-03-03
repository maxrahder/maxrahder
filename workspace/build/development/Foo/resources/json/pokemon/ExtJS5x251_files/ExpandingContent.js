Ext.define('Engine.view.util.ExpandingContent', {
    extend: 'Ext.Component',
    config: {
        title: '',
        expanded: false,
        content: '',
        expanderElement: null
    },
    titleTag: 'div',
    titleCls: 'training-expandingcontent-title',
    contentTag: 'div',
    contentCls: 'training-expandingcontent-content',
    initComponent: function() {
        var t = Ext.DomHelper.createTemplate({
            children: [{
                tag: this.titleTag,
                expandingContentTitle: true,
                cls: this.titleCls,
                html: '<span class="training-expandingcontent-expander {expanded}"></span>{title}'
            }, {
                tag: this.contentTag,
                expandingContentContent: true,
                cls: this.contentCls,
                html: '<div>{content}</div>'
            }]
        });
        var ee = this.getExpanderElement();
        if (ee) {
            this.setTitle(ee.getAttribute('caption'));
            this.setContent(ee.getHTML());
            ee.setHTML('');
            this.renderTo = ee;
            ee.removeCls('x-hidden');
        }
        this.tpl = t;
        this.callParent();
    },
    getTitleElement: function() {
        return this.el.down('*[expandingContentTitle]');
    },
    onRender: function() {
        var me = this;
        this.callParent();
        this.update({
            title: this.getTitle(),
            content: this.getContent(),
            expanded: (this.getExpanded() ? 'expanded' : '')
        });
        this.titleElement = this.getTitleElement();
        this.contentElement = this.el.down('*[expandingContentContent]');

        this.titleElement.on('click', function(event, target) {
            me.toggle(event);
            // me.contentElement.toggleCls('expand');
            // me.titleElement.toggleCls('open');
        });
    },
    updateExpanded: function(expanded) {
        var me = this;
        if (!(me.contentElement && me.titleElement)) {
            return;
        }
        if (expanded) {
            me.contentElement.addCls('expand');
            me.titleElement.addCls('open');
        } else {
            me.contentElement.removeCls('expand');
            me.titleElement.removeCls('open');
        }
    },
    toggle: function(event) {
        this.setExpanded(!this.getExpanded());
        this.fireEvent('toggle', this, event);
    }
});