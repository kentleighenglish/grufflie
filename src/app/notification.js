"use strict";
var Notification = (function () {
    function Notification(settings) {
        this.settings = settings;
        this._count = 0;
        this._delay = 200;
        this._death = 3000;
        this.text = settings.text;
        this.type = settings.type;
        this.id = settings.id;
        if (this.type == 'error') {
            this._death = 10000;
        }
        this._destroy = settings.destroy;
        this.status = "init";
        var interval = setInterval(function () {
            if (this._count == 0) {
                this.status = "open";
            }
            if (this._count == this._death - this._delay) {
                this.status = "closed";
            }
            if (this._count == this._death) {
                clearInterval(interval);
                settings.destroy.call();
            }
            this._count = this._count + 100;
        }.bind(this), 100);
    }
    Notification.prototype.destroy = function () {
        this.status = "closing";
        var die = setTimeout(function () {
            this.status = "closed";
            this._destroy.call();
        }.bind(this), this._delay);
    };
    return Notification;
}());
exports.Notification = Notification;
