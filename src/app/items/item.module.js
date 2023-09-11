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
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var item_service_1 = require('./item.service');
var item_grid_component_1 = require('./item-grid.component');
var item_grid_element_component_1 = require('./item-grid-element.component');
var metadata_field_component_1 = require('./metadata-field.component');
var ItemModule = (function () {
    function ItemModule() {
    }
    ItemModule = __decorate([
        core_1.NgModule({
            declarations: [
                item_grid_component_1.ItemGridComponent,
                item_grid_element_component_1.ItemGridElementComponent,
                metadata_field_component_1.MetadataFieldComponent
            ],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule,
                forms_1.FormsModule
            ],
            exports: [
                item_grid_component_1.ItemGridComponent,
                metadata_field_component_1.MetadataFieldComponent
            ],
            providers: [
                item_service_1.ItemService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ItemModule);
    return ItemModule;
}());
exports.ItemModule = ItemModule;
