/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PunchComponent } from './punch.component';

describe('PunchComponent', () => {
  let component: PunchComponent;
  let fixture: ComponentFixture<PunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
