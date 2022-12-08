import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingFooterComponent } from './meeting-footer.component';

describe('MeetingFooterComponent', () => {
  let component: MeetingFooterComponent;
  let fixture: ComponentFixture<MeetingFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
