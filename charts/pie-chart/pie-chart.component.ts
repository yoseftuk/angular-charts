import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, AfterViewInit {

  @Input() readData: [{color: string, value: number, label: string}];

  @ViewChild('pieChartCanvas') canvasRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;

  // span's props
  spanState = {x: 0, y: 0, value: 0, percent: 0, label: ''};
  showSpan = false;

  data = [];

  canvasWidth: number;
  fullSize: number;
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx = null;


  constructor() {

  }

  ngOnInit() {
    this.canvasWidth = 300;
    this.fullSize = 0;
    for ( const d of this.readData) {
      const obj = {color: d.color, value: d.value, label: d.label, percent: 0, begin_angle: 0, enf_angle: 0};
      this.data.push(obj);
    }
    for ( const d of this.data ) { this.fullSize += d.value; }
    for ( const d of this.data ) { d.percent = Math.floor(d.value / this.fullSize * 10000 ) / 100; }
  }
  ngAfterViewInit(): void {
    this.container = <HTMLDivElement>this.containerRef.nativeElement;
    this.canvas = <HTMLCanvasElement>this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = this.canvasWidth / 20 * 9;

    this.writeCanvas();
  }

  writeCanvas() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let begin_angel = -0.5;
    let size = 0;
    for (const i of this.data ) {

      size = begin_angel + (i.value / this.fullSize * 2);
      i.begin_angle = (begin_angel / 2 * 360 ) + 90;
      i.end_angle = (size / 2 * 360 ) + 90;

      this.ctx.beginPath();
      this.ctx.arc(this.canvasWidth / 2 , this.canvasWidth / 2, this.canvasWidth / 40 * 9, begin_angel * Math.PI, size * Math.PI, false);
      this.ctx.strokeStyle = i.color;
      this.ctx.stroke();
      this.ctx.closePath();

      begin_angel = size;
    }
    this.ctx.beginPath();
    this.ctx.arc(this.canvasWidth / 2, this.canvasWidth / 2, this.canvasWidth / 20 * 9 , 0, 2 * Math.PI, false);
    this.ctx.strokeStyle = '#222222';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();

  }

  toDegrees (angle) {
    return angle * (180 / Math.PI);
  }

  getLineWidth(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2 , 2 ) + Math.pow(y1 - y2 , 2 ));
  }

  removeInfoSpan() {
    this.showSpan = false;
  }

  reactOnHover(e) {

    // get the correct mouse position:
    const rect = this.canvas.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    // get the angle of the mouse from the center of the canvas
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.width / 2;
    const opp = x - centerX;
    const hyp = this.getLineWidth(centerX, x, centerY, y);
    if (hyp > this.canvasWidth / 20 * 9) {
      return this.removeInfoSpan();
    }
    let angle = this.toDegrees(Math.asin(opp / hyp));
    angle = y > centerY ? 180 - angle : x < centerX ? 360 + angle : angle;

    // find the data area who exist in the mouse position
    let index = -1;
    for (const i of this.data) {

      if ( i.begin_angle <= angle && i.end_angle > angle) {
        index = this.data.indexOf(i);
        break;
      }
    }

    // set span state with a current info to display on the info span
    if (index !== -1) {

      this.spanState = {
        x: this.canvas.width - x - this.canvasWidth / 20,
        y: this.container.offsetHeight - y - this.canvasWidth / 20 + 6,
        label: this.data[index].label,
        percent: this.data[index].percent,
        value: this.data[index].value,
      };

      this.showSpan = true;

    } else { this.removeInfoSpan(); }

  }

}
