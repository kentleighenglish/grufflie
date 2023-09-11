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
var item_service_1 = require('./item.service');
var global_service_1 = require('../global.service');
var MetadataFieldComponent = (function () {
    function MetadataFieldComponent(_itemService, globals) {
        var _this = this;
        this._itemService = _itemService;
        this.globals = globals;
        this.editing = false;
        this.globals.currUser.subscribe(function (user) { return _this.user = user; });
    }
    MetadataFieldComponent.prototype.onFormSave = function () {
        var _this = this;
        var data = {};
        data[this.metadataField.name] = this.metadataValue;
        var dataKeys = Object.keys(data);
        if (typeof this.item.metadata[dataKeys[0]] != 'undefined') {
            this._itemService.saveMetadata(this.item.id, data, this.item.type).subscribe(function (result) { return _this.onFormSaved(result); }, function (error) { return _this.error = error; });
        }
        else {
            this._itemService.createMetadata(this.item.id, data, this.item.type).subscribe(function (result) { return _this.onFormSaved(result); }, function (error) { return _this.error = error; });
        }
    };
    MetadataFieldComponent.prototype.onFormSaved = function (result) {
        this.globals.flash('Metadata:' + this.metadataField.name + ' saved');
        if (result) {
            this.error = null;
        }
        this.editing = false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MetadataFieldComponent.prototype, "metadataField", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MetadataFieldComponent.prototype, "metadataValue", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MetadataFieldComponent.prototype, "item", void 0);
    MetadataFieldComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'metadata-field',
            templateUrl: 'metadata-field.component.html'
        }), 
        __metadata('design:paramtypes', [item_service_1.ItemService, global_service_1.GlobalService])
    ], MetadataFieldComponent);
    return MetadataFieldComponent;
}());
exports.MetadataFieldComponent = MetadataFieldComponent;
