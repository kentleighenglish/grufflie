/*
 * Tag
 */

export interface ITag {
	name: string;
}

export class Tag implements ITag {

	constructor(public name: string,
				) {

	}

}