# BeD3Orgchart

Angular component for display an Organization Chart.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Code scaffolding

Run `ng generate component component-name --project be-d3-orgchart` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project be-d3-orgchart`.
> Note: Don't forget to add `--project be-d3-orgchart` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build be-d3-orgchart` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build be-d3-orgchart`, go to the dist folder `cd dist/be-d3-orgchart` and run `npm publish`.

## Running unit tests

Run `ng test be-d3-orgchart` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Best Effort Orgchart 
Best Effort Orgchart 
Angular component for display an Organization Chart.

# Prerequisites
d3 -  for working.

# Instalation

### Install with npm
$ npm install be-d3-orgchart

# Usage
Instantiation Statement
<canvas id="canvas"></canvas>
import CanvasOrgChart from 'canvas-orgchart'

const canvas = document.getElementById('canvas')
const canvasOrgChart = new CanvasOrgChart(options)

canvasOrgChart.render(canvas, data)
Structure of Datasource
{
  name: 'father', // necessary.
  avatar: '',
  sex: 0,
  children: [ // necessary and must be an array.
    {
      name: 'self',
      avatar: '',
      sex: 0,
      children: []
    }
  ]
}
Options
Name	Type	Default	Description
width	number	auto	Canvas width.
height	number	auto	Canvas height.
scale	array	[1, 1]	Scales the canvas units by x horizontally and by y vertically.
originX	number	0	Draw chart x starting coordinates.
originY	number	0	Draw chart y starting coordinates.
padding	array	[0, 0, 0, 0]	The chart padding as css padding.
node	object		Style of the node.
node.width	number	60	Node width.
node.height	number	160	Node height.
node.spacing	array	[20, 20]	Node spacing.
node.color	string	white	Node color.
node.background	string	cornflowerblue	Node background.
node.customBackgrounds	array	[]	Customize backgrounds based on property values.
node.defaultAvatar	string	''	Node avatar.
node.customAvatar	object	null	Customize avatar based on property values.
node.nodeTemplate	array or function	[]	Custom node template.Global replacement if it's a function.
Options Example
options = {
  width: 0, // auto
  height: 0,
  scale: [1, 1],
  originX: 0,
  originY: 0,
  padding: [10, 50],
  node: {
    width: 60,
    height: 160,
    spacing: [20, 20],
    color: 'white',
    background: 'cornflowerblue',
    customBackgrounds: [
      {
        attributeName: 'sex',
        checkOwn: false,
        color: {
          0: 'cornflowerblue',
          1: 'lightcoral'
        }
      },
      {
        attributeName: 'self',
        checkOwn: true,
        color: 'black'
      }
    ],
    defaultAvatar: '/images/male.jpg',
    customAvatar: {
      attributeName: 'sex',
      avatars: {
        0: '/images/male.jpg',
        1: '/images/female.jpg'
      }
    },
  },
  nodeTemplate: [
    {
      attributeName: 'spouse',
      checkOwn: true,
      width: 120,
      draw: function(that, ctx, x, y, node) {
        that.drawAvatar(ctx, x, y, node)
        that.drawAvatar(ctx, x + this.width / 2, y, node.spouse)
        // node color
        if (node.sex === 0) {
          ctx.fillStyle = 'cornflowerblue'
        } else {
          ctx.fillStyle = 'lightcoral'
        }
      
        ctx.fillRect(x, y + that.nodeWidth, that.nodeWidth, that.nodeHeight - that.nodeWidth)
        if (node.spouse && node.spouse.sex === 0) {
          ctx.fillStyle = 'cornflowerblue'
        } else if (node.spouse && node.spouse.sex === 1) {
          ctx.fillStyle = 'lightcoral'
        }
        ctx.fillRect(x + this.width / 2, y + that.nodeWidth, that.nodeWidth, that.nodeHeight - that.nodeWidth)
        ctx.stroke()
        const textHeight = that.nodeHeight - that.nodeWidth
        that.drawVerticalText(ctx, x, y + that.nodeWidth, that.nodeWidth, textHeight, node.name)
        that.drawVerticalText(ctx, x + this.width / 2, y + that.nodeWidth, that.nodeWidth, textHeight, node.spouse.name)
      }
    }
  ]
}
The nodeTemplate can write multiple objects inside,each object is drawn for a different property. Explain what each of its properties does:

Name	Type	Default	Description
attributeName	string		The node that owns this property uses this custom template.
checkOwn	boolean		Check whether the node owns this property.
width	number	60	The node width.
draw	function	null	How to draw this node.
Methods
render(canvas, data)
It's the useful way when users want to re-initialize or refresh orgchart based on new options or reload new data.

Property
currentSelected
Get the node that is currently selected.

Screenshots

