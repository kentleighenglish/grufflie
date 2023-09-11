import { IMetadata } from './metadata';
import { ITag } from './tag';
import { IRelation } from './relation';

/*
 * Item Object
 */

export interface IItem {
	id: number;
	name: string;
	type: string;
	parent: number;
	metadata: IMetadata;
	tags: ITag[];
	relations: IRelation[];
}

export class Item implements IItem {

	constructor(public id: number,
				public name: string,
				public type: string,
				public parent: number,
				public metadata: IMetadata,
				public tags: ITag[],
				public relations: IRelation[]) {

	}

}
