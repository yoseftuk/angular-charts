import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-multiple-line-chart',
  templateUrl: './multiple-line-chart.component.html',
  styleUrls: ['./multiple-line-chart.component.css']
})
export class MultipleLineChartComponent implements OnInit, AfterViewInit {

  @Input() readData: [{ x: number, y: [number] }];
  @Input() colors: [string];
  @Input() labelX: string;
  @Input() labelsY: [string];
  // customisation props
  @Input() backgroundColor: string;
  @Input() border: string;
  @Input() height: number;
  @Input() areaOpacity: number;

  @ViewChild('lineChartCanvas') canvasRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;

  // span's props
  spanState = {x: 0, y: 0, valueX: 0, valuesY: [0], labelX: '', labelsY: ['']};
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
    this.data = this.readData;
    this.startX = this.data[0].x;
    this.maxValueY = 0;
    this.maxValueX = 0;
    this.startY = this.data[0].y[0];
    for (const data of this.data) {
      data.x -= this.startX;
      if (data.x > this.maxValueX) {
        this.maxValueX = data.x;
      }

      for (const j of data.y) {
        if (j > this.maxValueY) {
          this.maxValueY = j;
        }
        if (j < this.startY) {
          this.startY = j;
        }
      }
    }
    console.log(this.maxValueY, this.startY);
    for (const i of this.data) {
      i.percent = Math.floor(i.x / this.maxValueX * 10000) / 100;
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

    this.ctx.textAlign = 'center';
    this.ctx.strokeWidth = 4;

    for (let j = 0; j < this.labelsY.length; j++) {
      this.ctx.strokeStyle = this.colors[j];
      this.ctx.fillStyle = this.colors[j];
      this.ctx.beginPath();

      for (const data of this.data) {


        // get the values
        const pointHeight = (data.y[j] - this.startY) / this.maxY;
        const offsetX = ((this.canvas.width / 100) * data.percent);
        const offsetY = this.canvasHeight - (this.canvasHeight * pointHeight);

        // initialize the cursor position
        if (this.data.indexOf(data) === 0) {
          this.ctx.moveTo(offsetX, offsetY);
        }

        // draw the line
        this.ctx.lineTo(offsetX, offsetY);
        this.ctx.stroke();

        // set label x and y for find on mouse hover
        data.offsetX = offsetX;
        data.offsetY = offsetY;
      }
      this.ctx.closePath();

      // draw the circle
      for (let i = 0; i < this.data.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.data[i].offsetX, this.data[i].offsetY, 4, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }

    // draw the labels
    const xInterval = this.maxValueX / 10;
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
        labelsY: this.labelsY,
        valueX: this.data[index].x + this.startX,
        valuesY: this.data[index].y
      };

      this.showSpan = true;
    }
  }

}
