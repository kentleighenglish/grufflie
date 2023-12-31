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
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
//components
var header_component_1 = require('./header.component');
var footer_component_1 = require('./footer.component');
var logo_component_1 = require('./logo.component');
var search_component_1 = require('./search.component');
var flash_component_1 = require('./flash.component');
var api_service_1 = require('./api.service');
var ucfirst_pipe_1 = require('./ucfirst.pipe');
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                logo_component_1.LogoComponent,
                search_component_1.SearchComponent,
                flash_component_1.FlashComponent,
                ucfirst_pipe_1.UppercaseFirstPipe
            ],
            imports: [
                forms_1.FormsModule,
                common_1.CommonModule,
                router_1.RouterModule
            ],
            exports: [
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                logo_component_1.LogoComponent,
                search_component_1.SearchComponent,
                flash_component_1.FlashComponent,
                ucfirst_pipe_1.UppercaseFirstPipe
            ],
            providers: [
                api_service_1.ApiService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
