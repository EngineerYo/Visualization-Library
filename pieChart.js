let pieChart = function(pos, name, p = 5, iRad = 0.75, pAngle = Math.PI/200) {
	this.data = {}

	let {x0, x1, y0, y1} = pos

	this.x0 = 		x0
	this.x1 = 		x1
	this.y0 = 		y0
	this.y1 = 		y1
	
	this.p = 		p
	this.pAngle = 	pAngle

	this.tBound = y0 + this.p
	this.bBound = y1 - this.p
	this.lBound = x0 + this.p
	this.rBound = x1 - this.p

	this.cx = 		(x1-x0)/2
	this.cy = 		(x1-x0)/2

	this.minData = 	1e100

	this.lastAngle = [0]

	this.r = 		(x1 - x0) / 2 - p
	this.r0 = 		this.r * iRad

	this.name = 	name
	this.sum = 		0

	this.construct = function() {
		d3.select(`#${name}`).append('g')
			.attr('id', 'body')
		d3.select(`#${name}`).append('g')
			.attr('id', 'guideLines')
		d3.select(`#${name}`).append('g')
			.attr('id', 'data')
		d3.select(`#${name}`).append('g')
			.attr('id', 'disp')
		d3.select(`#${name}`).append('g')
			.attr('id', 'boundingBox')

		d3.select(`#${name}`).select('#body').append('circle')
			.attr('id', `Body`)
			.attr('cx', this.cx).attr('cy', this.cy)
			.attr('r', this.r)
			.attr('fill', 'white')
		
		d3.select(`#${name}`).select(`#disp`).append('text')
			.attr('id', 'display')
			.attr('x', this.cx).attr('y', this.cy)
			.style('font-family', 'sans-serif')
			.style('font-size', '20px')
			.style('fill', 'black')
			.style('text-anchor', 'middle')
			.style('alignment-baseline', 'middle')

		d3.select(`#${name}`).select(`#guideLines`).append('line')
			.attr('id', `xLoc`)
			.attr('x1', this.lBound).attr('x2', this.lBound)
			.attr('y1', this.tBound).attr('y2', this.bBound)
			.attr('visibility', 'hidden')
			.attr('stroke-width', 0.5).style('stroke', 'grey')
		d3.select(`#${name}`).select(`#guideLines`).append('line')
			.attr('id', `yLoc`)
			.attr('x1', this.lBound).attr('x2', this.rBound)
			.attr('y1', this.bBound).attr('y2', this.bBound)
			.attr('visibility', 'hidden')
			.attr('stroke-width', 0.5).style('stroke', 'grey')

		d3.select(`#${name}`).select('#boundingBox').append('line')
			.attr('id', 'bBound')
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y1-p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		d3.select(`#${name}`).select('#boundingBox').append('line')
			.attr('id', 'lBound')
			.attr('x1', x0+p).attr('x2', x0+p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		
		d3.select(`#${name}`).select('#boundingBox').append('line')
			.attr('id', 'rBound')
			.attr('x1', x1-p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 1).style('stroke', 'grey')
		d3.select(`#${name}`).select('#boundingBox').append('line')
			.attr('id', 'tBound')
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y0+p)
			.attr('stroke-width', 1).style('stroke', 'grey')
	}
	this.setup = function(scope) {
		let {name} = scope

		d3.select('body').select('svg').append('g')
			.attr('id', `${name}`)

		d3.select('body').select('svg')
			.attr('width', Math.max(d3.select('svg').attr('width'), this.x1))
			.attr('height', Math.max(d3.select('svg').attr('height'), this.y1))
	}

	this.setup({name: this.name})
	this.construct()
}

pieChart.prototype.addData = function(datum) {
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
	for (let i in this.data) {
		let datum = this.data[i]
		this.renderArc(datum)
	}
}
pieChart.prototype.renderArc = function(datum, depth = 0, numChildren = Object.keys(this.data).length, parentAngle = Math.PI*2, parentSum = this.sum) {

	this.onOver = function(name) {
		console.log(JSON.stringify(this))
		d3.select(`#${name}`).select(`#display`)
			.attr('visibility', 'visible')
			.text(datum.v)
	}
	this.onLeave = function(name) {
		d3.select(`#${name}`).select(`#display`)
			.attr('visibility', 'hidden')
			.text('')
	}

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

	let name = this.name
	
	let arc = d3.arc()
		.innerRadius(this.r0)
		.outerRadius(this.r - depth*10 - this.p)
		.padAngle(this.pAngle)
	
	d3.select(`#${this.name}`).select('#data').append('path')
		.attr('d', arc({startAngle: startAngle + this.pAngle/2, endAngle: endAngle - this.pAngle/2}))
		.attr('stroke-width', 2)
		.attr('stroke', datum['opts']['border'])
		.attr('fill', datum['opts']['fill'])
		.attr('transform', `translate(${this.x0 + this.r + this.p}, ${this.y0 + this.r + this.p})`)
		.attr('name', this.label)
		.on('mouseover', function() {
			console.log(datum.v)
			d3.select(`#${name}`).select(`#display`)
				.attr('visibility', 'visible')
				.text(datum.v)
			d3.select(this)
				.attr('stroke', 'black')
		})
		.on('mouseout', function() {
			d3.select(`#${name}`).select(`#display`)
				.attr('visibility', 'hidden')
				.text('')
			d3.select(this)
				.attr('stroke', 'none')
		})

	if (Object.keys(datum.sub).length || 0 > 0) {
		let newDepth = depth+1
		this.lastAngle[newDepth] = this.lastAngle[depth] + this.pAngle*2

		for (let i in datum.sub) {
			this.renderArc(datum.sub[i], newDepth, Object.keys(datum.sub).length, thisAngle, datum.v)
		}
	}
	
	this.lastAngle[depth] = endAngle
}