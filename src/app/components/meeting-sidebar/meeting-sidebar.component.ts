import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'meeting-sidebar',
  templateUrl: './meeting-sidebar.component.html',
  styleUrls: ['./meeting-sidebar.component.scss']
})
export class MeetingSidebarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }


  logout() {
    localStorage.clear();
    this.router.navigate(['/']);

  }

  comingSoon() {
    alert('Coming Soon!!!!')
  }

}
