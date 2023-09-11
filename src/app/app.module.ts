//Modules
import { NgModule } from '@angular/core';
import { Title, BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from './shared/shared.module';
import { ItemModule } from './items/item.module';
import { UserModule } from './users/user.module';
//Components
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing.component';
import { ResultsComponent } from './pages/results.component';
import { ViewComponent } from './pages/view.component';

import { GlobalService } from './global.service';
import { ApiService } from './shared/api.service';

@NgModule({
	declarations: [
		AppComponent,
		LandingComponent,
		ResultsComponent,
		ViewComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		SharedModule,
		ItemModule,
		UserModule,
		CommonModule,
		RouterModule.forRoot([
			{path: 'view/:id', component: ViewComponent},
			{path: 'search', component: ResultsComponent},
			{path: '', component: LandingComponent },
			{path: '**', redirectTo: '', pathMatch: 'full' }
		])
	],
	providers: [
		Title,
		[GlobalService]
	],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor() {
	}
}
