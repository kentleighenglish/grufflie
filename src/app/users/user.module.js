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
var shared_module_1 = require('../shared/shared.module');
var user_service_1 = require('./user.service');
var login_component_1 = require('./login.component');
var unique_username_directive_1 = require('./unique-username.directive');
var match_field_directive_1 = require('./match-field.directive');
var UserModule = (function () {
    function UserModule() {
    }
    UserModule = __decorate([
        core_1.NgModule({
            declarations: [
                login_component_1.LoginComponent,
                unique_username_directive_1.UniqueUsernameValidator,
                match_field_directive_1.MatchFieldValidator
            ],
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild([
                    { path: 'login', component: login_component_1.LoginComponent },
                    { path: 'signup', component: login_component_1.LoginComponent },
                ]),
                forms_1.FormsModule
            ],
            exports: [],
            providers: [
                user_service_1.UserService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
