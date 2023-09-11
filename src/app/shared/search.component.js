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
var item_service_1 = require('../items/item.service');
var global_service_1 = require('../global.service');
var SearchComponent = (function () {
    function SearchComponent(_itemService, _router, globals, _elRef) {
        this._itemService = _itemService;
        this._router = _router;
        this.globals = globals;
        this._elRef = _elRef;
        this.filter = {
            'limit': 5
        };
        this.filterStatus = 'empty';
        this.results = [];
        this.hideSuggestions = true;
        this.focusedEl = 0;
    }
    SearchComponent.prototype.onQueryChange = function () {
        this.hideSuggestions = false;
        if (this.filter.query == "") {
            delete this.filter.query;
        }
        this.updateResults();
    };
    SearchComponent.prototype.onFormSubmit = function () {
        this.hideSuggestions = true;
        var passParams = {
            'query': this.filter.query
        };
        this._router.navigate(['search', passParams]);
    };
    SearchComponent.prototype.onItemClick = function (id) {
        if (id != undefined) {
            this._router.navigate(['/view', id]);
        }
        this.hideSuggestions = true;
        this.results = [];
        this.filterStatus = 'empty';
        delete this.filter.query;
    };
    SearchComponent.prototype.checkFilterStatus = function (param) {
        if (param === void 0) { param = null; }
        var empty = true;
        for (var f in this.filter) {
            f = this.filter[f];
            if (f.length) {
                empty = false;
                ;
            }
        }
        if (empty) {
            this.filterStatus = 'empty';
        }
        else if (param) {
            this.filterStatus = param;
        }
    };
    SearchComponent.prototype.updateResults = function () {
        var _this = this;
        if (this.results.length == 0) {
            this.checkFilterStatus('pending');
        }
        if (this.filter.query != undefined) {
            this._itemService.fetchItems(this.filter).subscribe(function (results) { if (results != null) {
                _this.results = results;
            }
            else {
                _this.results = [];
            } ; _this.checkFilterStatus('done'); }, function (error) { return _this.globals.error = error; });
        }
        else {
            this.results = [];
            this.checkFilterStatus('done');
        }
    };
    SearchComponent.prototype.scrollSelection = function (e, gotoEl) {
        if (gotoEl === void 0) { gotoEl = this.focusedEl; }
        var elements = this._elRef.nativeElement.querySelectorAll('input[name="filterQuery"], li.item>a');
        if (e.key != 'ArrowUp' && e.key != 'ArrowDown') {
            gotoEl = 0;
        }
        else if (gotoEl == 0 && e.key == 'ArrowUp') {
            gotoEl = (elements.length - 1);
        }
        else if (gotoEl == (elements.length - 1) && e.key == 'ArrowDown') {
            gotoEl = 0;
        }
        else if (e.key == 'ArrowUp') {
            gotoEl--;
        }
        else if (e.key == 'ArrowDown') {
            gotoEl++;
        }
        this.focusedEl = gotoEl;
        var focusedElement = elements[gotoEl];
        focusedElement.focus();
    };
    SearchComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'search',
            templateUrl: 'search.component.html'
        }), 
        __metadata('design:paramtypes', [item_service_1.ItemService, router_1.Router, global_service_1.GlobalService, core_1.ElementRef])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
