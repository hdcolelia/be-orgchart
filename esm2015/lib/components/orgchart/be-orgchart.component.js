import { __decorate } from "tslib";
import { Component, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
let BEOrgchartComponent = class BEOrgchartComponent {
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
BEOrgchartComponent.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], BEOrgchartComponent.prototype, "nodes", void 0);
__decorate([
    Input()
], BEOrgchartComponent.prototype, "nodeParser", void 0);
BEOrgchartComponent = __decorate([
    Component({
        selector: 'be-orgchart',
        template: "<div #orgchart class=\"container\"></div>\r\n\r\n<ng-template #defaultTemplate>\r\n  <svg height=\"400\" width=\"450\">\r\n    <path id=\"lineAB\" d=\"M 100 350 l 150 -300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path id=\"lineBC\" d=\"M 250 50 l 150 300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 175 200 l 150 0\" stroke=\"green\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 100 350 q 150 -300 300 0\" stroke=\"blue\" stroke-width=\"5\" fill=\"none\" />\r\n      <!-- Mark relevant points -->\r\n      <g stroke=\"black\" stroke-width=\"3\" fill=\"black\"> \r\n        <circle id=\"pointA\" cx=\"100\" cy=\"350\" r=\"3\" />\r\n        <circle id=\"pointB\" cx=\"250\" cy=\"50\" r=\"3\" />\r\n        <circle id=\"pointC\" cx=\"400\" cy=\"350\" r=\"3\" />\r\n      </g>\r\n      <!-- Label the points -->\r\n      <g font-size=\"30\" font-family=\"sans-serif\" fill=\"black\" stroke=\"none\" text-anchor=\"middle\">\r\n        <text x=\"100\" y=\"350\" dx=\"-30\">A</text>\r\n        <text x=\"250\" y=\"50\" dy=\"-10\">B</text>\r\n        <text x=\"400\" y=\"350\" dx=\"30\">C</text>\r\n      </g>\r\n    </svg>\r\n</ng-template>\r\n\r\n<ng-template #nodeTemplate>\r\n  <div>\r\n    <p>$$title</p>\r\n    <p>$$id</p>\r\n  </div>\r\n</ng-template> ",
        styles: [":host{display:flex;flex-direction:column;overflow:hidden}image.rounded{border-radius:50%;border-color:#00f;border-width:2px}"]
    })
], BEOrgchartComponent);
export { BEOrgchartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1vcmdjaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQUUsVUFBVSxFQUFzQixNQUFNLGtDQUFrQyxDQUFDO0FBU2xGLElBQWEsbUJBQW1CLEdBQWhDLE1BQWEsbUJBQW1CO0lBbUI1QixZQUFZO0lBRVosWUFBc0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7SUFmM0MsSUFBSSxLQUFLO1FBQ0wsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO1lBQ1osTUFBTSxPQUFPLEdBQXVCLEVBQUUsQ0FBQztZQUN2QywwQkFBMEI7WUFDMUIsSUFBSSxFQUFFLENBQUMsS0FBSztnQkFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDdEMsZ0NBQWdDO1lBQ2hDLElBQUksRUFBRSxDQUFDLFVBQVU7Z0JBQUUsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBRXRELEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDaEU7UUFBQSxDQUFDO1FBQ0YsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFLRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFaEIsNkJBQTZCO1FBQzdCLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtZQUN2RCxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQzdDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUF5QixDQUFDLENBQUM7WUFDdkQsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtJQUVMLENBQUM7SUFFRCxJQUFJO1FBQ0EsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLGtCQUFrQjtRQUNsQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMseUNBQXlDO1FBQ2pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsZUFBZTtRQUNmLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDMUIsQ0FBQyxJQUFtQyxFQUFFLEVBQUU7WUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDbEMsQ0FBQyxDQUNKLENBQUE7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLElBQXlCLEVBQUUsUUFBaUIsSUFBSTtRQUN2RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLHlDQUF5QztRQUNqRSx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQztZQUFFLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksS0FBSyxFQUFFO1lBQ1AsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsT0FBTztTQUNWO1FBQ0QsZUFBZTtRQUNmLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFFBQTJCO1FBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMseUNBQXlDO1FBQ2pFLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzVCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0NBb0NKLENBQUE7O1lBMUYrQixVQUFVOztBQXBCN0I7SUFBUixLQUFLLEVBQUU7a0RBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFO3VEQUErQjtBQUY5QixtQkFBbUI7SUFML0IsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGFBQWE7UUFDdkIsK3lDQUEyQzs7S0FFOUMsQ0FBQztHQUNXLG1CQUFtQixDQStHL0I7U0EvR1ksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEQzT3JnQ2hhcnQsIElEM09yZ0NoYXJ0T3B0aW9ucyB9IGZyb20gJy4uLy4uL2NsYXNlc3MvZDMtb3JnLWNoYXJ0LmNsYXNzJztcclxuaW1wb3J0IHsgSUQzTm9kZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBEM05vZGVCYXNpY1BhcnNlciB9IGZyb20gJy4uLy4uL2NsYXNlc3MvQGl0ZW1zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdiZS1vcmdjaGFydCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYmUtb3JnY2hhcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vYmUtb3JnY2hhcnQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQkVPcmdjaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XHJcbiAgICBASW5wdXQoKSBub2RlczogSUQzTm9kZVtdO1xyXG4gICAgQElucHV0KCkgbm9kZVBhcnNlcjogRDNOb2RlQmFzaWNQYXJzZXI7XHJcblxyXG4gICAgLy8jcmVnaW9uIENoYXJ0XHJcbiAgICBwcm90ZWN0ZWQgX2NoYXJ0OiBEM09yZ0NoYXJ0O1xyXG4gICAgZ2V0IGNoYXJ0KCk6IEQzT3JnQ2hhcnQge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBpZiAoIW1lLl9jaGFydCkge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiBJRDNPcmdDaGFydE9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgLy8gYWRkaW5nIG5vZGVzIGlmIGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKG1lLm5vZGVzKSBvcHRpb25zLmRhdGEgPSBtZS5ub2RlcztcclxuICAgICAgICAgICAgLy8gYWRkaW5nIG5vZGUgcGFyc2VyIGlmIGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKG1lLm5vZGVQYXJzZXIpIG9wdGlvbnMubm9kZVBhcnNlciA9IG1lLm5vZGVQYXJzZXI7XHJcblxyXG4gICAgICAgICAgICBtZS5fY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbWUuX2NoYXJ0O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHByRWw6IEVsZW1lbnRSZWYpIHsgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGRldGVjdGluZyBjaGFuZ2VzIG9mIGlucHV0XHJcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZVBhcnNlciAmJiBjaGFuZ2VzLm5vZGVQYXJzZXIuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1lLmFzc2lnbk5vZGVQYXJzZXIoY2hhbmdlcy5ub2RlUGFyc2VyLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZXMgJiYgY2hhbmdlcy5ub2Rlcy5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgbWUuYXNzaWduRGF0YShjaGFuZ2VzLm5vZGVzLmN1cnJlbnRWYWx1ZSBhcyBJRDNOb2RlW10pO1xyXG4gICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIC8vIGluaXQgdGhlIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgLy8gc2V0dGluZyBkYXRhXHJcbiAgICAgICAgbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkOiAnLCBkYXRhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbkRhdGEoZGF0YTogSUQzTm9kZVtdIHwgSUQzTm9kZSwgY2xlYXI6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgLy8gaWYgaXNuwrR0IGFycmF5IHdlIGNvbnZlcnQgaXQgaW4gYXJyYXlcclxuICAgICAgICBpZiAoIShkYXRhIGluc3RhbmNlb2YgQXJyYXkpKSBkYXRhID0gW2RhdGFdO1xyXG4gICAgICAgIGlmIChjbGVhcikge1xyXG4gICAgICAgICAgICBjaGFydC5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwdXNoaW5nIGRhdGFcclxuICAgICAgICBjaGFydC5kYXRhID0gWy4uLmNoYXJ0LmRhdGEsIC4uLmRhdGFdO1xyXG4gICAgICAgIGNoYXJ0LnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbk5vZGVQYXJzZXIocHJQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgY2hhcnQubm9kZVBhcnNlciA9IHByUGFyc2VyO1xyXG4gICAgICAgIGNoYXJ0LnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyNyZWdpb24gUGFyYSBFbGltaW5hclxyXG4gICAgLy8geHh4aW5pdCgpIHtcclxuICAgIC8vICAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICAvLyAgICAgLy8gT2J0ZW5lbW9zIGxhIGluZm9cclxuICAgIC8vICAgICBkM1xyXG4gICAgLy8gICAgICAgICAuanNvbignaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9idW1iZWlzaHZpbGkvZGMwZDQ3YmM5NWVmMzU5ZmRjNzViNjNjZDY1ZWRhZjIvcmF3L2MzM2EzYTFlZjRiYTkyN2UzZTkyYjgxNjAwYzhjNmFkYTM0NWM2NGIvb3JnQ2hhcnQuanNvbicpXHJcbiAgICAvLyAgICAgICAgIC50aGVuKChkYXRhOiBJRDNOb2RlW10pID0+IHtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBkYXRhLmZvckVhY2goY3VycmVudCA9PiB7IGN1cnJlbnQuZXhwYW5kZWQgPSB0cnVlOyB9KVxyXG4gICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZGluZyBkYXRhOiAnKVxyXG4gICAgLy8gICAgICAgICAgICAgbWUuY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCwgZGF0YSk7XHJcbiAgICAvLyAgICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuXHJcbiAgICAvLyAgICAgICAgICAgICBtZS5jaGFydC5vbk5vZGVDbGljay5zdWJzY3JpYmUoXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgKGRhdGE6IHsgaWQ6IHN0cmluZywgbm9kZTogSUQzTm9kZSB9KSA9PiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkOiAnLCBkYXRhKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIClcclxuICAgIC8vICAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIC8vIG1lLmNoYXJ0ID0gbmV3IEQzT3JnQ2hhcnQodGhpcy5wckVsLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgLy8gICAgIC8vIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG5cclxuICAgIC8vICAgICAvLyBtZS5jaGFydC5vbk5vZGVDbGljay5zdWJzY3JpYmUoXHJcbiAgICAvLyAgICAgLy8gICAgIChkYXRhOiB7IGlkOiBzdHJpbmcsIG5vZGU6IElEM05vZGUgfSkgPT4ge1xyXG4gICAgLy8gICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ0NsaWNrZWQ6ICcsIGRhdGEpXHJcbiAgICAvLyAgICAgLy8gICAgIH1cclxuICAgIC8vICAgICAvLyApXHJcbiAgICAvLyB9XHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcblxyXG5cclxufVxyXG5cclxuIl19