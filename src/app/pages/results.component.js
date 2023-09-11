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
var ResultsComponent = (function () {
    function ResultsComponent(titleService, globals, _itemService, _route, _router, _apiService) {
        this.titleService = titleService;
        this.globals = globals;
        this._itemService = _itemService;
        this._route = _route;
        this._router = _router;
        this._apiService = _apiService;
        this.filter = {
            "limit": 12
        };
        this.results = [];
        this.types = [];
        this.totalReached = false;
        Object.assign(this.filter, this._route.snapshot.params);
    }
    ResultsComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (Object.keys(this.filter).length) {
            this.handleFilterUpdate(this.filter);
        }
        this._apiService.get('types').subscribe(function (result) { if (result != null) {
            _this.types = result;
        } }, function (error) { return _this.globals.error = error; });
    };
    ResultsComponent.prototype.onFormSubmit = function () {
        this.handleFilterUpdate(this.filter);
        this._router.navigate(['search', this.filter]);
    };
    ResultsComponent.prototype.handleFilterUpdate = function (filter) {
        var _this = this;
        this.titleService.setTitle(this.globals.name + ' | ' + this.filter.query);
        if (Object.keys(filter).length > 0) {
            this._itemService.fetchItems(filter).subscribe(function (results) {
                if (results != null) {
                    _this.totalReached = results.length % _this.filter.limit != 0 ? true : false;
                    _this.results = results;
                }
                else {
                    _this.totalReached = true;
                    _this.results = [];
                }
                ;
            }, function (error) { return _this.globals.error = error; });
        }
        else {
            this.totalReached = true;
            this.results = [];
        }
    };
    ResultsComponent.prototype.onLoadMore = function () {
        var currentCount = this.results.length;
        if (!this.totalReached && currentCount) {
            var newFilter = this.filter;
            newFilter.offset = this.results.length;
            var results = this.handleLoadMore(newFilter);
        }
    };
    ResultsComponent.prototype.handleLoadMore = function (filter) {
        var _this = this;
        if (Object.keys(filter).length > 0) {
            this._itemService.fetchItems(filter).subscribe(function (results) {
                if (results != null) {
                    _this.totalReached = results.length % _this.filter.limit != 0 ? true : false;
                    _this.results = _this.results.concat(results);
                }
                else {
                    _this.totalReached = true;
                }
                ;
            }, function (error) { return _this.globals.error = error; });
        }
        else {
            this.totalReached = true;
        }
    };
    ResultsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'results.component.html'
        }), 
        __metadata('design:paramtypes', [platform_browser_1.Title, global_service_1.GlobalService, item_service_1.ItemService, router_1.ActivatedRoute, router_1.Router, api_service_1.ApiService])
    ], ResultsComponent);
    return ResultsComponent;
}());
exports.ResultsComponent = ResultsComponent;
