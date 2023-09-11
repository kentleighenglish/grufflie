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
//Modules
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var shared_module_1 = require('./shared/shared.module');
var item_module_1 = require('./items/item.module');
var user_module_1 = require('./users/user.module');
//Components
var app_component_1 = require('./app.component');
var landing_component_1 = require('./pages/landing.component');
var results_component_1 = require('./pages/results.component');
var view_component_1 = require('./pages/view.component');
var global_service_1 = require('./global.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                landing_component_1.LandingComponent,
                results_component_1.ResultsComponent,
                view_component_1.ViewComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                shared_module_1.SharedModule,
                item_module_1.ItemModule,
                user_module_1.UserModule,
                common_1.CommonModule,
                router_1.RouterModule.forRoot([
                    { path: 'view/:id', component: view_component_1.ViewComponent },
                    { path: 'search', component: results_component_1.ResultsComponent },
                    { path: '', component: landing_component_1.LandingComponent },
                    { path: '**', redirectTo: '', pathMatch: 'full' }
                ])
            ],
            providers: [
                platform_browser_1.Title,
                [global_service_1.GlobalService]
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
