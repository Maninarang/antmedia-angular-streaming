import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostMeetingRoutingModule } from './host-meeting-routing.module';
import { HostMeetingComponent } from './host-meeting.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MeetingHeaderModule } from './../components/meeting-header/meeting-header.module';
import { MeetingSidebarModule } from './../components/meeting-sidebar/meeting-sidebar.module';
import { MeetingFooterModule } from './../components/meeting-footer/meeting-footer.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [HostMeetingComponent],
  imports: [
    CommonModule,
    HostMeetingRoutingModule,
    NgMultiSelectDropDownModule,
    MeetingHeaderModule,
    MeetingSidebarModule,
    MeetingFooterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HostMeetingModule { }
