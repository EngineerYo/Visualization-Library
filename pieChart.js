let pieChart = function(pos, name, p = 5, iRad = 0.75, pAngle = Math.PI/200) {
	this.data = {}

	let {x0, x1, y0, y1} = pos

	this.x0 = 		x0
	this.x1 = 		x1
	this.y0 = 		y0
	this.y1 = 		y1

	this.p = 		p
	this.pAngle = 	pAngle

	this.minData = 	1e100

	this.lastAngle = [0]

	this.r = 		(x1 - x0) / 2 - p
	this.r0 = 		this.r * iRad

	this.name = 	name
	this.sum = 		0

	this.construct = function() {
		d3.select('body').select('svg').append('line').attr('id', 'BBound' + name)
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y1-p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		d3.select('body').select('svg').append('line').attr('id', 'LBound' + name)
			.attr('x1', x0+p).attr('x2', x0+p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		
		d3.select('body').select('svg').append('line').attr('id', 'RBound' + name)
			.attr('x1', x1-p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 1).style('stroke', 'grey')
		d3.select('body').select('svg').append('line').attr('id', 'TBound' + name)
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y0+p)
			.attr('stroke-width', 1).style('stroke', 'grey')
	}
	this.setup = function() {
		d3.select('body').append('svg')
			.attr('width', (x0+x1)*3)
			.attr('height', (y0+y1)*3)
	}

	this.setup({x0: x0, x1: x1, y0: y0, y1: y1})
	this.construct({x0: x0, x1: x1, y0: y0, y1: y1})
}

pieChart.prototype.addData = function(datum) {
	/* Datum is of the type
	 * {label: [String], v: [Number], opts: {}, sub: {}}
	 * Datum.opts is of the type
	 * {fill: [String, RGB], border: [String, RGB]}
	 * Datum.sub is of the type
	 * {[Datum]}
	 */ 

	this.data[datum.label] = 	datum
	this.sum +=					datum.v

	this.minData = 				Math.min(datum.v, this.minData)
	this.pAngle = 				Math.min((this.minData/this.sum)*(3/4), this.pAngle)

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
}
pieChart.prototype.renderArc = function(datum, depth = 0, numChildren = Object.keys(this.data).length, parentAngle = Math.PI*2, parentSum = this.sum) {

	let toFill
	if (depth == 0) {
		if (numChildren == 1) {
			toFill = parentAngle
		}
		else {
			toFill = parentAngle
		}
	}
	else if (depth > 0) {
		toFill = parentAngle - ((numChildren+1) * this.pAngle)
	}

	let thisAngle = toFill*(datum.v/parentSum)

	let startAngle = 	this.lastAngle[depth]
	let endAngle = 		startAngle + thisAngle
	
	let arc = d3.arc()
		.innerRadius(this.r0)
		.outerRadius(this.r - depth*10 - this.p)
		.padAngle(this.pAngle)
	
	d3.select('body').select('svg').append('path')
		.attr('d', arc({startAngle: startAngle + this.pAngle/2, endAngle: endAngle - this.pAngle/2}))
		.attr('stroke-width', depth == 0 ? 2 : 0)
		.attr('stroke', datum['opts']['border'])
		.attr('fill', datum['opts']['fill'])
		.attr('transform', `translate(${this.x0 + this.r + this.p}, ${this.y0 + this.r + this.p})`)
		.attr('name', this.label)

	// console.log(`${'  '.repeat(depth)}${datum.label}\t${(datum.v/this.sum).toFixed(5)}\t(${datum.v}\t${(thisAngle/Math.PI).toFixed(3)}\t${(startAngle/Math.PI/2).toFixed(2)}\t${(endAngle/Math.PI/2).toFixed(2)})`)

	if (Object.keys(datum.sub).length || 0 > 0) {
		let newDepth = depth+1
		this.lastAngle[newDepth] = this.lastAngle[depth] + this.pAngle*2

		for (let i in datum.sub) {
			this.renderArc(datum.sub[i], newDepth, Object.keys(datum.sub).length, thisAngle, datum.v)
		}
	}
	
	this.lastAngle[depth] = endAngle
}