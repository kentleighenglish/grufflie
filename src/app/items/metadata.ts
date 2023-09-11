/*
 * Metadata
 */

export interface IMetadata {
	[key: string] : any
}

export class Metadata implements IMetadata {

	constructor(public metadata: any) {
	}

}
