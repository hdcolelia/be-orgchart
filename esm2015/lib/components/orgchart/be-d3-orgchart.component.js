import { __decorate } from "tslib";
import { Component, ElementRef, OnInit, ViewChildren, TemplateRef, QueryList, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
let BED3OrgchartComponent = class BED3OrgchartComponent {
    //#endregion
    constructor(prEl) {
        this.prEl = prEl;
    }
    get chart() {
        const me = this;
        if (!me._chart) {
            const options = {};
            // adding nodes if defined
            if (me.nodes)
                options.data = me.nodes;
            // adding node parser if defined
            if (me.nodeParser)
                options.nodeParser = me.nodeParser;
            me._chart = new D3OrgChart(this.prEl.nativeElement, options);
        }
        ;
        return me._chart;
    }
    ngAfterViewInit() {
        this.init();
    }
    ngOnChanges(changes) {
        const me = this;
        // detecting changes of input
        if (changes.nodeParser && changes.nodeParser.currentValue) {
            me.assignNodeParser(changes.nodeParser.currentValue);
            me.chart.render();
        }
        if (changes.nodes && changes.nodes.currentValue) {
            me.assignData(changes.nodes.currentValue);
            me.chart.render();
        }
    }
    init() {
        const me = this;
        // init the canvas
        const chart = me.chart; // Must be like this to ensure chart init
        me.chart.render();
        // setting data
        me.chart.onNodeClick.subscribe((data) => {
            console.log('Clicked: ', data);
        });
    }
    assignData(data, clear = true) {
        const me = this;
        const chart = me.chart; // Must be like this to ensure chart init
        // if isn´t array we convert it in array
        if (!(data instanceof Array))
            data = [data];
        if (clear) {
            chart.data = data;
            return;
        }
        // pushing data
        chart.data = [...chart.data, ...data];
        chart.render();
    }
    assignNodeParser(prParser) {
        const me = this;
        const chart = me.chart; // Must be like this to ensure chart init
        chart.nodeParser = prParser;
        chart.render();
    }
};
BED3OrgchartComponent.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], BED3OrgchartComponent.prototype, "nodes", void 0);
__decorate([
    Input()
], BED3OrgchartComponent.prototype, "nodeParser", void 0);
BED3OrgchartComponent = __decorate([
    Component({
        selector: 'be-d3-orgchart',
        template: "<div #orgchart class=\"container\"></div>\r\n\r\n<ng-template #defaultTemplate>\r\n  <svg height=\"400\" width=\"450\">\r\n    <path id=\"lineAB\" d=\"M 100 350 l 150 -300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path id=\"lineBC\" d=\"M 250 50 l 150 300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 175 200 l 150 0\" stroke=\"green\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 100 350 q 150 -300 300 0\" stroke=\"blue\" stroke-width=\"5\" fill=\"none\" />\r\n      <!-- Mark relevant points -->\r\n      <g stroke=\"black\" stroke-width=\"3\" fill=\"black\"> \r\n        <circle id=\"pointA\" cx=\"100\" cy=\"350\" r=\"3\" />\r\n        <circle id=\"pointB\" cx=\"250\" cy=\"50\" r=\"3\" />\r\n        <circle id=\"pointC\" cx=\"400\" cy=\"350\" r=\"3\" />\r\n      </g>\r\n      <!-- Label the points -->\r\n      <g font-size=\"30\" font-family=\"sans-serif\" fill=\"black\" stroke=\"none\" text-anchor=\"middle\">\r\n        <text x=\"100\" y=\"350\" dx=\"-30\">A</text>\r\n        <text x=\"250\" y=\"50\" dy=\"-10\">B</text>\r\n        <text x=\"400\" y=\"350\" dx=\"30\">C</text>\r\n      </g>\r\n    </svg>\r\n</ng-template>\r\n\r\n<ng-template #nodeTemplate>\r\n  <div>\r\n    <p>$$title</p>\r\n    <p>$$id</p>\r\n  </div>\r\n</ng-template> ",
        styles: [":host{display:flex;flex-direction:column;overflow:hidden}image.rounded{border-radius:50%;border-color:#00f;border-width:2px}"]
    })
], BED3OrgchartComponent);
export { BED3OrgchartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtZDMtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1kMy1vcmdjaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEosT0FBTyxFQUFFLFVBQVUsRUFBc0IsTUFBTSxrQ0FBa0MsQ0FBQztBQVNsRixJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtJQW1COUIsWUFBWTtJQUVaLFlBQXNCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBZjNDLElBQUksS0FBSztRQUNMLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUNaLE1BQU0sT0FBTyxHQUF1QixFQUFFLENBQUM7WUFDdkMsMEJBQTBCO1lBQzFCLElBQUksRUFBRSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3RDLGdDQUFnQztZQUNoQyxJQUFJLEVBQUUsQ0FBQyxVQUFVO2dCQUFFLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUV0RCxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2hFO1FBQUEsQ0FBQztRQUNGLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBS0QsZUFBZTtRQUNYLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNmLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRWhCLDZCQUE2QjtRQUM3QixJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUU7WUFDdkQsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckQsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtRQUVELElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtZQUM3QyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBeUIsQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckI7SUFFTCxDQUFDO0lBRUQsSUFBSTtRQUNBLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixrQkFBa0I7UUFDbEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLHlDQUF5QztRQUNqRSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLGVBQWU7UUFDZixFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQzFCLENBQUMsSUFBbUMsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ2xDLENBQUMsQ0FDSixDQUFBO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUF5QixFQUFFLFFBQWlCLElBQUk7UUFDdkQsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyx5Q0FBeUM7UUFDakUsd0NBQXdDO1FBQ3hDLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSxLQUFLLENBQUM7WUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLEtBQUssRUFBRTtZQUNQLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLE9BQU87U0FDVjtRQUNELGVBQWU7UUFDZixLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxRQUEyQjtRQUN4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLHlDQUF5QztRQUNqRSxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUM1QixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkIsQ0FBQztDQW9DSixDQUFBOztZQTFGK0IsVUFBVTs7QUFwQjdCO0lBQVIsS0FBSyxFQUFFO29EQUFrQjtBQUNqQjtJQUFSLEtBQUssRUFBRTt5REFBK0I7QUFGOUIscUJBQXFCO0lBTGpDLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUIsK3lDQUE4Qzs7S0FFakQsQ0FBQztHQUNXLHFCQUFxQixDQStHakM7U0EvR1kscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZHJlbiwgVGVtcGxhdGVSZWYsIFF1ZXJ5TGlzdCwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEM09yZ0NoYXJ0LCBJRDNPcmdDaGFydE9wdGlvbnMgfSBmcm9tICcuLi8uLi9jbGFzZXNzL2QzLW9yZy1jaGFydC5jbGFzcyc7XHJcbmltcG9ydCB7IElEM05vZGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgRDNOb2RlQmFzaWNQYXJzZXIgfSBmcm9tICcuLy4uLy4uL2NsYXNlc3MvQGl0ZW1zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdiZS1kMy1vcmdjaGFydCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQkVEM09yZ2NoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuICAgIEBJbnB1dCgpIG5vZGVzOiBJRDNOb2RlW107XHJcbiAgICBASW5wdXQoKSBub2RlUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcjtcclxuXHJcbiAgICAvLyNyZWdpb24gQ2hhcnRcclxuICAgIHByb3RlY3RlZCBfY2hhcnQ6IEQzT3JnQ2hhcnQ7XHJcbiAgICBnZXQgY2hhcnQoKTogRDNPcmdDaGFydCB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIGlmICghbWUuX2NoYXJ0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IElEM09yZ0NoYXJ0T3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICAvLyBhZGRpbmcgbm9kZXMgaWYgZGVmaW5lZFxyXG4gICAgICAgICAgICBpZiAobWUubm9kZXMpIG9wdGlvbnMuZGF0YSA9IG1lLm5vZGVzO1xyXG4gICAgICAgICAgICAvLyBhZGRpbmcgbm9kZSBwYXJzZXIgaWYgZGVmaW5lZFxyXG4gICAgICAgICAgICBpZiAobWUubm9kZVBhcnNlcikgb3B0aW9ucy5ub2RlUGFyc2VyID0gbWUubm9kZVBhcnNlcjtcclxuXHJcbiAgICAgICAgICAgIG1lLl9jaGFydCA9IG5ldyBEM09yZ0NoYXJ0KHRoaXMucHJFbC5uYXRpdmVFbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBtZS5fY2hhcnQ7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcHJFbDogRWxlbWVudFJlZikgeyB9XHJcblxyXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gZGV0ZWN0aW5nIGNoYW5nZXMgb2YgaW5wdXRcclxuICAgICAgICBpZiAoY2hhbmdlcy5ub2RlUGFyc2VyICYmIGNoYW5nZXMubm9kZVBhcnNlci5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgbWUuYXNzaWduTm9kZVBhcnNlcihjaGFuZ2VzLm5vZGVQYXJzZXIuY3VycmVudFZhbHVlKTtcclxuICAgICAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hhbmdlcy5ub2RlcyAmJiBjaGFuZ2VzLm5vZGVzLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICBtZS5hc3NpZ25EYXRhKGNoYW5nZXMubm9kZXMuY3VycmVudFZhbHVlIGFzIElEM05vZGVbXSk7XHJcbiAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8gaW5pdCB0aGUgY2FudmFzXHJcbiAgICAgICAgY29uc3QgY2hhcnQgPSBtZS5jaGFydDsgLy8gTXVzdCBiZSBsaWtlIHRoaXMgdG8gZW5zdXJlIGNoYXJ0IGluaXRcclxuICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICAvLyBzZXR0aW5nIGRhdGFcclxuICAgICAgICBtZS5jaGFydC5vbk5vZGVDbGljay5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChkYXRhOiB7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6ICcsIGRhdGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduRGF0YShkYXRhOiBJRDNOb2RlW10gfCBJRDNOb2RlLCBjbGVhcjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgY2hhcnQgPSBtZS5jaGFydDsgLy8gTXVzdCBiZSBsaWtlIHRoaXMgdG8gZW5zdXJlIGNoYXJ0IGluaXRcclxuICAgICAgICAvLyBpZiBpc27CtHQgYXJyYXkgd2UgY29udmVydCBpdCBpbiBhcnJheVxyXG4gICAgICAgIGlmICghKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkpIGRhdGEgPSBbZGF0YV07XHJcbiAgICAgICAgaWYgKGNsZWFyKSB7XHJcbiAgICAgICAgICAgIGNoYXJ0LmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHB1c2hpbmcgZGF0YVxyXG4gICAgICAgIGNoYXJ0LmRhdGEgPSBbLi4uY2hhcnQuZGF0YSwgLi4uZGF0YV07XHJcbiAgICAgICAgY2hhcnQucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduTm9kZVBhcnNlcihwclBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXIpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgY2hhcnQgPSBtZS5jaGFydDsgLy8gTXVzdCBiZSBsaWtlIHRoaXMgdG8gZW5zdXJlIGNoYXJ0IGluaXRcclxuICAgICAgICBjaGFydC5ub2RlUGFyc2VyID0gcHJQYXJzZXI7XHJcbiAgICAgICAgY2hhcnQucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vI3JlZ2lvbiBQYXJhIEVsaW1pbmFyXHJcbiAgICAvLyB4eHhpbml0KCkge1xyXG4gICAgLy8gICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vICAgICAvLyBPYnRlbmVtb3MgbGEgaW5mb1xyXG4gICAgLy8gICAgIGQzXHJcbiAgICAvLyAgICAgICAgIC5qc29uKCdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2J1bWJlaXNodmlsaS9kYzBkNDdiYzk1ZWYzNTlmZGM3NWI2M2NkNjVlZGFmMi9yYXcvYzMzYTNhMWVmNGJhOTI3ZTNlOTJiODE2MDBjOGM2YWRhMzQ1YzY0Yi9vcmdDaGFydC5qc29uJylcclxuICAgIC8vICAgICAgICAgLnRoZW4oKGRhdGE6IElEM05vZGVbXSkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIC8vIGRhdGEuZm9yRWFjaChjdXJyZW50ID0+IHsgY3VycmVudC5leHBhbmRlZCA9IHRydWU7IH0pXHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZygnQWRkaW5nIGRhdGE6ICcpXHJcbiAgICAvLyAgICAgICAgICAgICBtZS5jaGFydCA9IG5ldyBEM09yZ0NoYXJ0KHRoaXMucHJFbC5uYXRpdmVFbGVtZW50LCBkYXRhKTtcclxuICAgIC8vICAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIG1lLmNoYXJ0Lm9uTm9kZUNsaWNrLnN1YnNjcmliZShcclxuICAgIC8vICAgICAgICAgICAgICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6ICcsIGRhdGEpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgKVxyXG4gICAgLy8gICAgICAgICB9KTtcclxuXHJcbiAgICAvLyAgICAgLy8gbWUuY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCk7XHJcbiAgICAvLyAgICAgLy8gbWUuY2hhcnQucmVuZGVyKCk7XHJcblxyXG4gICAgLy8gICAgIC8vIG1lLmNoYXJ0Lm9uTm9kZUNsaWNrLnN1YnNjcmliZShcclxuICAgIC8vICAgICAvLyAgICAgKGRhdGE6IHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9KSA9PiB7XHJcbiAgICAvLyAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZDogJywgZGF0YSlcclxuICAgIC8vICAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8vIClcclxuICAgIC8vIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuXHJcblxyXG59XHJcblxyXG4iXX0=