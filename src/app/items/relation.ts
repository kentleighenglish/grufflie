import { IItem } from './item';

/*
 * Relation
 */

export interface IRelation {
	relationId: number;
	relationCount: number;
	relationScore: number;
	item: IItem[];
}

export class Relation implements IRelation {

	constructor(public relationId: number,
				public relationCount: number,
				public relationScore: number,
				public item: IItem[]) {

	}

}