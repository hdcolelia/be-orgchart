import { __decorate, __read, __spread } from "tslib";
import { Component, ElementRef, AfterViewInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { D3OrgChart } from '../../clasess/d3-org-chart.class';
var BEOrgchartComponent = /** @class */ (function () {
    //#endregion
    function BEOrgchartComponent(prEl) {
        this.prEl = prEl;
        this.onNodeClick = new EventEmitter();
    }
    Object.defineProperty(BEOrgchartComponent.prototype, "chart", {
        get: function () {
            var me = this;
            if (!me._chart) {
                var options = {};
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
        },
        enumerable: true,
        configurable: true
    });
    BEOrgchartComponent.prototype.ngAfterViewInit = function () {
        this.init();
    };
    BEOrgchartComponent.prototype.ngOnChanges = function (changes) {
        var me = this;
        // detecting changes of input
        if (changes.nodeParser && changes.nodeParser.currentValue) {
            me.assignNodeParser(changes.nodeParser.currentValue);
            me.chart.render();
        }
        if (changes.nodes && changes.nodes.currentValue) {
            me.assignData(changes.nodes.currentValue);
            me.chart.render();
        }
    };
    BEOrgchartComponent.prototype.init = function () {
        var me = this;
        // init the canvas
        var chart = me.chart; // Must be like this to ensure chart init
        me.chart.render();
        // setting data
        me.chart.onNodeClick.subscribe(function (data) {
            me.onNodeClick.next(data.node);
        });
    };
    BEOrgchartComponent.prototype.assignData = function (data, clear) {
        if (clear === void 0) { clear = true; }
        var me = this;
        var chart = me.chart; // Must be like this to ensure chart init
        // if isn´t array we convert it in array
        if (!(data instanceof Array))
            data = [data];
        if (clear) {
            chart.data = data;
            return;
        }
        // pushing data
        chart.data = __spread(chart.data, data);
        chart.render();
    };
    BEOrgchartComponent.prototype.assignNodeParser = function (prParser) {
        var me = this;
        var chart = me.chart; // Must be like this to ensure chart init
        chart.nodeParser = prParser;
        chart.render();
    };
    BEOrgchartComponent.prototype.assignOptions = function (prOptions) {
        var me = this;
        me.chart.setOptions(prOptions);
    };
    BEOrgchartComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], BEOrgchartComponent.prototype, "nodes", void 0);
    __decorate([
        Input()
    ], BEOrgchartComponent.prototype, "nodeParser", void 0);
    __decorate([
        Input()
    ], BEOrgchartComponent.prototype, "options", void 0);
    __decorate([
        Output()
    ], BEOrgchartComponent.prototype, "onNodeClick", void 0);
    BEOrgchartComponent = __decorate([
        Component({
            selector: 'be-orgchart',
            template: "<div #orgchart class=\"container\"></div>\r\n\r\n<ng-template #defaultTemplate>\r\n  <svg height=\"400\" width=\"450\">\r\n    <path id=\"lineAB\" d=\"M 100 350 l 150 -300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path id=\"lineBC\" d=\"M 250 50 l 150 300\" stroke=\"red\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 175 200 l 150 0\" stroke=\"green\" stroke-width=\"3\" fill=\"none\" />\r\n      <path d=\"M 100 350 q 150 -300 300 0\" stroke=\"blue\" stroke-width=\"5\" fill=\"none\" />\r\n      <!-- Mark relevant points -->\r\n      <g stroke=\"black\" stroke-width=\"3\" fill=\"black\"> \r\n        <circle id=\"pointA\" cx=\"100\" cy=\"350\" r=\"3\" />\r\n        <circle id=\"pointB\" cx=\"250\" cy=\"50\" r=\"3\" />\r\n        <circle id=\"pointC\" cx=\"400\" cy=\"350\" r=\"3\" />\r\n      </g>\r\n      <!-- Label the points -->\r\n      <g font-size=\"30\" font-family=\"sans-serif\" fill=\"black\" stroke=\"none\" text-anchor=\"middle\">\r\n        <text x=\"100\" y=\"350\" dx=\"-30\">A</text>\r\n        <text x=\"250\" y=\"50\" dy=\"-10\">B</text>\r\n        <text x=\"400\" y=\"350\" dx=\"30\">C</text>\r\n      </g>\r\n    </svg>\r\n</ng-template>\r\n\r\n<ng-template #nodeTemplate>\r\n  <div>\r\n    <p>$$title</p>\r\n    <p>$$id</p>\r\n  </div>\r\n</ng-template> ",
            styles: [":host{display:flex;flex-direction:column;overflow:hidden}image.rounded{border-radius:50%;border-color:#00f;border-width:2px}"]
        })
    ], BEOrgchartComponent);
    return BEOrgchartComponent;
}());
export { BEOrgchartComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmUtb3JnY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYmUtb3JnY2hhcnQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vcmdjaGFydC9iZS1vcmdjaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVILE9BQU8sRUFBRSxVQUFVLEVBQXNCLE1BQU0sa0NBQWtDLENBQUM7QUFTbEY7SUFxQkksWUFBWTtJQUVaLDZCQUFzQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBbkI1QixnQkFBVyxHQUEwQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBbUJ4QixDQUFDO0lBZjNDLHNCQUFJLHNDQUFLO2FBQVQ7WUFDSSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUU7Z0JBQ1osSUFBTSxPQUFPLEdBQXVCLEVBQUUsQ0FBQztnQkFDdkMsMEJBQTBCO2dCQUMxQixJQUFJLEVBQUUsQ0FBQyxLQUFLO29CQUFFLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDdEMsZ0NBQWdDO2dCQUNoQyxJQUFJLEVBQUUsQ0FBQyxVQUFVO29CQUFFLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFFdEQsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNoRTtZQUFBLENBQUM7WUFDRixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFLRCw2Q0FBZSxHQUFmO1FBQ0ks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LCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT3V0cHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEM09yZ0NoYXJ0LCBJRDNPcmdDaGFydE9wdGlvbnMgfSBmcm9tICcuLi8uLi9jbGFzZXNzL2QzLW9yZy1jaGFydC5jbGFzcyc7XHJcbmltcG9ydCB7IElEM05vZGUgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgRDNOb2RlQmFzaWNQYXJzZXIgfSBmcm9tICcuLi8uLi9jbGFzZXNzL0BpdGVtcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYmUtb3JnY2hhcnQnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2JlLW9yZ2NoYXJ0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2JlLW9yZ2NoYXJ0LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEJFT3JnY2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xyXG4gICAgQElucHV0KCkgbm9kZXM6IElEM05vZGVbXTtcclxuICAgIEBJbnB1dCgpIG5vZGVQYXJzZXI6IEQzTm9kZUJhc2ljUGFyc2VyO1xyXG4gICAgQElucHV0KCkgb3B0aW9uczogSUQzT3JnQ2hhcnRPcHRpb25zO1xyXG4gICAgQE91dHB1dCgpIG9uTm9kZUNsaWNrOiBFdmVudEVtaXR0ZXI8SUQzTm9kZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgLy8jcmVnaW9uIENoYXJ0XHJcbiAgICBwcm90ZWN0ZWQgX2NoYXJ0OiBEM09yZ0NoYXJ0O1xyXG4gICAgZ2V0IGNoYXJ0KCk6IEQzT3JnQ2hhcnQge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBpZiAoIW1lLl9jaGFydCkge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiBJRDNPcmdDaGFydE9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgLy8gYWRkaW5nIG5vZGVzIGlmIGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKG1lLm5vZGVzKSBvcHRpb25zLmRhdGEgPSBtZS5ub2RlcztcclxuICAgICAgICAgICAgLy8gYWRkaW5nIG5vZGUgcGFyc2VyIGlmIGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKG1lLm5vZGVQYXJzZXIpIG9wdGlvbnMubm9kZVBhcnNlciA9IG1lLm5vZGVQYXJzZXI7XHJcblxyXG4gICAgICAgICAgICBtZS5fY2hhcnQgPSBuZXcgRDNPcmdDaGFydCh0aGlzLnByRWwubmF0aXZlRWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbWUuX2NoYXJ0O1xyXG4gICAgfVxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHByRWw6IEVsZW1lbnRSZWYpIHsgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGRldGVjdGluZyBjaGFuZ2VzIG9mIGlucHV0XHJcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZVBhcnNlciAmJiBjaGFuZ2VzLm5vZGVQYXJzZXIuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1lLmFzc2lnbk5vZGVQYXJzZXIoY2hhbmdlcy5ub2RlUGFyc2VyLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgICAgIG1lLmNoYXJ0LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNoYW5nZXMubm9kZXMgJiYgY2hhbmdlcy5ub2Rlcy5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgbWUuYXNzaWduRGF0YShjaGFuZ2VzLm5vZGVzLmN1cnJlbnRWYWx1ZSBhcyBJRDNOb2RlW10pO1xyXG4gICAgICAgICAgICBtZS5jaGFydC5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIC8vIGluaXQgdGhlIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gbWUuY2hhcnQ7IC8vIE11c3QgYmUgbGlrZSB0aGlzIHRvIGVuc3VyZSBjaGFydCBpbml0XHJcbiAgICAgICAgbWUuY2hhcnQucmVuZGVyKCk7XHJcbiAgICAgICAgLy8gc2V0dGluZyBkYXRhXHJcbiAgICAgICAgbWUuY2hhcnQub25Ob2RlQ2xpY2suc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICAoZGF0YTogeyBpZDogc3RyaW5nLCBub2RlOiBJRDNOb2RlIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIG1lLm9uTm9kZUNsaWNrLm5leHQoZGF0YS5ub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25EYXRhKGRhdGE6IElEM05vZGVbXSB8IElEM05vZGUsIGNsZWFyOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIC8vIGlmIGlzbsK0dCBhcnJheSB3ZSBjb252ZXJ0IGl0IGluIGFycmF5XHJcbiAgICAgICAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkgZGF0YSA9IFtkYXRhXTtcclxuICAgICAgICBpZiAoY2xlYXIpIHtcclxuICAgICAgICAgICAgY2hhcnQuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcHVzaGluZyBkYXRhXHJcbiAgICAgICAgY2hhcnQuZGF0YSA9IFsuLi5jaGFydC5kYXRhLCAuLi5kYXRhXTtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25Ob2RlUGFyc2VyKHByUGFyc2VyOiBEM05vZGVCYXNpY1BhcnNlcikge1xyXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgICAgICBjb25zdCBjaGFydCA9IG1lLmNoYXJ0OyAvLyBNdXN0IGJlIGxpa2UgdGhpcyB0byBlbnN1cmUgY2hhcnQgaW5pdFxyXG4gICAgICAgIGNoYXJ0Lm5vZGVQYXJzZXIgPSBwclBhcnNlcjtcclxuICAgICAgICBjaGFydC5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25PcHRpb25zKHByT3B0aW9uczogUGFydGlhbDxJRDNPcmdDaGFydE9wdGlvbnM+KSB7XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIG1lLmNoYXJ0LnNldE9wdGlvbnMocHJPcHRpb25zKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiJdfQ==