import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { env } from 'process';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.scss']
})
export class RecordingsComponent implements OnInit {
  recordings: Array<object>;
  mediaBaseUrl: string;
  constructor(
    private http: HttpClient,
  ) { 
    this.mediaBaseUrl = environment.mediaUrl;
    this.http.get(`${environment.apiUrl}recordings`).subscribe(
      (response: any) => {
        this.recordings = response.data;
          }
    )
  }

  ngOnInit() {
  }

}
