import { Component, Input } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
import * as i0 from "@angular/core";
function BED3OrgchartComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(0, "svg", 4);
    i0.ɵɵelement(1, "path", 5);
    i0.ɵɵelement(2, "path", 6);
    i0.ɵɵelement(3, "path", 7);
    i0.ɵɵelement(4, "path", 8);
    i0.ɵɵelementStart(5, "g", 9);
    i0.ɵɵelement(6, "circle", 10);
    i0.ɵɵelement(7, "circle", 11);
    i0.ɵɵelement(8, "circle", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "g", 13);
    i0.ɵɵelementStart(10, "text", 14);
    i0.ɵɵtext(11, "A");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "text", 15);
    i0.ɵɵtext(13, "B");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "text", 16);
    i0.ɵɵtext(15, "C");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function BED3OrgchartComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵelementStart(1, "p");
    i0.ɵɵtext(2, "$$title");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "$$id");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
export class BED3OrgchartComponent {
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
}
BED3OrgchartComponent.ɵfac = function BED3OrgchartComponent_Factory(t) { return new (t || BED3OrgchartComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
BED3OrgchartComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BED3OrgchartComponent, selectors: [["be-d3-orgchart"]], inputs: { nodes: "nodes", nodeParser: "nodeParser" }, features: [i0.ɵɵNgOnChangesFeature], decls: 6, vars: 0, consts: [[1, "container"], ["orgchart", ""], ["defaultTemplate", ""], ["nodeTemplate", ""], ["height", "400", "width", "450"], ["id", "lineAB", "d", "M 100 350 l 150 -300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["id", "lineBC", "d", "M 250 50 l 150 300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["d", "M 175 200 l 150 0", "stroke", "green", "stroke-width", "3", "fill", "none"], ["d", "M 100 350 q 150 -300 300 0", "stroke", "blue", "stroke-width", "5", "fill", "none"], ["stroke", "black", "stroke-width", "3", "fill", "black"], ["id", "pointA", "cx", "100", "cy", "350", "r", "3"], ["id", "pointB", "cx", "250", "cy", "50", "r", "3"], ["id", "pointC", "cx", "400", "cy", "350", "r", "3"], ["font-size", "30", "font-family", "sans-serif", "fill", "black", "stroke", "none", "text-anchor", "middle"], ["x", "100", "y", "350", "dx", "-30"], ["x", "250", "y", "50", "dy", "-10"], ["x", "400", "y", "350", "dx", "30"]], template: function BED3OrgchartComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelement(0, "div", 0, 1);
        i0.ɵɵtemplate(2, BED3OrgchartComponent_ng_template_2_Template, 16, 0, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
        i0.ɵɵtemplate(4, BED3OrgchartComponent_ng_template_4_Template, 5, 0, "ng-template", null, 3, i0.ɵɵtemplateRefExtractor);
    } }, styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden}image.rounded[_ngcontent-%COMP%]{border-radius:50%;border-color:#00f;border-width:2px}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BED3OrgchartComponent, [{
        type: Component,
        args: [{
                selector: 'be-d3-orgchart',
                templateUrl: './be-d3-orgchart.component.html',
                styleUrls: ['./be-d3-orgchart.component.scss']
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { nodes: [{
            type: Input
        }], nodeParser: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtZDMtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1kMy1vcmdjaGFydC5jb21wb25lbnQudHMiLCJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1kMy1vcmdjaGFydC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUEyRSxLQUFLLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3BKLE9BQU8sRUFBRSxVQUFVLEVBQXNCLE1BQU0sa0NBQWtDLENBQUM7OztJQ0VoRixtQkFDRTtJQURGLDhCQUNFO0lBQUEsMEJBQ0U7SUFBQSwwQkFDQTtJQUFBLDBCQUNBO0lBQUEsMEJBQ0E7SUFDQSw0QkFDRTtJQUFBLDZCQUNBO0lBQUEsNkJBQ0E7SUFBQSw2QkFDRjtJQUFBLGlCQUFJO0lBRUosNkJBQ0U7SUFBQSxpQ0FBK0I7SUFBQSxrQkFBQztJQUFBLGlCQUFPO0lBQ3ZDLGlDQUE4QjtJQUFBLGtCQUFDO0lBQUEsaUJBQU87SUFDdEMsaUNBQThCO0lBQUEsa0JBQUM7SUFBQSxpQkFBTztJQUN4QyxpQkFBSTtJQUNOLGlCQUFNOzs7SUFJUiwyQkFDRTtJQUFBLHlCQUFHO0lBQUEsdUJBQU87SUFBQSxpQkFBSTtJQUNkLHlCQUFHO0lBQUEsb0JBQUk7SUFBQSxpQkFBSTtJQUNiLGlCQUFNOztBRGhCUixNQUFNLE9BQU8scUJBQXFCO0lBbUI5QixZQUFZO0lBRVosWUFBc0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7SUFmM0MsSUFBSSxLQUFLO1FBQ0wsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQ1osTUFBTSxPQUFPLEdBQXVCLEVBQUUsQ0FBQztZQUN2QywwQkFBMEI7WUFDMUIs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aUM7Z0JBQzlDLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO2FBQ2pEOztrQkFFSSxLQUFLOztrQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFZpZXdDaGlsZHJlbiwgVGVtcGxhdGVSZWYsIFF1ZXJ5TGlzdCwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEM09yZ0NoYXJ0LCBJRDNPcmdDaGFydE9wdGlvbnMgfSBmcm9tICcuLi8uLi9jbGFzZXNzL2QzLW9yZy1jaGFydC5jbGFzcyc7XHJcbmltcG9ydCB7IElEM05vZGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJztcclxuaW1wb3J0ICogYXMgZDMgZnJvbSAnZDMnO1xyXG5pbXBvcnQgeyBOb2RlSXRlbVBhcnNlciB9IGZyb20gJy4uL0BpdGVtcy9iYXNpYy9pdGVtLWJhc2ljJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdiZS1kMy1vcmdjaGFydCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vYmUtZDMtb3JnY2hhcnQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQkVEM09yZ2NoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuICAgIEBJbnB1dCgpIG5vZGVzOiBJRDNOb2RlW107XHJcbiAgICBASW5wdXQoKSBub2RlUGFyc2VyOiBOb2RlSXRlbVBhcnNlcjtcclxuXHJcbiAgICAvLyNyZWdpb24gQ2hhcnRcclxuICAgIHByb3RlY3RlZCBfY2hhcnQ6IEQzT3JnQ2hhcnQ7XHJcbiAgICBnZXQgY2hhcnQoKTogRDNPcmdDaGFydCB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIGlmICghbWUuX2NoYXJ0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IElEM09yZ0NoYXJ0T3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICAvLyBhZGRpbmcgbm9kZXMgaWYgZGVmaW5lZFxyXG4gICAgICAgICAgICBpZiAobWUubm9kZXMpIG9wdGlvbnMuZGF0YSA9IG1lLm5vZGVzO1xyXG4gICAgICAgICAgICAvLyBhZGRpbmcgbm9kZSBwYXJzZXIgaWYgZGVmaW5lZFxyXG4gICAgICAgICAgICBpZiAobWUubm9kZVBhcnNlcikgb3B0aW9ucy5ub2RlUGFyc2VyID0gbWUubm9kZVBhcnNlcjtcclxuXHJcbiAgICAgICAgICAgIG1lLl9jaGFydCA9IG5ldyBEM09yZ0NoYXJ0KHRoaXMucHJFbC5uYXRpdmVFbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBtZS5fY2hhcnQ7XHJcbiAgICB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcHJFbDogRWxlbWVudFJlZikgeyB9XHJcblxyXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gZGV0ZWN0aW5nIGNoYW5nZXMgb2YgaW5wdXRcclxuICAgICAgICBpZiAoY2hhbmdlcy5ub2RlUGFyc2VyICYmIGNoYW5nZXMubm9kZVBhcnNlci5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgbWUuYXNzaWduTm9kZVBhcnNlcihjaGFuZ2VzLm5vZGVQYXJzZXIuY3VycmVudFZhbHVlKTtcclxuICAgICAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hhbmdlcy5ub2RlcyAmJiBjaGFuZ2VzLm5vZGVzLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICBtZS5hc3NpZ25EYXRhKGNoYW5nZXMubm9kZXMuY3VycmVudFZhbHVlIGFzIElEM05vZGVbXSk7XHJcbiAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgLy8gaW5pdCB0aGUgY2FudmFzXHJcbiAgICAgICAgY29uc3QgY2hhcnQgPSBtZS5jaGFydDsgLy8gTXVzdCBiZSBsaWtlIHRoaXMgdG8gZW5zdXJlIGNoYXJ0IGluaXRcclxuICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICAvLyBzZXR0aW5nIGRhdGFcclxuICAgICAgICBtZS5jaGFydC5vbk5vZGVDbGljay5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChkYXRhOiB7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6ICcsIGRhdGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduRGF0YShkYXRhOiBJRDNOb2RlW10gfCBJRDNOb2RlLCBjbGVhcjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgY2hhcnQgPSBtZS5jaGFydDsgLy8gTXVzdCBiZSBsaWtlIHRoaXMgdG8gZW5zdXJlIGNoYXJ0IGluaXRcclxuICAgICAgICAvLyBpZiBpc27CtHQgYXJyYXkgd2UgY29udmVydCBpdCBpbiBhcnJheVxyXG4gICAgICAgIGlmICghKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkpIGRhdGEgPSBbZGF0YV07XHJcbiAgICAgICAgaWYgKGNsZWFyKSB7XHJcbiAgICAgICAgICAgIGNoYXJ0LmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHB1c2hpbmcgZGF0YVxyXG4gICAgICAgIGNoYXJ0LmRhdGEgPSBbLi4uY2hhcnQuZGF0YSwgLi4uZGF0YV07XHJcbiAgICAgICAgY2hhcnQucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXNzaWduTm9kZVBhcnNlcihwclBhcnNlcjogTm9kZUl0ZW1QYXJzZXIpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgY2hhcnQgPSBtZS5jaGFydDsgLy8gTXVzdCBiZSBsaWtlIHRoaXMgdG8gZW5zdXJlIGNoYXJ0IGluaXRcclxuICAgICAgICBjaGFydC5ub2RlUGFyc2VyID0gcHJQYXJzZXI7XHJcbiAgICAgICAgY2hhcnQucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vI3JlZ2lvbiBQYXJhIEVsaW1pbmFyXHJcbiAgICAvLyB4eHhpbml0KCkge1xyXG4gICAgLy8gICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIC8vICAgICAvLyBPYnRlbmVtb3MgbGEgaW5mb1xyXG4gICAgLy8gICAgIGQzXHJcbiAgICAvLyAgICAgICAgIC5qc29uKCdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2J1bWJlaXNodmlsaS9kYzBkNDdiYzk1ZWYzNTlmZGM3NWI2M2NkNjVlZGFmMi9yYXcvYzMzYTNhMWVmNGJhOTI3ZTNlOTJiODE2MDBjOGM2YWRhMzQ1YzY0Yi9vcmdDaGFydC5qc29uJylcclxuICAgIC8vICAgICAgICAgLnRoZW4oKGRhdGE6IElEM05vZGVbXSkgPT4ge1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIC8vIGRhdGEuZm9yRWFjaChjdXJyZW50ID0+IHsgY3VycmVudC5leHBhbmRlZCA9IHRydWU7IH0pXHJcbiAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZygnQWRkaW5nIGRhdGE6ICcpXHJcbiAgICAvLyAgICAgICAgICAgICBtZS5jaGFydCA9IG5ldyBEM09yZ0NoYXJ0KHRoaXMucHJFbC5uYXRpdmVFbGVtZW50LCBkYXRhKTtcclxuICAgIC8vICAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG5cclxuICAgIC8vICAgICAgICAgICAgIG1lLmNoYXJ0Lm9uTm9kZUNsaWNrLnN1YnNjcmliZShcclxuICAgIC8vICAgICAgICAgICAgICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6ICcsIGRhdGEpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgKVxyXG4gICAgLy8gICAgICAgICB9KTtcclxuXHJcbiAgICAvLyAgICAgLy8gbWUuY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCk7XHJcbiAgICAvLyAgICAgLy8gbWUuY2hhcnQucmVuZGVyKCk7XHJcblxyXG4gICAgLy8gICAgIC8vIG1lLmNoYXJ0Lm9uTm9kZUNsaWNrLnN1YnNjcmliZShcclxuICAgIC8vICAgICAvLyAgICAgKGRhdGE6IHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9KSA9PiB7XHJcbiAgICAvLyAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZDogJywgZGF0YSlcclxuICAgIC8vICAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8vIClcclxuICAgIC8vIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuXHJcblxyXG59XHJcblxyXG4iLCI8ZGl2ICNvcmdjaGFydCBjbGFzcz1cImNvbnRhaW5lclwiPjwvZGl2PlxyXG5cclxuPG5nLXRlbXBsYXRlICNkZWZhdWx0VGVtcGxhdGU+XHJcbiAgPHN2ZyBoZWlnaHQ9XCI0MDBcIiB3aWR0aD1cIjQ1MFwiPlxyXG4gICAgPHBhdGggaWQ9XCJsaW5lQUJcIiBkPVwiTSAxMDAgMzUwIGwgMTUwIC0zMDBcIiBzdHJva2U9XCJyZWRcIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8cGF0aCBpZD1cImxpbmVCQ1wiIGQ9XCJNIDI1MCA1MCBsIDE1MCAzMDBcIiBzdHJva2U9XCJyZWRcIiBzdHJva2Utd2lkdGg9XCIzXCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTSAxNzUgMjAwIGwgMTUwIDBcIiBzdHJva2U9XCJncmVlblwiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNIDEwMCAzNTAgcSAxNTAgLTMwMCAzMDAgMFwiIHN0cm9rZT1cImJsdWVcIiBzdHJva2Utd2lkdGg9XCI1XCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8IS0tIE1hcmsgcmVsZXZhbnQgcG9pbnRzIC0tPlxyXG4gICAgICA8ZyBzdHJva2U9XCJibGFja1wiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwiYmxhY2tcIj4gXHJcbiAgICAgICAgPGNpcmNsZSBpZD1cInBvaW50QVwiIGN4PVwiMTAwXCIgY3k9XCIzNTBcIiByPVwiM1wiIC8+XHJcbiAgICAgICAgPGNpcmNsZSBpZD1cInBvaW50QlwiIGN4PVwiMjUwXCIgY3k9XCI1MFwiIHI9XCIzXCIgLz5cclxuICAgICAgICA8Y2lyY2xlIGlkPVwicG9pbnRDXCIgY3g9XCI0MDBcIiBjeT1cIjM1MFwiIHI9XCIzXCIgLz5cclxuICAgICAgPC9nPlxyXG4gICAgICA8IS0tIExhYmVsIHRoZSBwb2ludHMgLS0+XHJcbiAgICAgIDxnIGZvbnQtc2l6ZT1cIjMwXCIgZm9udC1mYW1pbHk9XCJzYW5zLXNlcmlmXCIgZmlsbD1cImJsYWNrXCIgc3Ryb2tlPVwibm9uZVwiIHRleHQtYW5jaG9yPVwibWlkZGxlXCI+XHJcbiAgICAgICAgPHRleHQgeD1cIjEwMFwiIHk9XCIzNTBcIiBkeD1cIi0zMFwiPkE8L3RleHQ+XHJcbiAgICAgICAgPHRleHQgeD1cIjI1MFwiIHk9XCI1MFwiIGR5PVwiLTEwXCI+QjwvdGV4dD5cclxuICAgICAgICA8dGV4dCB4PVwiNDAwXCIgeT1cIjM1MFwiIGR4PVwiMzBcIj5DPC90ZXh0PlxyXG4gICAgICA8L2c+XHJcbiAgICA8L3N2Zz5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjbm9kZVRlbXBsYXRlPlxyXG4gIDxkaXY+XHJcbiAgICA8cD4kJHRpdGxlPC9wPlxyXG4gICAgPHA+JCRpZDwvcD5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT4gIl19