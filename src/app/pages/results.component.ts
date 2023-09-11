import { Component, OnInit, Inject, OpaqueToken } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor } from '@angular/common';

import { IItem } from '../items/item';
import { ItemService } from '../items/item.service';
import { ApiService } from '../shared/api.service';

import { GlobalService } from '../global.service';

@Component({
	moduleId: module.id,
	templateUrl: 'results.component.html'
})
export class ResultsComponent {
	public filter: any = {
		"limit": 12
	};
	public results: IItem[] = [];
	public types: string[] = [];
	public totalReached: boolean = false;

	constructor(
		private titleService: Title,
		private globals: GlobalService,
		private _itemService: ItemService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _apiService: ApiService
	) {
		Object.assign(this.filter, this._route.snapshot.params);
	}

	ngOnInit(): void {
		if(Object.keys(this.filter).length) {
			this.handleFilterUpdate(this.filter);
		}

		this._apiService.get('types').subscribe(
			result => { if(result != null) { this.types = result }},
			error => this.globals.error = <any>error
		);
	}

	onFormSubmit(): void {
		this.handleFilterUpdate(this.filter);
		this._router.navigate(['search', this.filter]);
	}

	handleFilterUpdate(filter): void {
		this.titleService.setTitle(this.globals.name+' | '+this.filter.query);
		if(Object.keys(filter).length > 0){
			this._itemService.fetchItems(filter).subscribe(
				results => {
					if(results != null) {
						this.totalReached = results.length % this.filter.limit != 0 ? true : false;
						this.results = results;
					} else {
						this.totalReached = true;
						this.results = [];
					};
				},
				error => this.globals.error = <any>error
			);
		} else {
			this.totalReached = true;
			this.results = [];
		}
	}

	onLoadMore() {
		let currentCount = this.results.length;
		if(!this.totalReached && currentCount){
			let newFilter = this.filter;
			newFilter.offset = this.results.length;

			let results = this.handleLoadMore(newFilter);
		}
	}

	handleLoadMore(filter): void {
		if(Object.keys(filter).length > 0){
			this._itemService.fetchItems(filter).subscribe(
				results => {
					if(results != null) {
						this.totalReached = results.length % this.filter.limit != 0 ? true : false;
						this.results = this.results.concat(results);
					} else {
						this.totalReached = true;
					};
				},
				error => this.globals.error = <any>error
			);
		} else {
			this.totalReached = true;
		}
	}
}
