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
var api_service_1 = require('./shared/api.service');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var notification_1 = require('./notification');
var GlobalService = (function () {
    function GlobalService(_apiService) {
        var _this = this;
        this._apiService = _apiService;
        this.name = "Grufflie";
        this._currUser = new BehaviorSubject_1.BehaviorSubject({});
        this.currUser = this._currUser.asObservable();
        this._notifications = new BehaviorSubject_1.BehaviorSubject([]);
        this._noteId = 0;
        this.notifications = this._notifications.asObservable();
        this.footerLinks = [
            {
                text: "Search",
                route: ["/search"]
            },
            {
                text: "FAQ",
                route: ["/faq"]
            },
            {
                text: "About Us",
                route: ["/about-us"]
            },
            {
                text: "Login/Sign Up",
                route: ["/login"]
            }
        ];
        this._apiService.get('loggedIn').subscribe(function (response) {
            _this.refreshLoginState(response);
        });
    }
    GlobalService.prototype.refreshLoginState = function (userData) {
        this.footerLinks.pop();
        if (userData != undefined && userData != null && userData != false) {
            this._currUser.next(userData);
            this.footerLinks.push({
                text: "Logout",
                action: function () { this.logout(); }.bind(this)
            });
        }
        else {
            this._currUser.next({});
            this.footerLinks.push({
                text: "Login/Sign Up",
                route: ["/login"]
            });
        }
    };
    GlobalService.prototype.addNotification = function (message, type) {
        var prevNot = this._notifications.getValue();
        prevNot.push(new notification_1.Notification({
            text: message,
            type: type,
            id: this._noteId,
            destroy: function (id) { this.removeNotification(id); }.bind(this, this._noteId)
        }));
        this._noteId++;
        this._notifications.next(prevNot);
    };
    GlobalService.prototype.removeNotification = function (id) {
        var prevNot = this._notifications.getValue();
        prevNot.map(function (item, index) {
            if (item.id == id) {
                prevNot[index] = undefined;
                prevNot.splice(index, 1);
            }
        });
        this._notifications.next(prevNot);
    };
    GlobalService.prototype.flash = function (message) {
        this.addNotification(message, 'flash');
    };
    GlobalService.prototype.error = function (message) {
        this.addNotification(message, 'error');
    };
    GlobalService.prototype.logout = function () {
        var _this = this;
        this._apiService.get('logout').subscribe(function (response) {
            if (response == true) {
                _this.flash("Logged out successfully");
                _this.refreshLoginState(null);
            }
        });
    };
    GlobalService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_service_1.ApiService])
    ], GlobalService);
    return GlobalService;
}());
exports.GlobalService = GlobalService;
