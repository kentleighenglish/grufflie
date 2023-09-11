import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { GlobalService } from '../global.service';

@Component({
  moduleId: module.id,
  selector: 'app-flash',
  templateUrl: 'flash.component.html'
})
export class FlashComponent {
	private notifications: any[];

	constructor(
		private globals: GlobalService
	) {
		this.globals.notifications.subscribe(
		notifications => {
			this.notifications = notifications
		});
	}
}
