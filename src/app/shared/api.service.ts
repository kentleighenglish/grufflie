import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
	private _ApiUrl: string = 'api';

	constructor(private _http: Http) {

	}

	public get(url: string): Observable<any> {
		return this._http.get(this._ApiUrl+'/'+url)
		.map((response: Response) => <Object>response.json().success)
		.catch((this.handleError));
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server Error');
	}
}
