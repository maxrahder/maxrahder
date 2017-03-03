Ext.define('Engine.view.content.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'slide',
    requires: [
        'Engine.view.content.Toolbar',
        'Engine.view.content.page.Body',
        'Engine.view.content.page.Title',
        'Engine.view.content.page.Topic'
    ],

    cls: 'content',
    border: false,
    //autoScroll: true,
    config: {
        slideWidth: 1024,
        slideHeight: 768,
        slideMargin: 15
    },

    id: 'content',
    layout: 'card',

    items: [{
        xtype: 'training_contentbody'
    }, {
        xtype: 'training_contenttopic'
    }, {
        xtype: 'training_titlepage'
    }],

    dockedItems: [{
        xtype: 'contenttoolbar',
        dock: 'top'
    }],

    initComponent: function() {

        Engine.model.Node.on('change', this.onNodeChange, this);
        this.callParent();

    },

    onNodeChange: function(node) {

        Ext.globalEvents.fireEvent('slidebeforerender');

        var record = node.getRecord();
        // console.log(record.getTopicArray());
        this.record = record; // Save for save to know fileId
        var data = {
            type: record.isLab() ? 'lab' : (record.isSlide() ? 'slide' : 'topic'),
            topic: record.getTopicText(),
            subtopic: record.getSubTopicText(),
            topics: record.getTopicArray(),
            title: record.getSlideText(),
            duration: record.getDuration(),
            body: node.data.slideHtml
        };
        var card = null;
        if (node.isSplash()) {
            card = this.down('training_titlepage');
            card.updateContent(node, data);
        } else if (node.isTopic()) {
            card = this.down('training_contenttopic');
            card.updateContent(node);
        } else if (node.isSlide()) {
            card = this.down('training_contentbody');
            card.updateContent(data, node);
        }
        this.getLayout().setActiveItem(card);
    }
});