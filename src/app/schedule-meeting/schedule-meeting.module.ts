import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleMeetingRoutingModule } from './schedule-meeting-routing.module';
import { ScheduleMeetingComponent } from './schedule-meeting.component';
import { MeetingHeaderModule } from './../components/meeting-header/meeting-header.module';
import { MeetingSidebarModule } from './../components/meeting-sidebar/meeting-sidebar.module';
import { MeetingFooterModule } from './../components/meeting-footer/meeting-footer.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ScheduleMeetingComponent],
  imports: [
    CommonModule,
    MeetingHeaderModule,
    MeetingSidebarModule,
    MeetingFooterModule,
    ScheduleMeetingRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ]
})
export class ScheduleMeetingModule { }
