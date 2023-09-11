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
var platform_browser_1 = require('@angular/platform-browser');
var router_1 = require('@angular/router');
var item_service_1 = require('../items/item.service');
var api_service_1 = require('../shared/api.service');
var global_service_1 = require('../global.service');
var ViewComponent = (function () {
    function ViewComponent(titleService, globals, _route, _router, _itemService, _apiService) {
        var _this = this;
        this.titleService = titleService;
        this.globals = globals;
        this._route = _route;
        this._router = _router;
        this._itemService = _itemService;
        this._apiService = _apiService;
        this.title = "Test";
        _route.params.subscribe(function (params) { _this.updateView(params); });
    }
    ViewComponent.prototype.updateView = function (params) {
        var _this = this;
        if (params.id) {
            this._itemService.fetchItem(params.id).subscribe(function (item) { if (item != null) {
                _this.item = item;
                _this.updateTitle();
                _this.updateMetadata();
            }
            else {
                _this.item = null;
            } }, function (error) { return _this.globals.error = error; });
        }
    };
    ViewComponent.prototype.updateMetadata = function () {
        var _this = this;
        this._apiService.get('types/' + this.item.type).subscribe(function (result) { if (result != null) {
            _this.metadataFields = result[_this.item.type]['metadata'];
        } }, function (error) { return _this.globals.error = error; });
    };
    ViewComponent.prototype.updateTitle = function () {
        this.titleService.setTitle(this.globals.name + ' | ' + this.item.name);
    };
    ViewComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'view.component.html'
        }), 
        __metadata('design:paramtypes', [platform_browser_1.Title, global_service_1.GlobalService, router_1.ActivatedRoute, router_1.Router, item_service_1.ItemService, api_service_1.ApiService])
    ], ViewComponent);
    return ViewComponent;
}());
exports.ViewComponent = ViewComponent;
