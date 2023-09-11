import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UserService } from './user.service';

import { LoginComponent } from './login.component';

import { UniqueUsernameValidator } from './unique-username.directive';
import { MatchFieldValidator } from './match-field.directive';

@NgModule({
	declarations: [
		LoginComponent,
		UniqueUsernameValidator,
		MatchFieldValidator
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild([
			{path: 'login', component: LoginComponent},
			{path: 'signup', component: LoginComponent},
		]),
		FormsModule
	],
	exports: [

	],
	providers: [
		UserService
	]
})
export class UserModule {

}
