import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSidebarComponent } from './meeting-sidebar.component';

describe('MeetingSidebarComponent', () => {
  let component: MeetingSidebarComponent;
  let fixture: ComponentFixture<MeetingSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
