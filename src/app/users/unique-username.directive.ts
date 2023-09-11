import { Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from "rxjs";

import { ApiService } from '../shared/api.service';


@Directive({
	selector: '[validateUniqueUsername][ngModel],[validateUniqueUsername][formControl],[validateUniqueUsername][formControlName]',
	providers: [
  		{
			provide: NG_ASYNC_VALIDATORS,
			useExisting: forwardRef(() => UniqueUsernameValidator),
			multi: true
		}
	]
})
export class UniqueUsernameValidator implements Validator  {

	constructor(
		private _apiService: ApiService
	){
	}

	validate(c: AbstractControl): Promise<any>|Observable<any> {
		return new Promise(resolve => {
			let value = c.value;
			if(value) {
				this._apiService.get('checkUsername/value:'+value).subscribe(
					result => {
						if(result != null) {
							let valid = typeof(result) == 'string' && result == 'true' ? true : false;
							if(valid){
								resolve(null);
							} else {
								resolve({ validUniqueUsername: true })
							}
						}else {
							resolve(null);
						}
					},
					error => { return { unknownError: true } }
				);
			} else {
				resolve(null);
			}
		})
	}
}
