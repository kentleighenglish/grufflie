import { Component, OnInit, ElementRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { IItem } from '../items/item';
import { ItemService } from '../items/item.service';

import { GlobalService } from '../global.service';

@Component({
	moduleId: module.id,
	selector: 'search',
	templateUrl: 'search.component.html'
})
export class SearchComponent {
	public filter: any = {
		'limit': 5
	};
	public filterStatus: string = 'empty';
	public results: IItem[] = [];
	public hideSuggestions: boolean = true;
	private focusedEl: number = 0;

	constructor(
		private _itemService: ItemService,
		private _router: Router,
		private globals: GlobalService,
		private _elRef: ElementRef
	) {}

	onQueryChange(): void {
		this.hideSuggestions = false;
		if(this.filter.query == "") {
			delete this.filter.query;
		}
		this.updateResults();
	}

	onFormSubmit(): void {
		this.hideSuggestions = true;
		let passParams = {
			'query': this.filter.query
		}
		this._router.navigate(['search', passParams]);
	}

	onItemClick(id: number): void {
		if(id != undefined){
			this._router.navigate(['/view', id]);
		}
		this.hideSuggestions = true;
		this.results = [];
		this.filterStatus = 'empty';
		delete this.filter.query;
	}

	private checkFilterStatus(param:string = null) {
		var empty = true;
		for(let f in this.filter){
			f = this.filter[f];
			if(f.length){
				empty = false;;
			}
		}
		if(empty) {
			this.filterStatus = 'empty';
		} else if(param) {
			this.filterStatus = param;
		}
	}

	private updateResults() {
		if(this.results.length == 0){
			this.checkFilterStatus('pending');
		}

		if(this.filter.query != undefined){
			this._itemService.fetchItems(this.filter).subscribe(
				results => { if(results != null){ this.results = results } else { this.results = [] }; this.checkFilterStatus('done'); },
				error => this.globals.error = <any>error
			);
		} else {
			this.results = [];
			this.checkFilterStatus('done');
		}
	}

	public scrollSelection(e: any, gotoEl: number = this.focusedEl) {
		let elements = this._elRef.nativeElement.querySelectorAll('input[name="filterQuery"], li.item>a');

		if(e.key != 'ArrowUp' && e.key != 'ArrowDown'){
			gotoEl = 0;
		} else if(gotoEl == 0 && e.key == 'ArrowUp') {
			gotoEl = (elements.length-1);
		} else if(gotoEl == (elements.length - 1) && e.key == 'ArrowDown') {
			gotoEl = 0;
		} else if(e.key == 'ArrowUp') {
			gotoEl--;
		} else if(e.key == 'ArrowDown') {
			gotoEl++;
		}
		this.focusedEl = gotoEl;
		let focusedElement = elements[gotoEl];
		focusedElement.focus();
	}
}
