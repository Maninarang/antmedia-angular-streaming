import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetNewComponent } from './meet-new.component';

describe('MeetNewComponent', () => {
  let component: MeetNewComponent;
  let fixture: ComponentFixture<MeetNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
