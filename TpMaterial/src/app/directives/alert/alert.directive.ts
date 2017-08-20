import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  moduleId: module.id,
  selector: 'alert',
  template: `
  <div *ngIf="message" [ngClass]="{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }">{{message.text}}</div>    
  `
})
export class AlertDirective {
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => { this.message = message; });
  }
}

