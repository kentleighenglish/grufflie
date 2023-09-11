/*
 * MetadataFields Object
 */

export interface IMetadataField {
	name: string;
	type: string;
	item_type?: string;
	label?: string;
	empty: boolean;
	attributes?: any[];
}

export class MetadataField implements IMetadataField {

	constructor(public id: number,
				public name: string,
				public type: string,
				public item_type: string,
				public label: string,
				public empty: boolean,
				public attributes: any[]
	) {}

}
