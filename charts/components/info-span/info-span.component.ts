import {Component, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-span',
  templateUrl: './info-span.component.html',
  styleUrls: ['./info-span.component.css']
})
export class InfoSpanComponent implements OnInit {

  @Input('isShown') isShown: boolean;
  @Input('props') props: {x: number, y: number, label: string, percent: number, value: number };

  constructor() { }

  ngOnInit() {
  }

}
