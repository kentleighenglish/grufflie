import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { IItem } from '../items/item';
import { IRelation } from '../items/relation';
import { Router } from '@angular/router';
@Component({
	moduleId: module.id,
	selector: 'item-grid-element',
	templateUrl: 'item-grid-element.component.html'
})
export class ItemGridElementComponent {
	@Input() item: IItem;
	@Input() relation: IRelation;
	public id: number;

	constructor(
		private _router: Router
	) {}

	ngOnInit(): void {
		if(this.item) {
			this.id = this.item.id;
		}else if(this.relation) {
			this.id = this.relation.relationId;
		}
	}
}
