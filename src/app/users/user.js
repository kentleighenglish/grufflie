/*
 * User Object
 */
"use strict";
var User = (function () {
    function User(id, username, firstname, lastname, token, auth) {
        this.id = id;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.token = token;
        this.auth = auth;
    }
    return User;
}());
exports.User = User;
