import { Component, Input, OnInit, Inject, OpaqueToken } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

import { GlobalService } from '../global.service';

@Component({
  moduleId: module.id,
  selector: 'app-footer',
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
	@Input() footerLinks: any[];

	constructor(
		private globals: GlobalService,
		private _router: Router
	) {

	}

	ngOnInit(): void {
		let defaultLinks = this.globals.footerLinks;

		if(this.footerLinks != undefined){
			this.footerLinks = defaultLinks.concat(this.footerLinks);
		} else {
			this.footerLinks = defaultLinks;
		}
	}

	call(func): void {
		func.call();
	}
}
