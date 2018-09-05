import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, OnChanges} from '@angular/core';

@Component({
  selector: 'app-info-span-double',
  templateUrl: './info-span-double.component.html',
  styleUrls: ['./info-span-double.component.css']
})
export class InfoSpanDoubleComponent implements OnInit, AfterViewInit, OnChanges {

  @Input('isShown') isShown: boolean;
  @Input('props') props: {x: number, y: number, labelX: string, labelY: string, valueX: number, valueY: number };

  @ViewChild('infoSpan') infoSpan: ElementRef;
  spanWidth = 0;
  spanHeight = 0;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  ngOnChanges() {
    const span = this.infoSpan;
    this.spanWidth = span ? span.nativeElement.offsetWidth : 0;
    this.spanHeight = span ? span.nativeElement.offsetHeight : 0;
  }

}
