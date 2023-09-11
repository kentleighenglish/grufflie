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
var UserService = (function () {
    function UserService(_http) {
        this._http = _http;
        this._ApiUrl = 'api';
        this.pass = false;
    }
    UserService.prototype.fetchUser = function (id) {
        var url = this._ApiUrl + '/users/' + id;
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
    UserService.prototype.createUser = function (formData) {
        var url = this._ApiUrl + '/users';
        if (formData) {
            return this._http.post(url, formData)
                .map(function (response) { return response.json().success; })
                .catch((this.handleError));
        }
        else {
            return Observable_1.Observable.of();
        }
    };
    UserService.prototype.login = function (formData) {
        if (formData.username && formData.password) {
            var remember = formData.remember ? ',remember:' + formData.remember : '';
            var url = this._ApiUrl + '/login/username:' + encodeURIComponent(formData.username) + ',password:' + encodeURIComponent(formData.password) + remember;
            return this._http.get(url)
                .map(function (response) { return response.json().success; })
                .catch((this.handleError));
        }
        else {
            return Observable_1.Observable.of(false);
        }
    };
    UserService.prototype.logout = function () {
        var url = this._ApiUrl + '/logout';
        return this._http.get(url)
            .map(function (response) { return response.json().success; })
            .catch((this.handleError));
    };
    UserService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.statusText || 'Server Error');
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
