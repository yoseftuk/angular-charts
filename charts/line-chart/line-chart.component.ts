import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, AfterViewInit {

  @Input() readData: [{ x: number, y: number }];
  @Input() color: string;
  @Input() labelX: string;
  @Input() labelY: string;
  // customisation props
  @Input() backgroundColor: string;
  @Input() border: string;
  @Input() height: number;

  @ViewChild('lineChartCanvas') canvasRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;

  // span's props
  spanState = {x: 0, y: 0, valueX: 0, valueY: 0, labelX: '', labelY: ''};
  showSpan = false;

  // helpers values
  data = [];

  startX: number;
  startY: number;
  maxValueX: number;
  maxValueY: number;
  maxY: number;

  canvasHeight: number;
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx = null;


  constructor() {

  }

  ngOnInit(): void {

    // initialize the helper values
    this.canvasHeight = this.height || 300;
    this.startX = this.readData[0].x;
    this.maxValueY = 0;
    this.maxValueX = 0;
    this.startY = this.readData[0].y;
    this.data = this.readData;

    for (const i of this.data) {

      if (i.y > this.maxValueY) {
        this.maxValueY = i.y;
      }
      if (i.y < this.startY) {
        this.startY = i.y;
      }
      if (i.x > this.maxValueX) {
        this.maxValueX = i.x;
      }
      if (i.x < this.startX) {
        this.startX = i.x;
      }
    }
    for (const i of this.data) {
      i.x -= this.startX;
      i.percent = Math.floor(i.x / (this.maxValueX - this.startX) * 10000) / 100;
      console.log(i.x, this.maxValueX, i.percent);
    }

    this.maxY = (this.maxValueY - this.startY) * 10 / 9;
  }

  ngAfterViewInit(): void {
    this.container = <HTMLDivElement>this.containerRef.nativeElement;
    this.canvas = <HTMLCanvasElement>this.canvasRef.nativeElement;

    // init the canvas
    this.canvas.width = this.container.offsetWidth - 24;
    this.canvas.height = this.canvasHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.textStyle = '20px Ahroni';

    this.writeCanvas();
    window.addEventListener('resize', () => {
      this.canvas.width = this.container.offsetWidth - 24;
      this.writeCanvas();
    });

  }

  writeCanvas() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color || '#4eb934';
    this.ctx.fillStyle = this.color || '#3f962a';
    this.ctx.textAlign = 'center';
    this.ctx.strokeWidth = 4;

    for (const data of this.data) {

      // get the values
      const pointHeight = (data.y - this.startY) / this.maxY;
      const offsetX = ((this.canvas.width / 100) * data.percent);
      const offsetY = this.canvasHeight - (this.canvasHeight * pointHeight);

      // draw the line
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();

      // set label x and y for find on mouse hover
      data.offsetX = offsetX;
      data.offsetY = offsetY;
    }
    this.ctx.closePath();


    // draw the circle
    for (const data of this.data) {
      this.ctx.beginPath();
      this.ctx.arc(data.offsetX, data.offsetY, 4, 0, 2 * Math.PI, false);
      this.ctx.fill();
      this.ctx.closePath();
    }

    // draw the labels

    const xInterval = (this.maxValueX - this.startX) / 10;
    const yInterval = (this.maxValueY - this.startY) / 9;
    const startXLabel = this.data[0].x;
    this.ctx.strokeStyle = 'gray';
    this.ctx.fillStyle = 'gray';
    this.ctx.strokeWidth = 2;
    this.ctx.beginPath();

    for (let i = 1; i < 10; i++) {
      const x = this.canvas.width / 10 * i;
      this.ctx.moveTo(x, this.canvasHeight);
      this.ctx.lineTo(x, this.canvasHeight - 6);
      this.ctx.stroke();

      this.ctx.fillText('' + (Math.floor((xInterval * i + startXLabel + this.startX) * 100) / 100), x, this.canvasHeight - 8);
    }

    this.ctx.closePath();
    this.ctx.beginPath();

    this.ctx.textAlign = 'left';
    for (let i = 1; i < 10; i++) {
      const y = this.canvas.height / 10 * (10 - i);
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(6, y);
      this.ctx.stroke();

      this.ctx.fillText('' + (Math.floor((this.startY + yInterval * i) * 100) / 100), 9, y);
    }

    this.ctx.closePath();
  }

  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  getLineWidth(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  removeInfoSpan() {
    this.showSpan = false;
  }

  reactOnHover(e) {

    // get the correct mouse position:

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // find the data area who exist in the mouse position
    let index = -1;
    for (let i = 0; i < this.data.length; i++) {

      if (x > this.data[i].offsetX - 15 && x < this.data[i].offsetX + 15 + 8) {
        index = i;
        break;
      }
    }

    // set state with a current info to display on the info span
    if (index !== -1) {

      this.spanState = {
        x: this.data[index].offsetX,
        y: this.data[index].offsetY,
        labelX: this.labelX,
        labelY: this.labelY,
        valueX: this.data[index].x + this.startX,
        valueY: this.data[index].y
      };

      this.showSpan = true;
    }
  }

}
