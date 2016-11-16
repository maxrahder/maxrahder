Ext.application({
    name: 'TestEditView',

    launch: function () {
        Ext.select('pre').each(function (element) {

            console.dir(element);

            Ext.create('EditView.view.editview.PreTagEditAndView', {
                pre: element.dom,
                renderTo: element.dom
            });



        });
        console.log('removeCls()');
        Ext.getBody().removeCls('x-hidden');
    }

});