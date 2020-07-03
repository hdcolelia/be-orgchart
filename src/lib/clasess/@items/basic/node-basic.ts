import * as d3 from 'd3';
import { ID3Node } from './../../../interfaces';

// getting base64 icons
import { expandBase64Data } from './../../../assets/icons/expand.base64';
import { collapseBase64Data } from './../../../assets/icons/collapse.base64';
import { errorBase64Data } from './../../../assets/icons/error.base64';


export class D3NodeBasicParser {
  constructor() { }
  // dimensions
  width: number = 220;
  height: number = 80;

  // expand / colapse icons
  expandBase64Icon = expandBase64Data;
  collapseBase64Icon = collapseBase64Data;

  // error icon
  errorBase64Icon = errorBase64Data;

  imageDefs: { x: number, y: number, h: number, w: number, rx: number } = {
    x: -20, y: -15, h: 60, w: 60, rx: 6
  }

  transitionDuration: number = 500;

  protected addImage() {

  }

  drawNodes(
    prGroup: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>
  ) {
    const me = this;
    prGroup.each((d, i) => me.drawNode(d, i, prGroup));
  }

  drawNode(prData: d3.HierarchyPointNode<ID3Node>, prIndex: number, node: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>) {
    const me = this;
    
    // adding rect
    node.append('rect').attr('class', 'node-rect')
      .attr('width', me.width).attr('height', me.height)
      .attr('stroke', 'blue').attr('stroke-width', 1)
      .attr('fill', '#02B2AC').attr('rx', 12);

    // adding title
    node.append('text').text(d => d.data.title)
      .attr('font-size', 15).attr('x', 50).attr('y', 25);

    // adding description
    node.append('text').text(d => d.data.description)
      .attr('font-size', 10).attr('x', 50).attr('y', 45);
    // prGroup.


    if(prData.data.nodeImage) {
      const defs = node.append('defs').append('pattern')
        .attr('id', d => `img-${d.data.nodeId}`)
        .attr('width', 1)
        .attr('height', 1);
      
      let linkRef: string = ''
      if(prData.data.nodeImage.url) linkRef = prData.data.nodeImage.url;
      if(prData.data.nodeImage.icon) linkRef = prData.data.nodeImage.icon;
      if(prData.data.nodeImage.base64) linkRef = `data:image/png;base64,${prData.data.nodeImage.base64}`;

      const image = defs.append('image')
        .attr('xlink:href', linkRef)
        .attr('width', me.imageDefs.w)
        .attr('height', me.imageDefs.h)
        // .attr('viewbox', '0 0 100 100')

      .attr('preserveAspectRatio', 'xMidYMin slice');
      // adding image
      node.append('rect').attr('class', 'node-image')
      .attr('x', me.imageDefs.x).attr('y', me.imageDefs.y)
      .attr('width', me.imageDefs.w).attr('height', me.imageDefs.h)
      // .attr('stroke', 'blue').attr('stroke-width', 1)
      .attr('fill', d => `url(#img-${d.data.nodeId})`).attr('rx', me.imageDefs.rx);
    }
  }

  xxxdrawNodes(
    prGroup: d3.Selection<SVGGElement, d3.HierarchyPointNode<ID3Node>, any, any>
  ) {
    const me = this;
    prGroup
      .append('defs')
      .append('pattern')
      .attr('id', d => `img-${d.data.nodeId}`)
      .attr('width', 70)
      .attr('height', 70)
      .append('image')
      .attr('xlink:href', d => d.data.nodeImage.url)
      .attr('width', 70)
      .attr('height', 70);

    // adding rect
    prGroup.append('rect').attr('class', 'node-rect')
      .attr('width', me.width).attr('height', me.height)
      .attr('stroke', 'blue').attr('stroke-width', 1)
      .attr('fill', 'gray').attr('rx', 12);

    // adding title
    prGroup.append('text').text(d => d.data.title)
      .attr('font-size', 10).attr('x', 70).attr('y', 25);

    // adding description
    prGroup.append('text').text(d => d.data.description)
      .attr('font-size', 10).attr('x', 70).attr('y', 45);

    // adding image
    prGroup.append('rect').attr('class', 'node-image')
      .attr('x', 5).attr('y', 10)
      .attr('width', 50).attr('height', 50)
      .attr('fill', d => `url(#img-${d.data.nodeId})`);
    // prGroup.

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