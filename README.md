# be-orgchart

![](https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/logo/be-logo-120x120.png)

#### Support Us  [![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=JKGBMDGD4Q9NC)
----
######Angular component for display an Organization Chart.
- Draggable
- Zoomable
- & more... (see [DEMO](https://best-effort.web.app/orgchart-demo))

----

### VERSION 0.1.4 - New Features!

  - Fit Button: Fits Chart Content to container's size
  - Center Node: Double click centers node to the container
  - Font Awesome Icons: Support FAS (Font Awesome Solid) icons
  - Vertical Layout: Last branch could be vertical

### Working in progress for next version

  - Node Parser: Improving NodeParser for better customization of nodes
  - Node Actions: Adding action buttons for nodes
  - Toolbar: Adding a toolbar
----
## DEMO

[Best Effort](https://best-effort.web.app/orgchart-demo)

## Thanks

[My Inspiration](https://github.com/bumbeishvili/d3-organization-chart)
----
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
<be-orgchart [nodes]="nodes" [options]="chartOptions"></be-orgchart>
```
### any.component.ts
```js 
import { 
	BEOrgchartComponent, 
	ID3Node, 
	INodesJson,
	ID3OrgChartOptions 
} from 'be-orgchart';

// Required only of nodes are requested via hhtp request
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: '<<any>>-selector',
  templateUrl: './<<any>>.component.html',
  styleUrls: ['./<<any>>.component.scss']
})
export class <<any>>Component implements AfterViewInit {
  @ViewChild(BEOrgchartComponent, { static: true }) chart: BEOrgchartComponent;

  nodes: ID3Node[] = [];

  colors: string[] = [
    '#54dfc6', '#9ee0f9', '#617c87', '#721d2e', '#a032d2',
    '#f7cac9', '#dec2cb', '#c5b9cd', '#abb1cf', '#92a8d1'
  ]

  fonts: string[] = [ // must be strings
    'Times New Roman', 'Georgia', 'Arial', 'Verdana',
    'Courier New', 'Lucida Console', 'Tahoma'
  ]

  scales: number[] = [ // must be between 0 and 1
    0.8, 0.6, 0.4, 0.2, 0.1, 0
  ]


  chartOptions: ID3OrgChartOptions = {
    backgroundColor: ''
  }

  constructor(protected http: HttpClient) { }

  ngAfterViewInit() {
    const me = this;
    me.http.get('assets/nodes/nodes.json')
      .subscribe((data: INodesJson) => {
        // console.log('Data: ', data);
        me.nodes = data.nodes;
      })

    me.chart.onNodeClick.subscribe(
      (node: ID3Node) => {
        if (node.nodeId == 'id0101') {
          const currentBGColor = me.colors.shift();

          console.log('Changing bg color');
          me.chart.assignOptions({
            backgroundColor: currentBGColor
          })

          me.chart.chart.render();

          me.colors.push(currentBGColor);
        }

        if (node.nodeId == 'id0102') {
          const currentFont = me.fonts.shift();

          console.log('Changing Font');
          me.chart.assignOptions({
            defaultFont: currentFont
          })

          me.chart.chart.render();

          me.fonts.push(currentFont);
        }

        if (node.nodeId == 'id0103') {
          const currentScale = me.scales.shift();

          console.log('Changing Scale');
          me.chart.assignOptions({
            nodeHorizontalSpaceScale: currentScale
          })

          me.chart.chart.render();

          me.scales.push(currentScale);
        }
      }
    )
  }
}

```

### assets/nodes/nodes.json 
###### Comment: 
*you can delete the '$schema' item or copy "chart-schema.json" to yoy project for getting a nicer link*

```json
{
  "$schema": "./../../../../../node_modules/be-orgchart/src/lib/$schemas/chart-schema.json",
  "nodes": [
    {
      "nodeId": "root",
      "parentNodeId": "",
      "nodeImage": {
        "type": "icon",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "name": "faSitemap",
        "scale": 0.6
      },
      "title": "BE Orgchart",
      "description": "Expand for caracteristics",
      "expanded": false
    },
    {
      "nodeId": "id01",
      "parentNodeId": "root",
      "nodeImage": {
        "type": "icon",
        "name": "faCogs",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Configurable",
      "description": "See below",
      "childrenDist": "vertical"
    },
    {
      "nodeId": "id0101",
      "parentNodeId": "id01",
      "nodeImage": {
        "type": "icon",
        "name": "faPaintRoller",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Background Color",
      "description": "Press here to see",
      "childrenDist": "vertical"
    },
    {
      "nodeId": "id0102",
      "parentNodeId": "id01",
      "nodeImage": {
        "type": "icon",
        "name": "faFont",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Default Font",
      "description": "Press here to see"
    },
    {
      "nodeId": "id0103",
      "parentNodeId": "id01",
      "nodeImage": {
        "type": "icon",
        "name": "faArrowsAltH",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Change nodes separation",
      "description": "Press here to see",
      "childrenDist": "vertical"
    },
    {
      "nodeId": "id02",
      "parentNodeId": "root",
      "nodeImage": {
        "type": "icon",
        "name": "faSquare",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Canvas",
      "description": "On canvas....",
      "childrenDist": "vertical"
    },
    {
      "nodeId": "id0201",
      "parentNodeId": "id02",
      "nodeImage": {
        "type": "icon",
        "name": "faArrowsAlt",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Draggable",
      "description": "You can simply move it"
    },
    {
      "nodeId": "id0202",
      "parentNodeId": "id02",
      "nodeImage": {
        "type": "icon",
        "name": "faExpand",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Fitable",
      "description": "Press fit button... (UP-LEFT)"
    },
    {
      "nodeId": "id0203",
      "parentNodeId": "id02",
      "nodeImage": {
        "type": "icon",
        "name": "faExpand",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Zoomable",
      "description": "Use the mouse wheel"
    },
    {
      "nodeId": "id0204",
      "parentNodeId": "id02",
      "nodeImage": {
        "type": "icon",
        "name": "faCompressArrowsAlt",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Center Node on Screen",
      "description": "Double click on node"
    },
    {
      "nodeId": "id03",
      "parentNodeId": "root",
      "expanded": false,
      "nodeImage": {
        "type": "link",
        "data": "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/id02.png"
      },
      "title": "Juan Palomino",
      "description": "Otro Gerente"
    },
    {
      "nodeId": "id0301",
      "parentNodeId": "id03",
      "nodeImage": {
        "type": "link",
        "data": "https://raw.githubusercontent.com/hdcolelia/be-orgchart/master/src/lib/assets/images/id03.png"
      },
      "title": "Juan Perez",
      "description": "Jefe"
    },
    {
      "nodeId": "id0302",
      "parentNodeId": "id03",
      "title": "Juan Perez",
      "description": "Jefe"
    },
    {
      "nodeId": "id010101",
      "parentNodeId": "id0101",
      "nodeImage": {
        "type": "icon",
        "name": "faArrowsAlt",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Juan Perez 02",
      "description": "Jefe 02"
    },
    {
      "nodeId": "id010102",
      "parentNodeId": "id0101",
      "nodeImage": {
        "type": "icon",
        "name": "faExpand",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Juan Perez 03",
      "description": "Jefe 03"
    },
    {
      "nodeId": "id010103",
      "parentNodeId": "id0101",
      "nodeImage": {
        "type": "icon",
        "name": "faExpand",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Zoomable",
      "description": "Use the mouse wheel"
    },
    {
      "nodeId": "id010104",
      "parentNodeId": "id0101",
      "title": "Juan Perez 06",
      "description": "Jefe 05"
    },
    {
      "nodeId": "id04",
      "parentNodeId": "root",
      "nodeImage": {
        "type": "icon",
        "name": "faCompressArrowsAlt",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Vertical Child",
      "description": "Only applies if is the last branch",
      "childrenDist": "vertical"
    },
    {
      "nodeId": "id0401",
      "parentNodeId": "id04",
      "nodeImage": {
        "type": "icon",
        "name": "faArrowsAlt",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Draggable",
      "description": "You can simply move it"
    },
    {
      "nodeId": "id0402",
      "parentNodeId": "id04",
      "nodeImage": {
        "type": "icon",
        "name": "faExpand",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Fitable",
      "description": "Press fit button... (UP-LEFT)"
    },
    {
      "nodeId": "id0403",
      "parentNodeId": "id04",
      "nodeImage": {
        "type": "icon",
        "name": "faExpand",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Zoomable",
      "description": "Use the mouse wheel"
    },
    {
      "nodeId": "id0404",
      "parentNodeId": "id04",
      "nodeImage": {
        "type": "icon",
        "name": "faMask",
        "backgroundColor": "#07BEB8",
        "color": "#A9FFF7",
        "scale": 0.6
      },
      "title": "Peter Petrelli",
      "description": "The best Hero"
    }
  ]
}
```

### Node Definition
```ts

interface IIconDef {
  type: 'icon';
  name: string; [see REF-01]
  color: string;
  backgroundColor: string;
  scale?: number;
}

interface IImageDef {
  type: 'link' | 'base64';
  data: string;             // the link or the base64 string 
}

interface ID3Node {
  nodeId: string;                       // unique id
  parentNodeId: string;                 // parent id -- blank for root
  expanded?: boolean;                   // expanded if you want to init expanded
  nodeImage?: IIconDef | IImageDef;     // see above
  title: string;
  description: string;
  childrenDist?: 'horizontal' | 'vertical'; 
}
```

 REF-01 - (see [Font Awesome Solid Icons](https://fontawesome.com/icons?d=gallery&s=solid&m=free))