// getting base64 icons
import { expandBase64Data } from './../../../assets/icons/expand.base64';
import { collapseBase64Data } from './../../../assets/icons/collapse.base64';
import { errorBase64Data } from './../../../assets/icons/error.base64';
export class D3NodeBasicParser {
    constructor() {
        // dimensions
        this.width = 220;
        this.height = 80;
        // expand / colapse icons
        this.expandBase64Icon = expandBase64Data;
        this.collapseBase64Icon = collapseBase64Data;
        // error icon
        this.errorBase64Icon = errorBase64Data;
        this.imageDefs = {
            x: -20, y: -15, h: 60, w: 60, rx: 6
        };
        this.transitionDuration = 500;
    }
    addImage() {
    }
    drawNodes(prGroup) {
        const me = this;
        prGroup.each((d, i) => me.drawNode(d, i, prGroup));
    }
    drawNode(prData, prIndex, node) {
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
        if (prData.data.nodeImage) {
            const defs = node.append('defs').append('pattern')
                .attr('id', d => `img-${d.data.nodeId}`)
                .attr('width', 1)
                .attr('height', 1);
            let linkRef = '';
            if (prData.data.nodeImage.url)
                linkRef = prData.data.nodeImage.url;
            if (prData.data.nodeImage.icon)
                linkRef = prData.data.nodeImage.icon;
            if (prData.data.nodeImage.base64)
                linkRef = `data:image/png;base64,${prData.data.nodeImage.base64}`;
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
    xxxdrawNodes(prGroup) {
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
    updateNodes(prGroup, prNodes) {
        prGroup.select('rect.node-rect').attr('fill', 'black');
        //  .each(d => {
        //    console.log('argument: ', d);
        //  })
        //.data(prNodes).select('rect.node-rect')
        //.attr('x', d => d.x)
        //.attr('y', d => d.y);
        // console.log('Updateing...:', prGroup)
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1iYXNpYy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BiZS9vcmdjaGFydC8iLCJzb3VyY2VzIjpbImxpYi9jbGFzZXNzL0BpdGVtcy9iYXNpYy9ub2RlLWJhc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLHVCQUF1QjtBQUN2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFHdkUsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QjtRQUNBLGFBQWE7UUFDYixVQUFLLEdBQVcsR0FBRyxDQUFDO1FBQ3BCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFFcEIseUJBQXlCO1FBQ3pCLHFCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3BDLHVCQUFrQixHQUFHLGtCQUFrQixDQUFDO1FBRXhDLGFBQWE7UUFDYixvQkFBZSxHQUFHLGVBQWUsQ0FBQztRQUVsQyxjQUFTLEdBQStEO1lBQ3RFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQ3BDLENBQUE7UUFFRCx1QkFBa0IsR0FBVyxHQUFHLENBQUM7SUFoQmpCLENBQUM7SUFrQlAsUUFBUTtJQUVsQixDQUFDO0lBRUQsU0FBUyxDQUNQLE9BQTRFO1FBRTVFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFzQyxFQUFF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Q0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO2FBQzlDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQzthQUNqRCxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO2FBQzlDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV2QyxlQUFlO1FBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUMzQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVyRCxxQkFBcUI7UUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNqRCxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVyRCxlQUFlO1FBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQzthQUMvQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO2FBQzFCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUM7YUFDcEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELFdBQVc7SUFFYixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQWlELEVBQUUsT0FBeUM7UUFDdEcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdEQsZ0JBQWdCO1FBQ2hCLG1DQUFtQztRQUNuQyxNQUFNO1FBRU4seUNBQXlDO1FBQ3pDLHNCQUFzQjtRQUN0Qix1QkFBdUI7UUFDdkIsd0NBQXdDO0lBQzFDLENBQUM7Q0FFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcclxuaW1wb3J0IHsgSUQzTm9kZSB9IGZyb20gJy4vLi4vLi4vLi4vaW50ZXJmYWNlcyc7XHJcblxyXG4vLyBnZXR0aW5nIGJhc2U2NCBpY29uc1xyXG5pbXBvcnQgeyBleHBhbmRCYXNlNjREYXRhIH0gZnJvbSAnLi8uLi8uLi8uLi9hc3NldHMvaWNvbnMvZXhwYW5kLmJhc2U2NCc7XHJcbmltcG9ydCB7IGNvbGxhcHNlQmFzZTY0RGF0YSB9IGZyb20gJy4vLi4vLi4vLi4vYXNzZXRzL2ljb25zL2NvbGxhcHNlLmJhc2U2NCc7XHJcbmltcG9ydCB7IGVycm9yQmFzZTY0RGF0YSB9IGZyb20gJy4vLi4vLi4vLi4vYXNzZXRzL2ljb25zL2Vycm9yLmJhc2U2NCc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEQzTm9kZUJhc2ljUGFyc2VyIHtcclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gIC8vIGRpbWVuc2lvbnNcclxuICB3aWR0aDogbnVtYmVyID0gMjIwO1xyXG4gIGhlaWdodDogbnVtYmVyID0gODA7XHJcblxyXG4gIC8vIGV4cGFuZCAvIGNvbGFwc2UgaWNvbnNcclxuICBleHBhbmRCYXNlNjRJY29uID0gZXhwYW5kQmFzZTY0RGF0YTtcclxuICBjb2xsYXBzZUJhc2U2NEljb24gPSBjb2xsYXBzZUJhc2U2NERhdGE7XHJcblxyXG4gIC8vIGVycm9yIGljb25cclxuICBlcnJvckJhc2U2NEljb24gPSBlcnJvckJhc2U2NERhdGE7XHJcblxyXG4gIGltYWdlRGVmczogeyB4OiBudW1iZXIsIHk6IG51bWJlciwgaDogbnVtYmVyLCB3OiBudW1iZXIsIHJ4OiBudW1iZXIgfSA9IHtcclxuICAgIHg6IC0yMCwgeTogLTE1LCBoOiA2MCwgdzogNjAsIHJ4OiA2XHJcbiAgfVxyXG5cclxuICB0cmFuc2l0aW9uRHVyYXRpb246IG51bWJlciA9IDUwMDtcclxuXHJcbiAgcHJvdGVjdGVkIGFkZEltYWdlKCkge1xyXG5cclxuICB9XHJcblxyXG4gIGRyYXdOb2RlcyhcclxuICAgIHByR3JvdXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgZDMuSGllcmFyY2h5UG9pbnROb2RlPElEM05vZGU+LCBhbnksIGFueT5cclxuICApIHtcclxuICAgIGNvbnN0IG1lID0gdGhpcztcclxuICAgIHByR3JvdXAuZWFjaCgoZCwgaSkgPT4gbWUuZHJhd05vZGUoZCwgaSwgcHJHcm91cCkpO1xyXG4gIH1cclxuXHJcbiAgZHJhd05vZGUocHJEYXRhOiBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4sIHBySW5kZXg6IG51bWJlciwgbm9kZTogZDMuU2VsZWN0aW9uPFNWR0dFbGVtZW50LCBkMy5IaWVyYXJjaHlQb2ludE5vZGU8SUQzTm9kZT4sIGFueSwgYW55Pikge1xyXG4gICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgXHJcbiAgICAvLyBhZGRpbmcgcmVjdFxyXG4gICAgbm9kZS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICdub2RlLXJlY3QnKVxyXG4gICAgICAuYXR0cignd2lkdGgnLCBtZS53aWR0aCkuYXR0cignaGVpZ2h0JywgbWUuaGVpZ2h0KVxyXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ2JsdWUnKS5hdHRyKCdzdHJva2Utd2lkdGgnLCAxKVxyXG4gICAgICAuYXR0cignZmlsbCcsICcjMDJCMkFDJykuYXR0cigncngnLCAxMik7XHJcblxyXG4gICAgLy8gYWRkaW5nIHRpdGxlXHJcbiAgICBub2RlLmFwcGVuZCgndGV4dCcpLnRleHQoZCA9PiBkLmRhdGEudGl0bGUpXHJcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAxNSkuYXR0cigneCcsIDUwKS5hdHRyKCd5JywgMjUpO1xyXG5cclxuICAgIC8vIGFkZGluZyBkZXNjcmlwdGlvblxyXG4gICAgbm9kZS5hcHBlbmQoJ3RleHQnKS50ZXh0KGQgPT4gZC5kYXRhLmRlc2NyaXB0aW9uKVxyXG4gICAgICAuYXR0cignZm9udC1zaXplJywgMTApLmF0dHIoJ3gnLCA1MCkuYXR0cigneScsIDQ1KTtcclxuICAgIC8vIHByR3JvdXAuXHJcblxyXG5cclxuICAgIGlmKHByRGF0YS5kYXRhLm5vZGVJbWFnZSkge1xyXG4gICAgICBjb25zdCBkZWZzID0gbm9kZS5hcHBlbmQoJ2RlZnMnKS5hcHBlbmQoJ3BhdHRlcm4nKVxyXG4gICAgICAgIC5hdHRyKCdpZCcsIGQgPT4gYGltZy0ke2QuZGF0YS5ub2RlSWR9YClcclxuICAgICAgICAuYXR0cignd2lkdGgnLCAxKVxyXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCAxKTtcclxuICAgICAgXHJcbiAgICAgIGxldCBsaW5rUmVmOiBzdHJpbmcgPSAnJ1xyXG4gICAgICBpZihwckRhdGEuZGF0YS5ub2RlSW1hZ2UudXJsKSBsaW5rUmVmID0gcHJEYXRhLmRhdGEubm9kZUltYWdlLnVybDtcclxuICAgICAgaWYocHJEYXRhLmRhdGEubm9kZUltYWdlLmljb24pIGxpbmtSZWYgPSBwckRhdGEuZGF0YS5ub2RlSW1hZ2UuaWNvbjtcclxuICAgICAgaWYocHJEYXRhLmRhdGEubm9kZUltYWdlLmJhc2U2NCkgbGlua1JlZiA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsJHtwckRhdGEuZGF0YS5ub2RlSW1hZ2UuYmFzZTY0fWA7XHJcblxyXG4gICAgICBjb25zdCBpbWFnZSA9IGRlZnMuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBsaW5rUmVmKVxyXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIG1lLmltYWdlRGVmcy53KVxyXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBtZS5pbWFnZURlZnMuaClcclxuICAgICAgICAvLyAuYXR0cigndmlld2JveCcsICcwIDAgMTAwIDEwMCcpXHJcblxyXG4gICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pbiBzbGljZScpO1xyXG4gICAgICAvLyBhZGRpbmcgaW1hZ2VcclxuICAgICAgbm9kZS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICdub2RlLWltYWdlJylcclxuICAgICAgLmF0dHIoJ3gnLCBtZS5pbWFnZURlZnMueCkuYXR0cigneScsIG1lLmltYWdlRGVmcy55KVxyXG4gICAgICAuYXR0cignd2lkdGgnLCBtZS5pbWFnZURlZnMudykuYXR0cignaGVpZ2h0JywgbWUuaW1hZ2VEZWZzLmgpXHJcbiAgICAgIC8vIC5hdHRyKCdzdHJva2UnLCAnYmx1ZScpLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDEpXHJcbiAgICAgIC5hdHRyKCdmaWxsJywgZCA9PiBgdXJsKCNpbWctJHtkLmRhdGEubm9kZUlkfSlgKS5hdHRyKCdyeCcsIG1lLmltYWdlRGVmcy5yeCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB4eHhkcmF3Tm9kZXMoXHJcbiAgICBwckdyb3VwOiBkMy5TZWxlY3Rpb248U1ZHR0VsZW1lbnQsIGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPiwgYW55LCBhbnk+XHJcbiAgKSB7XHJcbiAgICBjb25zdCBtZSA9IHRoaXM7XHJcbiAgICBwckdyb3VwXHJcbiAgICAgIC5hcHBlbmQoJ2RlZnMnKVxyXG4gICAgICAuYXBwZW5kKCdwYXR0ZXJuJylcclxuICAgICAgLmF0dHIoJ2lkJywgZCA9PiBgaW1nLSR7ZC5kYXRhLm5vZGVJZH1gKVxyXG4gICAgICAuYXR0cignd2lkdGgnLCA3MClcclxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDcwKVxyXG4gICAgICAuYXBwZW5kKCdpbWFnZScpXHJcbiAgICAgIC5hdHRyKCd4bGluazpocmVmJywgZCA9PiBkLmRhdGEubm9kZUltYWdlLnVybClcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgNzApXHJcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCA3MCk7XHJcblxyXG4gICAgLy8gYWRkaW5nIHJlY3RcclxuICAgIHByR3JvdXAuYXBwZW5kKCdyZWN0JykuYXR0cignY2xhc3MnLCAnbm9kZS1yZWN0JylcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgbWUud2lkdGgpLmF0dHIoJ2hlaWdodCcsIG1lLmhlaWdodClcclxuICAgICAgLmF0dHIoJ3N0cm9rZScsICdibHVlJykuYXR0cignc3Ryb2tlLXdpZHRoJywgMSlcclxuICAgICAgLmF0dHIoJ2ZpbGwnLCAnZ3JheScpLmF0dHIoJ3J4JywgMTIpO1xyXG5cclxuICAgIC8vIGFkZGluZyB0aXRsZVxyXG4gICAgcHJHcm91cC5hcHBlbmQoJ3RleHQnKS50ZXh0KGQgPT4gZC5kYXRhLnRpdGxlKVxyXG4gICAgICAuYXR0cignZm9udC1zaXplJywgMTApLmF0dHIoJ3gnLCA3MCkuYXR0cigneScsIDI1KTtcclxuXHJcbiAgICAvLyBhZGRpbmcgZGVzY3JpcHRpb25cclxuICAgIHByR3JvdXAuYXBwZW5kKCd0ZXh0JykudGV4dChkID0+IGQuZGF0YS5kZXNjcmlwdGlvbilcclxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEwKS5hdHRyKCd4JywgNzApLmF0dHIoJ3knLCA0NSk7XHJcblxyXG4gICAgLy8gYWRkaW5nIGltYWdlXHJcbiAgICBwckdyb3VwLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywgJ25vZGUtaW1hZ2UnKVxyXG4gICAgICAuYXR0cigneCcsIDUpLmF0dHIoJ3knLCAxMClcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgNTApLmF0dHIoJ2hlaWdodCcsIDUwKVxyXG4gICAgICAuYXR0cignZmlsbCcsIGQgPT4gYHVybCgjaW1nLSR7ZC5kYXRhLm5vZGVJZH0pYCk7XHJcbiAgICAvLyBwckdyb3VwLlxyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZU5vZGVzKHByR3JvdXA6IGQzLlNlbGVjdGlvbjxTVkdHRWxlbWVudCwgYW55LCBhbnksIGFueT4sIHByTm9kZXM6IGQzLkhpZXJhcmNoeVBvaW50Tm9kZTxJRDNOb2RlPltdKSB7XHJcbiAgICBwckdyb3VwLnNlbGVjdCgncmVjdC5ub2RlLXJlY3QnKS5hdHRyKCdmaWxsJywgJ2JsYWNrJylcclxuICAgIC8vICAuZWFjaChkID0+IHtcclxuICAgIC8vICAgIGNvbnNvbGUubG9nKCdhcmd1bWVudDogJywgZCk7XHJcbiAgICAvLyAgfSlcclxuXHJcbiAgICAvLy5kYXRhKHByTm9kZXMpLnNlbGVjdCgncmVjdC5ub2RlLXJlY3QnKVxyXG4gICAgLy8uYXR0cigneCcsIGQgPT4gZC54KVxyXG4gICAgLy8uYXR0cigneScsIGQgPT4gZC55KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdVcGRhdGVpbmcuLi46JywgcHJHcm91cClcclxuICB9XHJcblxyXG59Il19