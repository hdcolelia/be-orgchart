# BeD3Orgchart

Angular component for display an Organization Chart.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Usage

#### Comment: replace <<any>> for your used names


### app.module.ts

import { BED3OrgchartModule } from 'be-d3-orgchart';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...
    BED3OrgchartModule,
    ....
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }

### <<any>>.component.html

<be-d3-orgchart [nodes]="nodes"></be-d3-orgchart>

### <<any>>.component.ts

import { BED3OrgchartComponent, D3NodeBasicParser, ID3Node, INodesJson } from 'be-d3-orgchart';
import { HttpClient } from '@angular/common/http'; // Required only of nodes are requested via hhtp request

@Component({
  selector: '<selector>',
  templateUrl: './<<any>>.component.html',
  styleUrls: ['./<<any>>.component.scss'] 
})
export class <<any>>Component implements AfterViewInit {
  @ViewChild(BED3OrgchartComponent, { static: true }) chart: BED3OrgchartComponent;

  nodes: ID3Node[] = []; // you can fill it here

  constructor(protected http: HttpClient) { }

  ngAfterViewInit() {
    const me = this;
    me.http.get('assets/nodes/nodes.json')
      .subscribe((data: INodesJson) => {
        console.log('Data: ', data);
        me.nodes = data.nodes; 
      })
  }
}


### assets/nodes/nodes.json 
#### Comment: you can delete the '$schema' item
{
  "$schema": "node_modules/be-d3-orgchart/src/lib/$schemas/chart-schema.json",
  "nodes": [
    {
      "nodeId": "root",
      "parentNodeId": "",
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
        "icon": ""
      },
      "title": "John Doe",
      "description": "He is the boss"
    }, {
      "nodeId": "id01",
      "parentNodeId": "root",
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
        "icon": ""
      },
      "title": "Juan Carlos Palomino",
      "description": "El Gerente"
    }, {
      "nodeId": "id02",
      "parentNodeId": "root",
      "expanded": true,
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
        "icon": ""
      },
      "title": "Juan Palomino",
      "description": "Otro Gerente"
    }, {
      "nodeId": "id03",
      "parentNodeId": "id02",
      "nodeImage": {
        "url": "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/cto.jpg",
        "icon": ""
      },
      "title": "Juan Perez",
      "description": "Jefe"
    }
  ]
}


### Node Definition

interface ID3Node {
  nodeId: string; // unique id
  parentNodeId: string; // parent id -- blank for root
  expanded?: boolean; // expande if you want to init expanded
  nodeImage?: { // images options
    url?: string; // url
    icon?: string; // not supported yet
    base64?: string; // base64 data
  },
  title: string; // title of node
  description: string; // description of node
}