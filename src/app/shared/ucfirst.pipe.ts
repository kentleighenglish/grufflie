import { Pipe, PipeTransform } from '@angular/core';
/*
* Uppercase transform the first letter in given string.
* Usage:
*   value | ucfirst
* Example:
*   {{ angular |  ucfirst}}
*   formats to: Angular
*/
@Pipe({name: 'ucfirst'})
export class UppercaseFirstPipe implements PipeTransform {
	transform(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}