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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
require('rxjs/add/observable/of');
var ItemService = (function () {
    function ItemService(_http) {
        this._http = _http;
        this._ApiUrl = 'api';
        this.pass = false;
    }
    ItemService.prototype.generateUrl = function (params) {
        var url = this._ApiUrl + '/';
        if (typeof (params.query) != undefined || typeof (params.type) != undefined) {
            url += 'filter/';
            var i = 0;
            for (var key in params) {
                var param = params[key];
                if ((key == "query" || key == "tag" || key == "type") && param) {
                    this.pass = true;
                }
                if (typeof param == 'string') {
                    var parsedParam = param.replace(/\s/g, '+');
                    url += key + ':' + parsedParam;
                }
                else {
                    url += key + ':' + param;
                }
                i++;
                if (i != Object.keys(params).length) {
                    url += ',';
                }
            }
            url += '/';
        }
        else if (typeof (params.id) != undefined) {
        }
        return url;
    };
    ItemService.prototype.fetchItems = function (filter) {
        var url = this.generateUrl(filter);
        if (this.pass) {
            this.pass = false;
            return this._http.get(url)
                .map(function (response) { return response.json().success; })
                .catch((this.handleError));
        }
        else {
            this.pass = false;
            return Observable_1.Observable.of();
        }
    };
    ItemService.prototype.fetchItem = function (id) {
        var url = this._ApiUrl + '/items/' + id;
        return this._http.get(url)
            .map(function (response) { return response.json().success; })
            .catch((this.handleError));
    };
    ItemService.prototype.createMetadata = function (id, metadata, type) {
        var url = this._ApiUrl + '/items/' + id + '/metadata';
        var data = {
            'metadata': metadata,
            'itemType': type
        };
        return this._http.post(url, data)
            .map(function (response) { return response.json().success; })
            .catch((this.handleError));
    };
    ItemService.prototype.saveMetadata = function (id, metadata, type) {
        var url = this._ApiUrl + '/items/' + id + '/metadata';
        var data = {
            'metadata': metadata,
            'itemType': type
        };
        return this._http.put(url, data)
            .map(function (response) { return response.json().success; })
            .catch((this.handleError));
    };
    ItemService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.statusText || 'Server Error');
    };
    ItemService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ItemService);
    return ItemService;
}());
exports.ItemService = ItemService;
