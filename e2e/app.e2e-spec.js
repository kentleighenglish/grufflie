"use strict";
var app_po_1 = require('./app.po');
describe('Grufflie App', function () {
    var page;
    beforeEach(function () {
        page = new app_po_1.GruffliePage();
    });
    it('should display message saying app works', function () {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
