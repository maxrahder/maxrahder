Ext.define("YelpExtplorer.view.business.edit.Window", {
    extend: 'Ext.window.Window',
    xtype: 'editbusinesswindow',
    requires: ['YelpExtplorer.view.business.edit.WindowController', 'YelpExtplorer.view.business.edit.WindowModel', 'Ext.form.Panel'],
    controller: 'business-edit-window',
    viewModel: {
        type: 'business-edit-window'
    },
    closable: false,
    resizable: false,
    bodyPadding: 12,
    modal: true,

    layout: 'fit',

    items: [{
        xtype: 'form',
        reference: 'form',
        modelValidation: true,
        defaults: {
            margin: 4
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'name',
            labelWidth: 34,
            name: 'name',
            bind: {
                value: '{business.name}'
            }
        }, {
            xtype: 'rating',
            rounding: 0.5,
            bind: {
                value: '{business.rating}'
            },
            minimum: 1, // Yelp ratings go from 1 - 5
            maximum: 5,
            selectedStyle: 'color: #ff4444', // Pale red
            overStyle: 'color: #ff0000' // Red
        }],
        buttons: [{
            text: 'Save',
            handler: 'onSaveClick',
            ui: 'save',
            formBind: true
        }, {
            text: 'Cancel',
            handler: 'onCancelClick',
        }]
    }]
});
