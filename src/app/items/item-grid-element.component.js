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
var ItemGridElementComponent = (function () {
    function ItemGridElementComponent(_router) {
        this._router = _router;
    }
    ItemGridElementComponent.prototype.ngOnInit = function () {
        if (this.item) {
            this.id = this.item.id;
        }
        else if (this.relation) {
            this.id = this.relation.relationId;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ItemGridElementComponent.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ItemGridElementComponent.prototype, "relation", void 0);
    ItemGridElementComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'item-grid-element',
            templateUrl: 'item-grid-element.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], ItemGridElementComponent);
    return ItemGridElementComponent;
}());
exports.ItemGridElementComponent = ItemGridElementComponent;
