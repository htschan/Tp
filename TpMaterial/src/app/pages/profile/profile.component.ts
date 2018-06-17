import { Component, OnInit, VERSION, Inject } from '@angular/core';
import { BUILD_INFO } from '../../services/puncher/punch.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;
  version: string;
  buildInfo: string;

  constructor(@Inject(BUILD_INFO) buildInfo: string) {
    this.version = VERSION.full;
    this.buildInfo = buildInfo;
  }

  ngOnInit() {
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;

}
