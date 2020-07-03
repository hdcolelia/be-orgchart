import * as d3 from 'd3';

export interface IItemComponent {
  tag: string;
  attrs: {
    [index: string]: string;
  }
}

export class D3OrgChartItem {
  id: string;
  parentId: string;

  g: d3.Selection<SVGGElement, any, any, any>;

  x0: number;
  y0: number;

  components: IItemComponent[] = [
    {
      tag: 'circle',
      attrs: {
        r: '50'
      }
    }
  ];
    
  constructor(
    protected svgCanvas: d3.Selection<SVGGElement, any, any, any>
  ) {}

  draw() {
    const me = this;
    me.g = me.svgCanvas.append('g')
    .attr('x', me.x0)
    .attr('y', me.y0);
    me.addComponents();
  }

  protected addComponents() {
    const me = this;
    // adding components
    for (const currentCompDefs of me.components || []) {
      const comp = me.g.append(currentCompDefs.tag);
      // adding tags
      for (const key in currentCompDefs.attrs) {
        const attr = currentCompDefs.attrs[key];
        comp.attr(key, attr)
      }
    }
  }
}
