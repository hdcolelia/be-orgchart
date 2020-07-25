# be-orgchart

Angular component for display an Organization Chart.
- Draggable
- Zoomable
- & more... (see [DEMO](https://best-effort.web.app/orgchart-demo))


# Support Us

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JKGBMDGD4Q9NC)

## Working in progress for next version
### - fit button: It will fit the orgchart to container
### - center node: It will center node to the container when clicked
### - node icon: adding support to font awesome icons for nodes


## Working in progress for next version
### - fit button: It will fit the orgchart to container
### - center node: It will center node to the container when clicked
### - node icon: adding support to font awesome icons for nodes

## DEMO

[Best Effort](https://best-effort.web.app/orgchart-demo)

## Thanks

[My Inspiration](https://github.com/bumbeishvili/d3-organization-chart)

## Usage

#### Comment: replace [any] for your used names

### app.module.ts
```ts
import { BEOrgchartModule } from 'be-orgchart';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...
    BEOrgchartModule,
    ....
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
```
### any.component.html
```html
<be-orgchart [nodes]="nodes"></be-orgchart>
```
### any.component.ts
```js 
import { BEOrgchartComponent, ID3Node, INodesJson } from 'be-orgchart';
import { HttpClient } from '@angular/common/http'; // Required only of nodes are requested via hhtp request

@Component({
  selector: 'any',
  templateUrl: './any.component.html',
  styleUrls: ['./any.component.scss'] 
})
export class <<any>>Component implements AfterViewInit {
  @ViewChild(BEOrgchartComponent, { static: true }) chart: BEOrgchartComponent;

  nodes: ID3Node[] = []; // you can fill it here

  constructor(protected http: HttpClient) { }

  ngAfterViewInit() {
    const me = this;
    me.http.get('assets/nodes/nodes.json')
      .subscribe((data: INodesJson) => {
        me.nodes = data.nodes; 
      })
  }
}
```

### assets/nodes/nodes.json 
#### Comment: you can delete the '$schema' item
```json
{
  "nodes": [
    {
      "nodeId": "root",
      "parentNodeId": "",
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/root.png",
        "icon": ""
      },
      "title": "John Doe",
      "description": "He is the boss"
    },
    {
      "nodeId": "id01",
      "parentNodeId": "root",
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/id01.png",
        "icon": ""
      },
      "title": "Juan Carlos Palomino",
      "description": "El Gerente"
    },
    {
      "nodeId": "id02",
      "parentNodeId": "root",
      "expanded": true,
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/id02.png",
        "icon": ""
      },
      "title": "Juan Palomino",
      "description": "Otro Gerente"
    },
    {
      "nodeId": "id03",
      "parentNodeId": "id02",
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/id03.png",
        "icon": ""
      },
      "title": "Juan Perez",
      "description": "Jefe"
    },
    {
      "nodeId": "id04",
      "parentNodeId": "id01",
      "title": "Juan Perez",
      "description": "Jefe"
    }
  ]
}
```

### Node Definition
```ts
interface ID3Node {
  nodeId: string;         // unique id
  parentNodeId: string;   // parent id -- blank for root
  expanded?: boolean;     // expande if you want to init expanded
  nodeImage?: {           // images options
    url?: string;         // url
    icon?: string;        // not supported yet
    base64?: string;      // base64 data
  },
  title: string;          // title of node
  description: string;    // description of node
}
```

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JKGBMDGD4Q9NC)

