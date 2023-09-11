import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../shared/api.service';
import { UserService } from './user.service';
import { GlobalService } from '../global.service';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})
export class LoginComponent  {
	public user: any = {};
	public signUp: boolean = false;
	private passwordScore: number;
	private passwordCrackTime: string;
	public fieldError: any;

	constructor(private _route: ActivatedRoute, private globals: GlobalService, private _router: Router, private _apiService: ApiService, private _userService: UserService) {

	}

	ngOnInit(): void {
		let url = this._route.snapshot.url[0].path;
		if(url == 'login'){
			this.signUp = false;
		} else {
			this.signUp = true;
		}
	}

	onFormSubmit(): void {
		if(this.signUp){
			if(
				this.user.username != undefined &&
				this.user.email != undefined &&
				this.user.emailConfirm != undefined &&
				this.user.password != undefined &&
				this.user.passwordConfirm != undefined
			) {
				this._userService.createUser(this.user).subscribe(
					response => { if(response == true) { this.globals.flash('New account created'); this._router.navigate(['/login']); }},
					error => this.fieldError = error
				);
			}
		} else {
			if(
				this.user.username != undefined &&
				this.user.password != undefined
			) {
				this._userService.login(this.user).subscribe(
					response => {
						if(!response.formData) {
							this.fieldError = 'Please fill in both fields';
						} else if(!response.username || !response.password) {
							this.fieldError = 'Incorrect username or password.';
						}

						if(response.formData && response.username && response.password) {
							this.globals.refreshLoginState(response.userData);
							this._router.navigate(['/']);
							this.globals.flash("Logged In Successfully");
						}
					},
					error => this.globals.error = error
				);
			}
		}
	}

	testPasswordStrength(): void {
		let url = 'passwordStrength/';
		let i = 0;
		for(let field in this.user){
			let value = this.user[field];
			if(value != "") {
				url += field+":"+encodeURIComponent(value);
				if( (i+1) != Object.keys(this.user).length){
					url += ",";
				}
			}
			i++;
		}
		let pw = this.user.password;
		if(pw != undefined && pw != "") {
			this._apiService.get(url).subscribe(
				response => { this.passwordScore = Number(response.score); this.passwordCrackTime = response.crack_time_string },
			);
		}
	}
}
