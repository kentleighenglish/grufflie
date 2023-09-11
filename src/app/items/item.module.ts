import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ItemService } from './item.service';

import { ItemGridComponent } from './item-grid.component';
import { ItemGridElementComponent } from './item-grid-element.component';

import { MetadataFieldComponent } from './metadata-field.component';

@NgModule({
	declarations: [
		ItemGridComponent,
		ItemGridElementComponent,
		MetadataFieldComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule
	],
	exports: [
		ItemGridComponent,
		MetadataFieldComponent
	],
	providers: [
		ItemService
	]
})
export class ItemModule {

}
