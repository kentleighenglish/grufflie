import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IItem } from './item';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class ItemService {
	private _ApiUrl: string = 'api';
	private pass: boolean = false;

	constructor(private _http: Http) {

	}

	private generateUrl(params: any) {
		var url = this._ApiUrl+'/';
		if(typeof(params.query) != undefined || typeof(params.type) != undefined) {
			url += 'filter/';

			var i = 0;
			for(var key in params) {
				var param = params[key];

				if((key == "query" || key == "tag" || key == "type") && param){
					this.pass = true;
				}
				if(typeof param == 'string') {
					var parsedParam: string = param.replace(/\s/g, '+');
					url+= key+':'+parsedParam;
				} else {
					url+= key+':'+param;
				}


				i++;
				if(i != Object.keys(params).length) {
					url+= ',';
				}
			}
			url += '/';
		}else if(typeof(params.id) != undefined) {

		}

		return url;
	}

	public fetchItems(filter: any): Observable<IItem[]> {
		let url = this.generateUrl(filter);

		if(this.pass){
			this.pass = false;
			return this._http.get(url)
			.map((response: Response) => <IItem[]>response.json().success)
			.catch((this.handleError));
		} else {
			this.pass = false;
			return Observable.of();
		}
	}

	public fetchItem(id: number): Observable<IItem> {
			let url = this._ApiUrl+'/items/'+id;
			return this._http.get(url)
			.map((response: Response) => <IItem[]>response.json().success)
			.catch((this.handleError));
	}

	public createMetadata(id: number, metadata: any, type: string): Observable<boolean> {
		let url = this._ApiUrl+'/items/'+id+'/metadata';
		let data = {
			'metadata': metadata,
			'itemType': type
		};
		return this._http.post(url, data)
		.map((response: Response) => <boolean>response.json().success)
		.catch((this.handleError));
	}

	public saveMetadata(id: number, metadata: any, type: string): Observable<boolean> {
		let url = this._ApiUrl+'/items/'+id+'/metadata';
		let data = {
			'metadata': metadata,
			'itemType': type
		};
		return this._http.put(url, data)
		.map((response: Response) => <boolean>response.json().success)
		.catch((this.handleError));
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.statusText || 'Server Error');
	}
}
