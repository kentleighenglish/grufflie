"use strict";
var protractor_1 = require('protractor');
var GruffliePage = (function () {
    function GruffliePage() {
    }
    GruffliePage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    GruffliePage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return GruffliePage;
}());
exports.GruffliePage = GruffliePage;
