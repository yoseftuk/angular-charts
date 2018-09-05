# Bar Chart

### Import the component
add to the app.module.ts
```js
import { InfoSpanComponent } from './way/to/path/charts/components/info-span/info-span.component';
import { PieChartComponent } from '.way/to/path/charts/pie-chart/pie-chart.component';
```

and in the `@NgModule` -> `declarations:`
```ts
...
InfoSpanComponent,
PieChartComponent,
...
```

### Create the Component

required props:
 - name: readData
 - type: array of literal objects, with variebles:
     - 'color':String,
     - 'value':Number, 
     - 'label':String

example:
```jsx
    <app-pie-chart [readData]="[
    {color: '#f1623d', value: 25, label: 'the red one'},
    {color: '#497eff', value: 80, label: 'the blue one'},
    {color: '#ffdf5b', value: 45, label: 'the yellow one'},
    {color: '#5edb71', value: 22, label: 'the green one'}]"></app-pie-chart>
```

### Costumisation props

 - backgroundColor (string): set the background of the chart
 - border (string): set the border of the chart
 - textColor (string): set the text color of the labels
 - fontFamily (string): set the font-family of the labels
 - width (number): set the width (and height) of the chart
