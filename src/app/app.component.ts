import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MagLoop Controller';
  data: any = {};
  position = 1;
  minPosition = 0;
  maxPosition = 0;
  steps = [1, 5 , 10 , 15 , 20 , 50 , 100];
  stepIndex = 0;
  url = 'http://magloop.local/';
  lock = true;
  status = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getActualPosition();
  }

  handleSuccess(data) {
    console.log(data);
    this.status = 'OK';
    this.data = data;
    this.lock = false;
  }

  handleError(err) {
    console.log(err);
    this.status = err.message;
    this.lock = false;
  }

  getActualPosition() {
    this.http.get(this.url)
    .subscribe(
      data => {
        this.position = data['position'];
        this.minPosition = data['minPosition'];
        this.maxPosition = data['maxPosition'];
        this.handleSuccess(data);
      },
      err => {
        this.handleError(err);
      }
    );
  }

  updatePosition(pos) {
    this.lock = true;
    const request = { 'position' : this.position };
    this.http.post(this.url, JSON.stringify(request))
    .subscribe(data => {
      this.position = data['position'];
      this.handleSuccess(data);
    },
    err => {
      this.handleError(err);
    });
  }

  saveFrequency(frequency) {
    this.lock = true;
    const request = { 'position' : this.position, 'frequency' : frequency };
    this.http.post(this.url, JSON.stringify(request))
    .subscribe(data => {
      this.handleSuccess(data);
    },
    err => {
      this.handleError(err);
    });
  }

  getPosition(frequency) {
    this.lock = true;
    const request = { 'frequency' : frequency };
    this.http.post(this.url, JSON.stringify(request))
    .subscribe(data => {
      this.position = data['position'];
      this.handleSuccess(data);
    },
    err => {
      this.handleError(err);
    });
  }

  decreaseStepSize() {
    this.stepIndex = (this.stepIndex > 0 ) ? this.stepIndex - 1 :  0;
  }

  increaseStepSize() {
    this.stepIndex = (this.stepIndex < this.steps.length - 1 ) ? this.stepIndex + 1 :  this.steps.length - 1;
  }

  decreasePosition() {
    let newpos;

    newpos = this.position - this.steps[this.stepIndex];
    this.position = (newpos < this.minPosition ) ? this.minPosition : newpos;
    this.updatePosition(this.position);
  }

  increasePosition() {
    let newpos;

    newpos = this.position + this.steps[this.stepIndex];
    this.position = (newpos < this.maxPosition ) ? newpos :  this.maxPosition;
    this.updatePosition(this.position);
  }

}
