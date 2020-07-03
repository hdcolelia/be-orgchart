import * as d3 from 'd3';
import { ID3Node, IStratifiedNode } from '../../../interfaces';
import { CurrencyPipe } from '@angular/common';

export interface INodeAttr {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  'stroke-width'?: number;
  rx?: number;
  fill?: string;
  [index:string]: number | string;
}

export interface INodeElement {
  type: string;
  class: string;
  text?: { 
    dataRef?: boolean;
    data: string;
  };
  attrs: INodeAttr[];
}

export class D3NodeBasicParser {
  constructor() { }
  // dimensions
  width: number = 120;
  height: number = 80;

  transitionDuration: number = 500;

  nodeElements: INodeElement[] = [
    {
      type: 'rect',
      class: 'node-rect',
      attrs: [{
        x: 0, y: 0, width: this.width, height: this.height,
        stroke: '#024ADA', "stroke-width": 2, rx: 25, fill: 'blue'
      }]
    }, {
      type: 'text',
      class: 'node-title',
      text: { dataRef: true, data: 'title' },
      attrs: [{
        x: 25, y: 10, width: 35, height: 12, 'font-size': 10 
      }]
  }];

  defs: d3.Selection<SVGDefsElement, any, any, any>

  prepareDefs(prSVG: d3.Selection<SVGElement, any, any, any>) {
    const me = this;
    me.defs = prSVG.append('defs');
  }

  protected addImage() {

  }


  drawNodes(prGroup: d3.Selection<SVGGElement, IStratifiedNode<ID3Node>, any, any>) {
    const me = this;

    // drawing defined elements
    for (const current of me.nodeElements) {
      const element = prGroup.append(current.type)
        .attr('class', current.class);
      // for each defined attr
      for (const key in current.attrs) {
        const attrValue = current[key];
        element.attr(key, attrValue)
      }

      // if text is defined
      if(current.text) {
        if(current.text.dataRef) {
          element.text(me[current.text.data]);
        } else {
          element.text(current.text.data)
        }
      }

    }

    /*
    prGroup 
      .append('rect')
      .attr('class', 'node-rect')
      .attr('width', me.width)
      .attr('height', me.height)
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'gray');
    prGroup.append('text')
      .text( d => d.data.title )
      .attr('font-size', 10).attr('x', 15).attr('y', 25);
    */
  }

  updateNodes(prGroup: d3.Selection<SVGGElement, any, any, any>, prNodes: d3.HierarchyPointNode<ID3Node>[]) {
    prGroup.select('rect.node-rect').attr('fill', 'black')
    //  .each(d => {
    //    console.log('argument: ', d);
    //  })

    //.data(prNodes).select('rect.node-rect')
    //.attr('x', d => d.x)
    //.attr('y', d => d.y);
    // console.log('Updateing...:', prGroup)
  }

}