import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, OnChanges} from '@angular/core';

@Component({
  selector: 'app-info-span-multiple',
  templateUrl: './info-span-multiple.component.html',
  styleUrls: ['./info-span-multiple.component.css']
})
export class InfoSpanMultipleComponent implements OnInit, AfterViewInit, OnChanges {

  @Input('isShown') isShown: boolean;
  @Input('props') props: {x: number, y: [number], labelX: string, labelsY: [string], valueX: number, valuesY: [number] };

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
