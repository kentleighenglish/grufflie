import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';


@Directive({
	selector: '[matchField][ngModel],[matchField][formControl],[matchField][formControlName]',
	providers: [
  		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => MatchFieldValidator),
			multi: true
		}
	]
})
export class MatchFieldValidator implements Validator  {

	constructor(
		@Attribute('matchField') public matchField: string,
		@Attribute('reverse') public reverse: string
	) {
	}

	private get isReverse() {
		if (!this.reverse) return false;
		return this.reverse === 'true' ? true: false;
	}

	validate(c: AbstractControl): any {
		// self value
		let v = c.value;

		// control vlaue
		let e = c.root.get(this.matchField);

		// value not equal
		if (e && v !== e.value && !this.isReverse) {
			return {
				matchField: true
			}
		}

		// value equal and reverse
		if (e && v === e.value && this.isReverse) {
			delete e.errors['matchField'];
			if (!Object.keys(e.errors).length) e.setErrors(null);
		}

		// value not equal and reverse
		if (e && v !== e.value && this.isReverse) {
			e.setErrors({ matchField: true });
		}

		return null;
	}
}
