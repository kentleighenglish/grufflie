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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var MatchFieldValidator = (function () {
    function MatchFieldValidator(matchField, reverse) {
        this.matchField = matchField;
        this.reverse = reverse;
    }
    Object.defineProperty(MatchFieldValidator.prototype, "isReverse", {
        get: function () {
            if (!this.reverse)
                return false;
            return this.reverse === 'true' ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    MatchFieldValidator.prototype.validate = function (c) {
        // self value
        var v = c.value;
        // control vlaue
        var e = c.root.get(this.matchField);
        // value not equal
        if (e && v !== e.value && !this.isReverse) {
            return {
                matchField: true
            };
        }
        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['matchField'];
            if (!Object.keys(e.errors).length)
                e.setErrors(null);
        }
        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({ matchField: true });
        }
        return null;
    };
    MatchFieldValidator = __decorate([
        core_1.Directive({
            selector: '[matchField][ngModel],[matchField][formControl],[matchField][formControlName]',
            providers: [
                {
                    provide: forms_1.NG_VALIDATORS,
                    useExisting: core_1.forwardRef(function () { return MatchFieldValidator; }),
                    multi: true
                }
            ]
        }),
        __param(0, core_1.Attribute('matchField')),
        __param(1, core_1.Attribute('reverse')), 
        __metadata('design:paramtypes', [String, String])
    ], MatchFieldValidator);
    return MatchFieldValidator;
}());
exports.MatchFieldValidator = MatchFieldValidator;
