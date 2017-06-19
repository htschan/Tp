/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PunchdayComponent } from './punchday.component';

describe('PunchdayComponent', () => {
  let component: PunchdayComponent;
  let fixture: ComponentFixture<PunchdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PunchdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
