import { Component, Input, } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { ItemService } from './item.service';

import { IMetadataField } from './metadata-field';

import { GlobalService } from '../global.service';

@Component({
	moduleId: module.id,
	selector: 'metadata-field',
	templateUrl: 'metadata-field.component.html'
})
export class MetadataFieldComponent {
	@Input() metadataField: IMetadataField;
	@Input() metadataValue: any;
	@Input() item: any;
	public editing: boolean = false;
	private error: any;
	private user: any;

	constructor(
		private _itemService: ItemService,
		private globals: GlobalService
	) {
		this.globals.currUser.subscribe(
			user => this.user = user
		)
	}

	public onFormSave(): void {
		let data = {};
		data[this.metadataField.name] = this.metadataValue;

		let dataKeys = Object.keys(data);
		if(typeof this.item.metadata[dataKeys[0]] != 'undefined') {
			this._itemService.saveMetadata(this.item.id, data, this.item.type).subscribe(
				result => this.onFormSaved(result),
				error => this.error = <any>error
			);
		} else {
			this._itemService.createMetadata(this.item.id, data, this.item.type).subscribe(
				result => this.onFormSaved(result),
				error => this.error = <any>error
			);
		}
	}

	private onFormSaved(result): void {
		this.globals.flash('Metadata:'+this.metadataField.name+' saved');
		if(result){
			this.error = null;
		}
		this.editing = false;
	}
}
