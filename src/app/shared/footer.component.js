"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var global_service_1 = require('../global.service');
var FooterComponent = (function () {
    function FooterComponent(globals, _router) {
        this.globals = globals;
        this._router = _router;
    }
    FooterComponent.prototype.ngOnInit = function () {
        var defaultLinks = this.globals.footerLinks;
        if (this.footerLinks != undefined) {
            this.footerLinks = defaultLinks.concat(this.footerLinks);
        }
        else {
            this.footerLinks = defaultLinks;
        }
    };
    FooterComponent.prototype.call = function (func) {
        func.call();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], FooterComponent.prototype, "footerLinks", void 0);
    FooterComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-footer',
            templateUrl: 'footer.component.html'
        }), 
        __metadata('design:paramtypes', [global_service_1.GlobalService, router_1.Router])
    ], FooterComponent);
    return FooterComponent;
}());
exports.FooterComponent = FooterComponent;
