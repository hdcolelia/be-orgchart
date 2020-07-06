import { Component, Input } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
import * as i0 from "@angular/core";
function BEOrgchartComponent_ng_template_2_Template(rf, ctx) { if (rf & 1) {
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
function BEOrgchartComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div");
    i0.ɵɵelementStart(1, "p");
    i0.ɵɵtext(2, "$$title");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "$$id");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
export class BEOrgchartComponent {
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
BEOrgchartComponent.ɵfac = function BEOrgchartComponent_Factory(t) { return new (t || BEOrgchartComponent)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
BEOrgchartComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BEOrgchartComponent, selectors: [["be-orgchart"]], inputs: { nodes: "nodes", nodeParser: "nodeParser" }, features: [i0.ɵɵNgOnChangesFeature], decls: 6, vars: 0, consts: [[1, "container"], ["orgchart", ""], ["defaultTemplate", ""], ["nodeTemplate", ""], ["height", "400", "width", "450"], ["id", "lineAB", "d", "M 100 350 l 150 -300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["id", "lineBC", "d", "M 250 50 l 150 300", "stroke", "red", "stroke-width", "3", "fill", "none"], ["d", "M 175 200 l 150 0", "stroke", "green", "stroke-width", "3", "fill", "none"], ["d", "M 100 350 q 150 -300 300 0", "stroke", "blue", "stroke-width", "5", "fill", "none"], ["stroke", "black", "stroke-width", "3", "fill", "black"], ["id", "pointA", "cx", "100", "cy", "350", "r", "3"], ["id", "pointB", "cx", "250", "cy", "50", "r", "3"], ["id", "pointC", "cx", "400", "cy", "350", "r", "3"], ["font-size", "30", "font-family", "sans-serif", "fill", "black", "stroke", "none", "text-anchor", "middle"], ["x", "100", "y", "350", "dx", "-30"], ["x", "250", "y", "50", "dy", "-10"], ["x", "400", "y", "350", "dx", "30"]], template: function BEOrgchartComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelement(0, "div", 0, 1);
        i0.ɵɵtemplate(2, BEOrgchartComponent_ng_template_2_Template, 16, 0, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
        i0.ɵɵtemplate(4, BEOrgchartComponent_ng_template_4_Template, 5, 0, "ng-template", null, 3, i0.ɵɵtemplateRefExtractor);
    } }, styles: ["[_nghost-%COMP%]{display:flex;flex-direction:column;overflow:hidden}image.rounded[_ngcontent-%COMP%]{border-radius:50%;border-color:#00f;border-width:2px}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BEOrgchartComponent, [{
        type: Component,
        args: [{
                selector: 'be-orgchart',
                templateUrl: './be-orgchart.component.html',
                styleUrls: ['./be-orgchart.component.scss']
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, { nodes: [{
            type: Input
        }], nodeParser: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1vcmdjaGFydC5jb21wb25lbnQudHMiLCJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1vcmdjaGFydC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUE2QixLQUFLLEVBQTRCLE1BQU0sZUFBZSxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxVQUFVLEVBQXNCLE1BQU0sa0NBQWtDLENBQUM7OztJQ0VoRixtQkFDRTtJQURGLDhCQUNFO0lBQUEsMEJBQ0U7SUFBQSwwQkFDQTtJQUFBLDBCQUNBO0lBQUEsMEJBQ0E7SUFDQSw0QkFDRTtJQUFBLDZCQUNBO0lBQUEsNkJBQ0E7SUFBQSw2QkFDRjtJQUFBLGlCQUFJO0lBRUosNkJBQ0U7SUFBQSxpQ0FBK0I7SUFBQSxrQkFBQztJQUFBLGlCQUFPO0lBQ3ZDLGlDQUE4QjtJQUFBLGtCQUFDO0lBQUEsaUJBQU87SUFDdEMsaUNBQThCO0lBQUEsa0JBQUM7SUFBQSxpQkFBTztJQUN4QyxpQkFBSTtJQUNOLGlCQUFNOzs7SUFJUiwyQkFDRTtJQUFBLHlCQUFHO0lBQUEsdUJBQU87SUFBQSxpQkFBSTtJQUNkLHlCQUFHO0lBQUEsb0JBQUk7SUFBQSxpQkFBSTtJQUNiLGlCQUFNOztBRGpCUixNQUFNLE9BQU8sbUJBQW1CO0lBbUI1QixZQUFZO0lBRVosWUFBc0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7SUFmM0MsSUFBSSxLQUFLO1FBQ0wsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQ1osTUFBTSxPQUFPLEdBQXVCLEVBQUUsQ0FBQztZQUN2QywwQkFBMEI7WUFDMUIsSUFBSSxFQUFFLENB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LEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQzthQUM5Qzs7a0JBRUksS0FBSzs7a0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEM09yZ0NoYXJ0LCBJRDNPcmdDaGFydE9wdGlvbnMgfSBmcm9tICcuLi8uLi9jbGFzZXNzL2QzLW9yZy1jaGFydC5jbGFzcyc7XHJcbmltcG9ydCB7IElEM05vZGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgRDNOb2RlQmFzaWNQYXJzZXIgfSBmcm9tICcuLi8uLi9jbGFzZXNzL0BpdGVtcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYmUtb3JnY2hhcnQnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2JlLW9yZ2NoYXJ0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2JlLW9yZ2NoYXJ0LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEJFT3JnY2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xyXG4gICAgQElucHV0KCkgbm9kZXM6IElEM05vZGVbXTtcclxuICAgIEBJbnB1dCgpIG5vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyO1xyXG5cclxuICAgIC8vI3JlZ2lvbiBDaGFydFxyXG4gICAgcHJvdGVjdGVkIF9jaGFydDogRDNPcmdDaGFydDtcclxuICAgIGdldCBjaGFydCgpOiBEM09yZ0NoYXJ0IHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCFtZS5fY2hhcnQpIHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogSUQzT3JnQ2hhcnRPcHRpb25zID0ge307XHJcbiAgICAgICAgICAgIC8vIGFkZGluZyBub2RlcyBpZiBkZWZpbmVkXHJcbiAgICAgICAgICAgIGlmIChtZS5ub2Rlcykgb3B0aW9ucy5kYXRhID0gbWUubm9kZXM7XHJcbiAgICAgICAgICAgIC8vIGFkZGluZyBub2RlIHBhcnNlciBpZiBkZWZpbmVkXHJcbiAgICAgICAgICAgIGlmIChtZS5ub2RlUGFyc2VyKSBvcHRpb25zLm5vZGVQYXJzZXIgPSBtZS5ub2RlUGFyc2VyO1xyXG5cclxuICAgICAgICAgICAgbWUuX2NoYXJ0ID0gbmV3IEQzT3JnQ2hhcnQodGhpcy5wckVsLm5hdGl2ZUVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG1lLl9jaGFydDtcclxuICAgIH1cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBwckVsOiBFbGVtZW50UmVmKSB7IH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KClcclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBkZXRlY3RpbmcgY2hhbmdlcyBvZiBpbnB1dFxyXG4gICAgICAgIGlmIChjaGFuZ2VzLm5vZGVQYXJzZXIgJiYgY2hhbmdlcy5ub2RlUGFyc2VyLmN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICAgICAgICBtZS5hc3NpZ25Ob2RlUGFyc2VyKGNoYW5nZXMubm9kZVBhcnNlci5jdXJyZW50VmFsdWUpO1xyXG4gICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFuZ2VzLm5vZGVzICYmIGNoYW5nZXMubm9kZXMuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1lLmFzc2lnbkRhdGEoY2hhbmdlcy5ub2Rlcy5jdXJyZW50VmFsdWUgYXMgSUQzTm9kZVtdKTtcclxuICAgICAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICAvLyBpbml0IHRoZSBjYW52YXNcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIC8vIHNldHRpbmcgZGF0YVxyXG4gICAgICAgIG1lLmNoYXJ0Lm9uTm9kZUNsaWNrLnN1YnNjcmliZShcclxuICAgICAgICAgICAgKGRhdGE6IHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZDogJywgZGF0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25EYXRhKGRhdGE6IElEM05vZGVbXSB8IElEM05vZGUsIGNsZWFyOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIC8vIGlmIGlzbsK0dCBhcnJheSB3ZSBjb252ZXJ0IGl0IGluIGFycmF5XHJcbiAgICAgICAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkgZGF0YSA9IFtkYXRhXTtcclxuICAgICAgICBpZiAoY2xlYXIpIHtcclxuICAgICAgICAgICAgY2hhcnQuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcHVzaGluZyBkYXRhXHJcbiAgICAgICAgY2hhcnQuZGF0YSA9IFsuLi5jaGFydC5kYXRhLCAuLi5kYXRhXTtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25Ob2RlUGFyc2VyKHByUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcikge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIGNoYXJ0Lm5vZGVQYXJzZXIgPSBwclBhcnNlcjtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8jcmVnaW9uIFBhcmEgRWxpbWluYXJcclxuICAgIC8vIHh4eGluaXQoKSB7XHJcbiAgICAvLyAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgLy8gICAgIC8vIE9idGVuZW1vcyBsYSBpbmZvXHJcbiAgICAvLyAgICAgZDNcclxuICAgIC8vICAgICAgICAgLmpzb24oJ2h0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vYnVtYmVpc2h2aWxpL2RjMGQ0N2JjOTVlZjM1OWZkYzc1YjYzY2Q2NWVkYWYyL3Jhdy9jMzNhM2ExZWY0YmE5MjdlM2U5MmI4MTYwMGM4YzZhZGEzNDVjNjRiL29yZ0NoYXJ0Lmpzb24nKVxyXG4gICAgLy8gICAgICAgICAudGhlbigoZGF0YTogSUQzTm9kZVtdKSA9PiB7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgLy8gZGF0YS5mb3JFYWNoKGN1cnJlbnQgPT4geyBjdXJyZW50LmV4cGFuZGVkID0gdHJ1ZTsgfSlcclxuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBZGRpbmcgZGF0YTogJylcclxuICAgIC8vICAgICAgICAgICAgIG1lLmNoYXJ0ID0gbmV3IEQzT3JnQ2hhcnQodGhpcy5wckVsLm5hdGl2ZUVsZW1lbnQsIGRhdGEpO1xyXG4gICAgLy8gICAgICAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcblxyXG4gICAgLy8gICAgICAgICAgICAgbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIChkYXRhOiB7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfSkgPT4ge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZDogJywgZGF0YSlcclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICApXHJcbiAgICAvLyAgICAgICAgIH0pO1xyXG5cclxuICAgIC8vICAgICAvLyBtZS5jaGFydCA9IG5ldyBEM09yZ0NoYXJ0KHRoaXMucHJFbC5uYXRpdmVFbGVtZW50KTtcclxuICAgIC8vICAgICAvLyBtZS5jaGFydC5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyAgICAgLy8gbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgLy8gICAgIC8vICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgIC8vICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkOiAnLCBkYXRhKVxyXG4gICAgLy8gICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgLy8gKVxyXG4gICAgLy8gfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiIsIjxkaXYgI29yZ2NoYXJ0IGNsYXNzPVwiY29udGFpbmVyXCI+PC9kaXY+XHJcblxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZT5cclxuICA8c3ZnIGhlaWdodD1cIjQwMFwiIHdpZHRoPVwiNDUwXCI+XHJcbiAgICA8cGF0aCBpZD1cImxpbmVBQlwiIGQ9XCJNIDEwMCAzNTAgbCAxNTAgLTMwMFwiIHN0cm9rZT1cInJlZFwiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGlkPVwibGluZUJDXCIgZD1cIk0gMjUwIDUwIGwgMTUwIDMwMFwiIHN0cm9rZT1cInJlZFwiIHN0cm9rZS13aWR0aD1cIjNcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNIDE3NSAyMDAgbCAxNTAgMFwiIHN0cm9rZT1cImdyZWVuXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGggZD1cIk0gMTAwIDM1MCBxIDE1MCAtMzAwIDMwMCAwXCIgc3Ryb2tlPVwiYmx1ZVwiIHN0cm9rZS13aWR0aD1cIjVcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDwhLS0gTWFyayByZWxldmFudCBwb2ludHMgLS0+XHJcbiAgICAgIDxnIHN0cm9rZT1cImJsYWNrXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIGZpbGw9XCJibGFja1wiPiBcclxuICAgICAgICA8Y2lyY2xlIGlkPVwicG9pbnRBXCIgY3g9XCIxMDBcIiBjeT1cIjM1MFwiIHI9XCIzXCIgLz5cclxuICAgICAgICA8Y2lyY2xlIGlkPVwicG9pbnRCXCIgY3g9XCIyNTBcIiBjeT1cIjUwXCIgcj1cIjNcIiAvPlxyXG4gICAgICAgIDxjaXJjbGUgaWQ9XCJwb2ludENcIiBjeD1cIjQwMFwiIGN5PVwiMzUwXCIgcj1cIjNcIiAvPlxyXG4gICAgICA8L2c+XHJcbiAgICAgIDwhLS0gTGFiZWwgdGhlIHBvaW50cyAtLT5cclxuICAgICAgPGcgZm9udC1zaXplPVwiMzBcIiBmb250LWZhbWlseT1cInNhbnMtc2VyaWZcIiBmaWxsPVwiYmxhY2tcIiBzdHJva2U9XCJub25lXCIgdGV4dC1hbmNob3I9XCJtaWRkbGVcIj5cclxuICAgICAgICA8dGV4dCB4PVwiMTAwXCIgeT1cIjM1MFwiIGR4PVwiLTMwXCI+QTwvdGV4dD5cclxuICAgICAgICA8dGV4dCB4PVwiMjUwXCIgeT1cIjUwXCIgZHk9XCItMTBcIj5CPC90ZXh0PlxyXG4gICAgICAgIDx0ZXh0IHg9XCI0MDBcIiB5PVwiMzUwXCIgZHg9XCIzMFwiPkM8L3RleHQ+XHJcbiAgICAgIDwvZz5cclxuICAgIDwvc3ZnPlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlICNub2RlVGVtcGxhdGU+XHJcbiAgPGRpdj5cclxuICAgIDxwPiQkdGl0bGU8L3A+XHJcbiAgICA8cD4kJGlkPC9wPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPiAiXX0=