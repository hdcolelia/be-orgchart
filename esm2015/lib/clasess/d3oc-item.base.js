export class D3OrgChartItem {
    constructor(svgCanvas) {
        this.svgCanvas = svgCanvas;
        this.components = [
            {
                tag: 'circle',
                attrs: {
                    r: '50'
                }
            }
        ];
    }
    draw() {
        const me = this;
        me.g = me.svgCanvas.append('g')
            .attr('x', me.x0)
            .attr('y', me.y0);
        me.addComponents();
    }
    addComponents() {
        const me = this;
        // adding components
        for (const currentCompDefs of me.components || []) {
            const comp = me.g.append(currentCompDefs.tag);
            // adding tags
            for (const key in currentCompDefs.attrs) {
                const attr = currentCompDefs.attrs[key];
                comp.attr(key, attr);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZDNvYy1pdGVtLmJhc2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9iZS1kMy1vcmdjaGFydC8iLCJzb3VyY2VzIjpbImxpYi9jbGFzZXNzL2Qzb2MtaXRlbS5iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE1BQU0sT0FBTyxjQUFjO0lBa0J6QixZQUNZLFNBQW1EO1FBQW5ELGNBQVMsR0FBVCxTQUFTLENBQTBDO1FBVi9ELGVBQVUsR0FBcUI7WUFDN0I7Z0JBQ0UsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsS0FBSyxFQUFFO29CQUNMLENBQUMsRUFBRSxJQUFJO2lCQUNSO2FBQ0Y7U0FDRixDQUFDO0lBSUMsQ0FBQztJQUVKLElBQUk7UUFDRixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsYUFBYTtRQUNyQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsb0JBQW9CO1FBQ3BCLEtBQUssTUFBTSxlQUFlLElBQUksRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFLEVBQUU7WUFDakQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLGNBQWM7WUFDZCxLQUFLLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3ZDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO2FBQ3JCO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElJdGVtQ29tcG9uZW50IHtcclxuICB0YWc6IHN0cmluZztcclxuICBhdHRyczoge1xyXG4gICAgW2luZGV4OiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRDNPcmdDaGFydEl0ZW0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgcGFyZW50SWQ6IHN0cmluZztcclxuXHJcbiAgZzogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBhbnksIGFueSwgYW55PjtcclxuXHJcbiAgeDA6IG51bWJlcjtcclxuICB5MDogbnVtYmVyO1xyXG5cclxuICBjb21wb25lbnRzOiBJSXRlbUNvbXBvbmVudFtdID0gW1xyXG4gICAge1xyXG4gICAgICB0YWc6ICdjaXJjbGUnLFxyXG4gICAgICBhdHRyczoge1xyXG4gICAgICAgIHI6ICc1MCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIF07XHJcbiAgICBcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByb3RlY3RlZCBzdmdDYW52YXM6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgYW55LCBhbnksIGFueT5cclxuICApIHt9XHJcblxyXG4gIGRyYXcoKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICBtZS5nID0gbWUuc3ZnQ2FudmFzLmFwcGVuZCgnZycpXHJcbiAgICAuYXR0cigneCcsIG1lLngwKVxyXG4gICAgLmF0dHIoJ3knLCBtZS55MCk7XHJcbiAgICBtZS5hZGRDb21wb25lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgYWRkQ29tcG9uZW50cygpIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vIGFkZGluZyBjb21wb25lbnRzXHJcbiAgICBmb3IgKGNvbnN0IGN1cnJlbnRDb21wRGVmcyBvZiBtZS5jb21wb25lbnRzIHx8IFtdKSB7XHJcbiAgICAgIGNvbnN0IGNvbXAgPSBtZS5nLmFwcGVuZChjdXJyZW50Q29tcERlZnMudGFnKTtcclxuICAgICAgLy8gYWRkaW5nIHRhZ3NcclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3VycmVudENvbXBEZWZzLmF0dHJzKSB7XHJcbiAgICAgICAgY29uc3QgYXR0ciA9IGN1cnJlbnRDb21wRGVmcy5hdHRyc1trZXldO1xyXG4gICAgICAgIGNvbXAuYXR0cihrZXksIGF0dHIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19