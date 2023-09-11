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
var forms_1 = require('@angular/forms');
var api_service_1 = require('../shared/api.service');
var UniqueUsernameValidator = (function () {
    function UniqueUsernameValidator(_apiService) {
        this._apiService = _apiService;
    }
    UniqueUsernameValidator.prototype.validate = function (c) {
        var _this = this;
        return new Promise(function (resolve) {
            var value = c.value;
            if (value) {
                _this._apiService.get('checkUsername/value:' + value).subscribe(function (result) {
                    if (result != null) {
                        var valid = typeof (result) == 'string' && result == 'true' ? true : false;
                        if (valid) {
                            resolve(null);
                        }
                        else {
                            resolve({ validUniqueUsername: true });
                        }
                    }
                    else {
                        resolve(null);
                    }
                }, function (error) { return { unknownError: true }; });
            }
            else {
                resolve(null);
            }
        });
    };
    UniqueUsernameValidator = __decorate([
        core_1.Directive({
            selector: '[validateUniqueUsername][ngModel],[validateUniqueUsername][formControl],[validateUniqueUsername][formControlName]',
            providers: [
                {
                    provide: forms_1.NG_ASYNC_VALIDATORS,
                    useExisting: core_1.forwardRef(function () { return UniqueUsernameValidator; }),
                    multi: true
                }
            ]
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService])
    ], UniqueUsernameValidator);
    return UniqueUsernameValidator;
}());
exports.UniqueUsernameValidator = UniqueUsernameValidator;
