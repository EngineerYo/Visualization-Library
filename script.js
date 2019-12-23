let pieChart = function(x0, x1, y0, y1, name, p = 2, iRad = 0.7, pAngle = Math.PI/200) {
	this.data = {}

	this.x0 = 		x0
	this.x1 = 		x1
	this.y0 = 		y0
	this.y1 = 		y1
	this.p = 		p
	this.pAngle = 	pAngle

	this.lastAngle = [0]

	this.r = 		(x1 - x0) / 2 - p
	this.r0 = 		this.r * iRad

	this.name = 	name
	this.sum = 		0

	this.construct = function() {
		d3.select('body').select('svg').append('line').attr('id', 'TBound' + name)
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y1-p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		d3.select('body').select('svg').append('line').attr('id', 'LBound' + name)
			.attr('x1', x0+p).attr('x2', x0+p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', p).style('stroke', 'black')
		
		d3.select('body').select('svg').append('line').attr('id', 'TBound' + name)
			.attr('x1', x1-p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 1).style('stroke', 'grey')
		d3.select('body').select('svg').append('line').attr('id', 'RBound' + name)
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y0+p)
			.attr('stroke-width', 1).style('stroke', 'grey')
	}
	this.setup = function() {
		d3.select('body').append('svg')
			.attr('width', x0+x1)
			.attr('height', y0+y1)
	}

	this.setup({x0: x0, x1: x1, y0: y0, y1: y1})
	// this.construct({x0: x0, x1: x1, y0: y0, y1: y1})
}
pieChart.prototype.addData = function(datum) {
	/* Datum is of the type
	 * {label: [String], v: [Number], opts: {}, sub: {}}
	 * Datum.opts is of the type
	 * {fill: [String, RGB], border: [String, RGB]}
	 * Datum.sub is of the type
	 * {[Datum]}
	 */ 

	this.data[datum.label] = datum
	this.sum +=	datum.v
}
pieChart.prototype.removeData = function(label) {
	this.sum -= this.data[label].v
	delete this.data[label]
}
pieChart.prototype.render = function() {
	d3.select('body').append('svg').attr('width', this.x0+this.x1).attr('height', this.y0+this.y1)

	for (let i in this.data) {
		let datum = this.data[i]
		this.renderArc(datum)
	}

	//
}
pieChart.prototype.renderArc = function(datum, depth = 0, numChildren = Object.keys(this.data).length, toFill = Math.PI*2) {
	let angle = (Math.PI*2) * (datum.v/this.sum)
	// let fillAngle = toFill - this.pAngle*numChildren - (depth > 0 ? this.pAngle : 0)
	// let angle = (this.lastAngle[depth]) + fillAngle * (datum.v/this.sum)

	let startAngle = 	this.lastAngle[depth]
		//  + (this.lastAngle[depth] == 0 ? 0 : this.pAngle/2)
		//  + depth*this.pAngle/2
	let endAngle = 		startAngle + angle 
		// - this.pAngle/2
		// - depth*this.pAngle/2
	
	let arc = d3.arc()
		.innerRadius(this.r0)
		.outerRadius(this.r - depth*10)
		.padAngle(this.pAngle)
	
	d3.select('body').select('svg').append('path')
		.attr('d', arc({startAngle: startAngle, endAngle: endAngle}))
		// .attr('stroke-width', depth == 0 ? 2 : 0)
		.attr('stroke', datum['opts']['border'])
		.attr('fill', datum['opts']['fill'])
		.attr('transform', `translate(${this.x0 + this.r + this.p}, ${this.y0 + this.r + this.p})`)

	if (Object.keys(datum.sub).length > 0) {
		let newDepth = depth+1
		this.lastAngle[newDepth] = this.lastAngle[depth]

		for (let i in datum.sub) {
			console.log(`${i}\t${datum.sub[i].v/this.sum}\t(${datum.sub[i].v}\t${this.sum})`)
			this.renderArc(datum.sub[i], newDepth)//, Object.keys(datum.sub).length, angle)
		}
	}
	
	this.lastAngle[depth] = endAngle
}

let Data = function(v, label, opts = {}) {
	this.v = 		v
	this.label = 	label
	this.opts = 	opts
	this.sub = 		{}

	return this
}
Data.prototype.addSub = function(datum) {
	this.sub[datum.label] = datum
}
Data.prototype.addSubs = function(data) {
	let thisData = this
	for (let i in data) {
		thisData.addSub(data[i])
	}
}


let DEM = 		d3.hsl(240, 0.50, 0.50)
let REP = 		d3.hsl(000, 0.50, 0.50)
let IND =		d3.hsl(000, 0.00, 0.50)

let FOR = 		d3.hsl(240, 0.50, 0.30)
let OPP = 		d3.hsl(000, 0.50, 0.30)

let ABS = 		d3.hsl(240, 0.10, 0.30)

let trumpA1DemFor = new Data(229, 		'D in favor',		{fill: DEM.formatHex().toString(), border: 'none'})
let trumpA1DemOpp = new Data(2,			'D opposed',		{fill: DEM.formatHex().toString(), border: 'none'})
let trumpA1DemAbs = new Data(1, 		'D abstained', 		{fill: ABS.formatHex().toString(), border: 'none'})

let trumpA1RepFor = new Data(0,			'R in favor', 		{fill: REP.formatHex().toString(), border: 'none'})
let trumpA1RepOpp = new Data(195,		'R opposed', 		{fill: REP.formatHex().toString(), border: 'none'})
let trumpA1RepAbs = new Data(0,			'R abstained',		{fill: ABS.formatHex().toString(), border: 'none'})

let trumpA1IndFor = new Data(1,			'I in favor',		{fill: IND.formatHex().toString(), border: 'none'})
let trumpA1IndOpp = new Data(0, 		'I opposed', 		{fill: IND.formatHex().toString(), border: 'none'})
let trumpA1IndAbs = new Data(0,			'I abstained', 		{fill: ABS.formatHex().toString(), border: 'none'})

let trumpA1AllFor = new Data(230,		'Total in favor',	{fill: FOR.formatHex().toString(), border: 'none'})
let trumpA1AllOpp = new Data(197, 		'Total opposed',	{fill: OPP.formatHex().toString(), border: 'none'})
let trumpA1AllAbs = new Data(5, 		'Total abstained',	{fill: ABS.formatHex().toString(), border: 'none'})

trumpA1AllFor.addSubs([trumpA1DemFor, trumpA1RepFor, trumpA1IndFor])
trumpA1AllOpp.addSubs([trumpA1DemOpp, trumpA1RepOpp, trumpA1IndOpp])

let pieChart0 = new pieChart(10, 410, 10, 410, 'Hi')
pieChart0.addData(trumpA1AllFor)
pieChart0.addData(trumpA1AllAbs)
pieChart0.addData(trumpA1AllOpp)
pieChart0.render()