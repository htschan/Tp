import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-punch',
  templateUrl: './punch.component.html',
  styleUrls: ['./punch.component.css']
})
export class PunchComponent implements OnInit {

  @Input()
  value: string;
  step: number = 0.1;
  min: number = 0.0;
  max: number = 23.99;
  autocorrect: boolean = true;
  decimals: number = 2;
  format: string = "n2";
  showbuttons: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
