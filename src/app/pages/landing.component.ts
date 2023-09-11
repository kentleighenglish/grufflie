import { Component, Inject, OpaqueToken, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { GlobalService } from '../global.service';

@Component({
	moduleId: module.id,
	templateUrl: 'landing.component.html'
})
export class LandingComponent {
	public user: any;

	constructor(
		private titleService: Title,
		private globals: GlobalService
	) {
	}

	ngOnInit(): void {
		this.titleService.setTitle(this.globals.name);
	}
}
