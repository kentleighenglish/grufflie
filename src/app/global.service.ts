import { Injectable } from '@angular/core';
import { ApiService } from './shared/api.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Notification } from './notification';

@Injectable()
export class GlobalService {
	public name: string = "Grufflie";

	private _currUser: BehaviorSubject<any> = new BehaviorSubject({});
	public currUser: Observable<any> = this._currUser.asObservable();
	private _notifications: BehaviorSubject<any[]> = new BehaviorSubject([]);
	private _noteId: number = 0;
	public notifications: Observable<Array<any>> = this._notifications.asObservable();

	public footerLinks: any[] = [
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

	constructor(
		private _apiService: ApiService
	) {
		this._apiService.get('loggedIn').subscribe(
			response => {
				this.refreshLoginState(response);
			}
		);
	}

	refreshLoginState(userData) {
		this.footerLinks.pop();
		if(userData != undefined && userData != null && userData != false) {
			this._currUser.next(userData);

			this.footerLinks.push({
				text: "Logout",
				action: function(){ this.logout() }.bind(this)
			});
		} else {
			this._currUser.next({});

			this.footerLinks.push({
				text: "Login/Sign Up",
				route: ["/login"]
			});
		}
	}

	addNotification(message, type) {
		let prevNot = this._notifications.getValue();
		prevNot.push(new Notification({
			text: message,
			type: type,
			id: this._noteId,
			destroy: function(id) { this.removeNotification(id) }.bind(this, this._noteId)
		}));
		this._noteId++;
		this._notifications.next(prevNot);
	}

	removeNotification(id) {
		let prevNot = this._notifications.getValue();
		prevNot.map(function(item, index){
			if(item.id == id){
				prevNot[index] = undefined;
				prevNot.splice(index, 1);
			}
		});
		this._notifications.next(prevNot);
	}

	flash(message: string) {
		this.addNotification(message, 'flash');
	}
	error(message: string) {
		this.addNotification(message, 'error');
	}

	logout(): void {
		this._apiService.get('logout').subscribe(
			response => {
				if(response == true){
					this.flash("Logged out successfully");
					this.refreshLoginState(null);
				}
			}
		);
	}
}
