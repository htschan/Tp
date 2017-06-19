/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsermonthComponent } from './usermonth.component';

describe('UsermonthComponent', () => {
  let component: UsermonthComponent;
  let fixture: ComponentFixture<UsermonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
