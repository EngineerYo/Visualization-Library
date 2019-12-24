'use strict'

let C0 = 		d3.hsl(240, 0.50, 0.50)
let C1 = 		d3.hsl(  0, 0.50, 0.50)
let C2 =		d3.hsl(  0, 0.00, 0.50)
let C3 = 		d3.hsl(120, 0.50, 0.30)
let C4 = 		d3.hsl(240, 0.50, 0.30)
let C5 = 		d3.hsl(  0, 0.50, 0.30)
let C6 =		d3.hsl(  0, 0.00, 0.70)
let C7 = 		d3.hsl(  0, 0.00, 0.50)
let C8 = 		d3.hsl(  0, 0.00, 0.30)

let D1D1 = 		new data(20, 		'D1D1',		{fill: C0.formatHex().toString(), border: 'none'})
let D1D2 = 		new data(10,		'D1D2',		{fill: C0.formatHex().toString(), border: 'none'})
let D1D3 = 		new data(5, 		'D1D3', 	{fill: C3.formatHex().toString(), border: 'none'})

let D2D1 = 		new data(5,			'D2D1', 	{fill: C1.formatHex().toString(), border: 'none'})
let D2D2 = 		new data(20,		'D2D2', 	{fill: C1.formatHex().toString(), border: 'none'})
let D2D3 = 		new data(10,		'D2D3',		{fill: C3.formatHex().toString(), border: 'none'})

let D3D1 = 		new data(15,		'D3D1',		{fill: C2.formatHex().toString(), border: 'none'})
let D3D2 = 		new data(15, 		'D3D2', 	{fill: C2.formatHex().toString(), border: 'none'})
let D3D3 = 		new data(5,			'D3D3', 	{fill: C3.formatHex().toString(), border: 'none'})

let D1 = 		new data(40,		'D1',		{fill: C4.formatHex().toString(), border: 'none'})
let D2 = 		new data(45, 		'D2',		{fill: C5.formatHex().toString(), border: 'none'})
let D3 = 		new data(20, 		'D3',		{fill: C3.formatHex().toString(), border: 'none'})

let D1D1D1 =	new data(10, 		'D1D1D1',	{fill: C6.formatHex().toString(), border: 'none'})
let D1D1D2 =	new data(7, 		'D1D1D2',	{fill: C7.formatHex().toString(), border: 'none'})
let D1D1D3 =	new data(3, 		'D1D1D3',	{fill: C8.formatHex().toString(), border: 'none'})

D1D1.addSubs([D1D1D1, D1D1D2, D1D1D3])

D1.addSubs([D1D1, D2D1, D3D1])
D2.addSubs([D1D2, D2D2, D3D2])

let pieChart0 = new pieChart({x0: 0, x1: 400, y0: 0, y1: 400}, 'Test piechart 0')
pieChart0.addData(D1)
pieChart0.addData(D2)
pieChart0.addData(D3)

pieChart0.render()

let scatterPlot0 = new scatterPlot({x0: 400, x1: 1200, y0: 0, y1: 400}, 'Test', 0.00, 1.00)

for (let i = 0; i < (scatterPlot0.x1 - scatterPlot0.x0); i++) {
	let midPoint = 	(scatterPlot0.x1 - scatterPlot0.x0)/2
	scatterPlot0.addData(Math.pow(i-midPoint, 1))
}

scatterPlot0.scale()

scatterPlot0.render()

/* TODO
 * Fix reverse ordering of scatter plot data
 * Make scatter plot use the Data object
 * Clean up scatter plot code
 * Create bar chart
 * Create data label
 * Create stacked area chart
 * Create line chart
 */
