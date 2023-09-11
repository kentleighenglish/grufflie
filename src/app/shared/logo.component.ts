import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'logo',
  templateUrl: 'logo.component.html'
})
export class LogoComponent {
	@Input() large: boolean = false;
}