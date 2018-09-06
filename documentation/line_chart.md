# Line Chart

### Import the component
add to the app.module.ts
```js
import { InfoSpanDoubleComponent } from './way/to/path/charts/components/info-span-double/info-span-double.component';
import { LineChartComponent } from '.way/to/path/charts/line-chart/line-chart.component';
```

and in the `@NgModule` -> `declarations:`
```ts
...
InfoSpanDoubleComponent,
LineChartComponent,
...
```

### Create the Component

required props:
 - data
  - type: array of literal objects, with variebles:
     - 'x':Number,
     - 'y':Number, 
- labelX
  - type: string
  - value: the name of the x labe
- labelY
  - type: string
  - value: the name of the y label

example:
```jsx
      <app-line-chart [color]="'#0008f1'" [labelX]="'age'" [labelY]="'years experience'"
      [readData]="[{x: 37, y: 22}, {x: 46, y: 83}, {x: 50, y: 72}, {x: 62, y: 80}, {x: 70, y: 66}, 
      {x: 97,y: 43}]"></app-line-chart>
```

### Costumisation props

 - background (string): set the background of the chart
 - border (string): set the border of the chart
 - color (string): set the color of the line
 - height (number) set the height of the chart //the width is 100%
