Ext.ns('Engine');
Engine.isLocal = ((window.location.origin.indexOf('http://local') === 0) || (window.location.origin.indexOf('ngrok') >= 0));
Engine.isDev = (Engine.isLocal && (window.location.pathname.indexOf('/build/') === -1));
Engine.sharedRootPath = Engine.isDev ? '../_Shared/' : '_Shared/';

Ext.define('Engine.Global', {

    singleton: true,
    instructor: false,
    constructor: function() {
        this.copyrightYears = '2013 &mdash; ' + Ext.Date.format(new Date(), 'Y');
        this.copyrightNotice = this.copyrightYears + ' Sencha Inc. All rights reserved. This document is provided for the sole use of a named participant in a Sencha technical training course.  Any other use or reproduction of this document is unlawful without the express written consent of Sencha Inc.';

    },
    contentPath: 'resources/Data/SlideContent/',
    pagesPath: 'resources/Data/SlideContent/Pages/',
    hiddenPath: 'resources/Data/SlideContent/hidden.json',

    sharedPagesPath: Engine.sharedRootPath + 'Data/SlideContent/Pages/',

    libPath: '_lib/',
    topicsPath: 'resources/Data/SlideContent/Topics/',

    sharedRootPath: Engine.sharedRootPath,

    backendSyncPusherUrl: '_lib/backend/Pusher/pusher.php',
    backendSavePageUrl: '_lib/backend/savePage.php',
    backendRenameFileUrl: '_lib/backend/renameFile.php',
    backendSaveTopicUrl: '_lib/backend/saveTopic.php',
    backendSaveHiddenUrl: '_lib/backend/saveHidden.php',

    docsUrl: {
        classicAPI: 'http://docs.sencha.com/extjs/6.0/6.0.0-classic',
        classicGuides: 'http://docs.sencha.com/extjs/6.0'
    },

    javaScriptViewerHeadHtml: [],

    courseId: '',

    showReverseColorToggle: true,

    theme: 'eclipse',

    getCookie: function(cookieName, defaultValue) {
        var result = defaultValue || '';
        var cookieName = cookieName + '=';
        var cookieIndex = document.cookie.indexOf(cookieName);
        if (cookieIndex > -1) {
            var s = document.cookie.substr(cookieIndex + cookieName.length);
            var endIndex = s.indexOf(';');
            result = (endIndex > -1) ? s.substr(0, endIndex) : s;
        }
        return result;
    }
})