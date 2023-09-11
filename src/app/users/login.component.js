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
var api_service_1 = require('../shared/api.service');
var user_service_1 = require('./user.service');
var global_service_1 = require('../global.service');
var LoginComponent = (function () {
    function LoginComponent(_route, globals, _router, _apiService, _userService) {
        this._route = _route;
        this.globals = globals;
        this._router = _router;
        this._apiService = _apiService;
        this._userService = _userService;
        this.user = {};
        this.signUp = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var url = this._route.snapshot.url[0].path;
        if (url == 'login') {
            this.signUp = false;
        }
        else {
            this.signUp = true;
        }
    };
    LoginComponent.prototype.onFormSubmit = function () {
        var _this = this;
        if (this.signUp) {
            if (this.user.username != undefined &&
                this.user.email != undefined &&
                this.user.emailConfirm != undefined &&
                this.user.password != undefined &&
                this.user.passwordConfirm != undefined) {
                this._userService.createUser(this.user).subscribe(function (response) { if (response == true) {
                    _this.globals.flash('New account created');
                    _this._router.navigate(['/login']);
                } }, function (error) { return _this.fieldError = error; });
            }
        }
        else {
            if (this.user.username != undefined &&
                this.user.password != undefined) {
                this._userService.login(this.user).subscribe(function (response) {
                    if (!response.formData) {
                        _this.fieldError = 'Please fill in both fields';
                    }
                    else if (!response.username || !response.password) {
                        _this.fieldError = 'Incorrect username or password.';
                    }
                    if (response.formData && response.username && response.password) {
                        _this.globals.refreshLoginState(response.userData);
                        _this._router.navigate(['/']);
                        _this.globals.flash("Logged In Successfully");
                    }
                }, function (error) { return _this.globals.error = error; });
            }
        }
    };
    LoginComponent.prototype.testPasswordStrength = function () {
        var _this = this;
        var url = 'passwordStrength/';
        var i = 0;
        for (var field in this.user) {
            var value = this.user[field];
            if (value != "") {
                url += field + ":" + encodeURIComponent(value);
                if ((i + 1) != Object.keys(this.user).length) {
                    url += ",";
                }
            }
            i++;
        }
        var pw = this.user.password;
        if (pw != undefined && pw != "") {
            this._apiService.get(url).subscribe(function (response) { _this.passwordScore = Number(response.score); _this.passwordCrackTime = response.crack_time_string; });
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'login.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, global_service_1.GlobalService, router_1.Router, api_service_1.ApiService, user_service_1.UserService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
