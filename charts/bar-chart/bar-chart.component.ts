import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {d} from '@angular/core/src/render3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, AfterViewInit {

  @Input() readData: [{color: string, value: number, label: string}];
  // customisation props
  @Input() width: number;
  @Input() backgroundColor: string;
  @Input() textColor: string;
  @Input() border: string;
  @Input() fontFamily: string;

  @ViewChild('pieChartCanvas') canvasRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;

  // span's props
  spanState = {x: 0, y: 0, value: 0, percent: 0, label: ''};
  showSpan = false;

  data = [];

  canvasWidth: number;
  fullSize: number;
  labelWidth: number;
  maxY: number;
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx = null;


  constructor() {

  }

  ngOnInit() {
    this.canvasWidth = this.width || 300 ;
    this.fullSize = 0;
    let maxValue = 0;
    for ( const d of this.readData) {
      const obj = {color: d.color, value: d.value, label: d.label, percent: 0, begin_angle: 0, enf_angle: 0};
      this.data.push(obj);
    }
    for ( const d of this.data ) {
      this.fullSize += d.value;
      if (d.value > maxValue) { maxValue = d.value; }
    }
    for ( const d of this.data ) { d.percent = Math.floor(d.value / this.fullSize * 10000 ) / 100; }
    this.labelWidth = this.canvasWidth / this.data.length * 4 / 5;
    this.maxY = Math.floor(maxValue * 10 / 9);

  }
  ngAfterViewInit(): void {
    this.container = <HTMLDivElement>this.containerRef.nativeElement;
    this.canvas = <HTMLCanvasElement>this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.ctx.textAlign = 'center';
    this.ctx.textStyle = '19px Aharoni';

    this.writeCanvas();
  }

  writeCanvas() {

    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for ( const data of this.data) {

      // draw the bar chart
      this.ctx.beginPath();
      this.ctx.fillStyle = data.color;
      const labelPercentFromMaxY = data.value / this.maxY * 100;
      const labelHeight = this.canvasWidth / 100 * labelPercentFromMaxY;
      let offsetX = (this.canvasWidth / this.data.length) * this.data.indexOf(data);
      offsetX += (this.canvasWidth / this.data.length - this.labelWidth) / 2;
      const offsetY = this.canvasWidth - labelHeight;
      this.ctx.rect(offsetX, offsetY, this.labelWidth, labelHeight );
      console.log(offsetX, offsetY, this.labelWidth, labelHeight );
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();

      // add the value above the rect
      this.ctx.beginPath();
      this.ctx.fillText(data.value, offsetX + (this.labelWidth / 2), offsetY - 15);
      this.ctx.closePath();

      // set label x and y for find on mouse hover
      data.x = offsetX;
      data.y = offsetY;
      data.height = labelHeight;
    }

  }

  isInRect(x1, x2, y1, y2, w, h) {

    return x1 >= x2 && x1 <= x2 + w && y1 >= y2 && y1 <= y2 + h;
  }

  removeInfoSpan() {
    this.showSpan = false;
  }

  reactOnHover(e) {

    // get the correct mouse position:
    const rect = this.canvas.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    // find the data area who exist in the mouse position
    let index = -1;
    for (const data of this.data) {

      if (this.isInRect(x, data.x, y, data.y, this.labelWidth, data.height)) {
        index = this.data.indexOf(data);
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
