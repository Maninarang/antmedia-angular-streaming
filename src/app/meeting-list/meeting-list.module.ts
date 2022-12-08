import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingListRoutingModule } from './meeting-list-routing.module';
import { MeetingListComponent } from './meeting-list.component';

import { MeetingHeaderModule } from './../components/meeting-header/meeting-header.module';
import { MeetingSidebarModule } from './../components/meeting-sidebar/meeting-sidebar.module';
import { MeetingFooterModule } from './../components/meeting-footer/meeting-footer.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [MeetingListComponent],
  imports: [
    CommonModule,
    MeetingListRoutingModule,
    MeetingHeaderModule,
    MeetingSidebarModule,
    MeetingFooterModule,
    NgbModule
  ]
})
export class MeetingListModule { }
