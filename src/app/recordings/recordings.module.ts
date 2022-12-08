import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordingsRoutingModule } from './recordings-routing.module';
import { RecordingsComponent } from './recordings.component';
import { MeetingHeaderModule } from './../components/meeting-header/meeting-header.module';
import { MeetingSidebarModule } from './../components/meeting-sidebar/meeting-sidebar.module';
import { MeetingFooterModule } from './../components/meeting-footer/meeting-footer.module';

@NgModule({
  declarations: [RecordingsComponent],
  imports: [
    CommonModule,
    RecordingsRoutingModule,
    MeetingHeaderModule,
    MeetingSidebarModule,
    MeetingFooterModule,
  ]
})
export class RecordingsModule { }
