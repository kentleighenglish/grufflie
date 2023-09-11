import { Component, OnInit, Inject, OpaqueToken } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

import { IItem } from '../items/item';
import { IMetadataField } from '../items/metadata-field';

import { ItemService } from '../items/item.service';
import { ApiService } from '../shared/api.service';

import { GlobalService } from '../global.service';

@Component({
  moduleId: module.id,
  templateUrl: 'view.component.html'
})
export class ViewComponent {
	public title: string = "Test";
	public item: IItem;
	private metadataFields: IMetadataField[];

	constructor(
		private titleService: Title,
		private globals: GlobalService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _itemService: ItemService,
		private _apiService: ApiService
	) {
		_route.params.subscribe(
			params => { this.updateView(params) }
		);
	}

	updateView(params: any) {
		if(params.id){
			this._itemService.fetchItem(params.id).subscribe(
				item => { if(item != null){ this.item = item; this.updateTitle(); this.updateMetadata(); } else { this.item = null }},
				error => this.globals.error = <any>error
			);
		}
	}

	updateMetadata() {
		this._apiService.get('types/'+this.item.type).subscribe(
			result => { if(result != null) { this.metadataFields = result[this.item.type]['metadata']; }},
			error => this.globals.error = <any>error
		);
	}

	updateTitle(): void {
		this.titleService.setTitle(this.globals.name+' | '+this.item.name);
	}
}
