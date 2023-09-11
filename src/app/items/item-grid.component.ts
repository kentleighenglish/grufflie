import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { IItem } from '../items/item';
import { IRelation } from '../items/relation';

@Component({
	moduleId: module.id,
	selector: 'item-grid',
	templateUrl: 'item-grid.component.html'
})
export class ItemGridComponent {
	@Input() items: IItem[];
	@Input() relations: IRelation[];
	@Input() maxCols: number;
}