import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IUser } from './user';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class UserService {
	private _ApiUrl: string = 'api';
	private pass: boolean = false;

	constructor(private _http: Http) {

	}

	public fetchUser(id: number): Observable<IUser> {
		let url = this._ApiUrl+'/users/'+id;

		if(this.pass){
			this.pass = false;
			return this._http.get(url)
			.map((response: Response) => <IUser>response.json().success)
			.catch((this.handleError));
		} else {
			this.pass = false;
			return Observable.of();
		}
	}

	public createUser(formData: any): Observable<boolean> {
		let url = this._ApiUrl+'/users';
		if(formData){
			return this._http.post(url, formData)
			.map((response: Response) => <boolean>response.json().success)
			.catch((this.handleError));
		} else {
			return Observable.of();
		}
	}

	public login(formData: any): Observable<any> {
		if(formData.username && formData.password){
			let remember = formData.remember ? ',remember:'+formData.remember : '';
			let url = this._ApiUrl+'/login/username:'+encodeURIComponent(formData.username)+',password:'+encodeURIComponent(formData.password)+remember;
			return this._http.get(url)
			.map((response: Response) => <any>response.json().success)
			.catch((this.handleError));
		} else {
			return Observable.of(false);
		}
	}

	public logout(): Observable<boolean> {
		let url = this._ApiUrl+'/logout';
			return this._http.get(url)
			.map((response: Response) => <boolean>response.json().success)
			.catch((this.handleError));
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.statusText || 'Server Error');
	}
}
