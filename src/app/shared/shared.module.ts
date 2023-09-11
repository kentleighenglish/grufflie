import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//components
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { LogoComponent } from './logo.component';
import { SearchComponent } from './search.component';
import { FlashComponent } from './flash.component';

import { ApiService } from './api.service';
import { UppercaseFirstPipe } from './ucfirst.pipe';

@NgModule({
	declarations: [
		HeaderComponent,
		FooterComponent,
		LogoComponent,
		SearchComponent,
		FlashComponent,
		UppercaseFirstPipe
	],
	imports: [
		FormsModule,
		CommonModule,
		RouterModule
	],
	exports: [
		HeaderComponent,
		FooterComponent,
		LogoComponent,
		SearchComponent,
		FlashComponent,
		UppercaseFirstPipe
	],
	providers: [
		ApiService
	]
})
export class SharedModule { }
