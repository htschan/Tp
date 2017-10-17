import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeadminComponent } from './timeadmin.component';

describe('TimeadminComponent', () => {
  let component: TimeadminComponent;
  let fixture: ComponentFixture<TimeadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
