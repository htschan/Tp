/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimepuncherComponent } from './timepuncher.component';

describe('TimepuncherComponent', () => {
  let component: TimepuncherComponent;
  let fixture: ComponentFixture<TimepuncherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepuncherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepuncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
