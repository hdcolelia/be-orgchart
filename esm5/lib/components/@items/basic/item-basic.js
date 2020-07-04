var NodeItemParser = /** @class */ (function () {
    function NodeItemParser() {
        // dimensions
        this.width = 240;
        this.height = 150;
    }
    NodeItemParser.prototype.prepareDefs = function (prSVG) {
        var me = this;
        me.defs = prSVG.append('defs');
    };
    NodeItemParser.prototype.drawNodes = function (prGroup, prNodes) {
        var me = this;
        prGroup.data(prNodes, function (d) { return d.id; })
            .append('rect')
            .attr('class', 'node-rect')
            .attr('width', me.width)
            .attr('height', me.height)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'gray');
    };
    NodeItemParser.prototype.updateNodes = function (prGroup, prNodes) {
        prGroup.select('rect.node-rect').attr('fill', 'black');
        //  .each(d => {
        //    console.log('argument: ', d);
        //  })
        //.data(prNodes).select('rect.node-rect')
        //.attr('x', d => d.x)
        //.attr('y', d => d.y);
        // console.log('Updateing...:', prGroup)
    };
    return NodeItemParser;
}());
export { NodeItemParser };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS1iYXNpYy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2JlLWQzLW9yZ2NoYXJ0LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvQGl0ZW1zL2Jhc2ljL2l0ZW0tYmFzaWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7SUFDRTtRQUVBLGFBQWE7UUFDYixVQUFLLEdBQVcsR0FBRyxDQUFDO1FBQ3BCLFdBQU0sR0FBVyxHQUFHLENBQUM7SUFKTCxDQUFDO0lBUWpCLG9DQUFXLEdBQVgsVUFBWSxLQUE4QztRQUN4RCxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxrQ0FBUyxHQUFULFVBQVUsT0FBaUQsRUFBRSxPQUF5QztRQUNwRyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFaEIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFpQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLEVBQUUsRUFBSixDQUFJLENBQUM7YUFDL0QsTUFBTSxDQUFDLE1BQU0sQ0FBQzthQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO2FBQzFCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQzthQUN2QixJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUM7YUFDekIsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7YUFDdEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7YUFDdkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsb0NBQVcsR0FBWCxVQUFZLE9BQWlELEVBQUUsT0FBeUM7UUFDdEcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdEQsZ0JBQWdCO1FBQ2hCLG1DQUFtQztRQUNuQyxNQUFNO1FBRU4seUNBQXlDO1FBQ3pDLHNCQUFzQjtRQUN0Qix1QkFBdUI7UUFDdkIsd0NBQXdDO0lBQzFDLENBQUM7SUFFSCxxQkFBQztBQUFELENBQUMsQUF2Q0QsSUF1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XHJcbmltcG9ydCB7IElEM05vZGUgfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBOb2RlSXRlbVBhcnNlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgLy8gZGltZW5zaW9uc1xyXG4gIHdpZHRoOiBudW1iZXIgPSAyNDA7XHJcbiAgaGVpZ2h0OiBudW1iZXIgPSAxNTA7XHJcblxyXG4gIGRlZnM6IGQzLlNlbGVjdGlvbjxTVkdEZWZzRWxlbWVudCwgYW55LCBhbnksIGFueT5cclxuXHJcbiAgcHJlcGFyZURlZnMocHJTVkc6IGQzLlNlbGVjdGlvbjxTVkdFbGVtZW50LCBhbnksIGFueSwgYW55Pikge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgbWUuZGVmcyA9IHByU1ZHLmFwcGVuZCgnZGVmcycpO1xyXG4gIH1cclxuXHJcbiAgZHJhd05vZGVzKHByR3JvdXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgYW55LCBhbnksIGFueT4sIHByTm9kZXM6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPltdKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcblxyXG4gICAgcHJHcm91cC5kYXRhKHByTm9kZXMsIChkOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4pID0+IGQuaWQpXHJcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAnbm9kZS1yZWN0JylcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgbWUud2lkdGgpXHJcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBtZS5oZWlnaHQpXHJcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmx1ZScpXHJcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKVxyXG4gICAgICAuYXR0cignZmlsbCcsICdncmF5Jyk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVOb2Rlcyhwckdyb3VwOiBkMy5TZWxlY3Rpb248U1ZHR0VsZW1lbnQsIGFueSwgYW55LCBhbnk+LCBwck5vZGVzOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT5bXSkge1xyXG4gICAgcHJHcm91cC5zZWxlY3QoJ3JlY3Qubm9kZS1yZWN0JykuYXR0cignZmlsbCcsICdibGFjaycpXHJcbiAgICAvLyAgLmVhY2goZCA9PiB7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZygnYXJndW1lbnQ6ICcsIGQpO1xyXG4gICAgLy8gIH0pXHJcblxyXG4gICAgLy8uZGF0YShwck5vZGVzKS5zZWxlY3QoJ3JlY3Qubm9kZS1yZWN0JylcclxuICAgIC8vLmF0dHIoJ3gnLCBkID0+IGQueClcclxuICAgIC8vLmF0dHIoJ3knLCBkID0+IGQueSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnVXBkYXRlaW5nLi4uOicsIHByR3JvdXApXHJcbiAgfVxyXG5cclxufSJdfQ==