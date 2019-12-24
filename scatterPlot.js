let scatterPlot = function(pos, name, yLim0, yLim1, p=5, maxPoints) {
	let {x0, x1, y0, y1} = 	pos

	this.x0 = 	x0
	this.x1 = 	x1
	this.y0 = 	y0
	this.y1 = 	y1

	this.p = 	p

	this.cMin =	+1e100
	this.cMax =	-1e100

	if (yLim0 !== undefined) {
		this.yLim0 = yLim0
	}
	else {
		this.yLim0 = 0
	}
	if (yLim1 !== undefined) {
		this.yLim1 = yLim1
	}
	else {
		this.yLim1 = 0
	}

	this.data = []
	this.name = name

	if (maxPoints === undefined) {
		this.maxPoints = this.x1-this.x0
	}
	else {
		this.maxPoints = maxPoints
	}

	this.transform = function(num, s0, s1) {
		return num*(s1/s0)
	}

	this.construct = function() {
		d3.select('body').select('svg').append('line')
			.attr('id', 'xAxis-' + name)
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y1-p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		d3.select('body').select('svg').append('line')
			.attr('id', 'yAxis-' + name)
			.attr('x1', x0+p).attr('x2', x0+p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		
		d3.select('body').select('svg').append('line')
			.attr('id', 'yLine-' + name)
			.attr('x1', x1-p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 1).style('stroke', 'grey')
		d3.select('body').select('svg').append('line')
			.attr('id', 'yLine-' + name)
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y0+p)
			.attr('stroke-width', 1).style('stroke', 'grey')
	}
	this.setup = function() {
		d3.select('body').append('svg')
			.attr('width', x0+x1).attr('height', y0+y1)
	}
	this.test = function() {
	}

	this.test()

	this.construct()
	this.setup()
}
scatterPlot.prototype.addData = function(value, render = false) {
	this.data.unshift(value)
	if (this.data.length >= this.maxPoints) {
		this.data.pop()
	}

	if (value > this.cMax) {
		this.cMax = value
	}
	if (value < this.cMin) {
		this.cMin = value
	}

	if (render == true) {
		this.render()
	}
}
scatterPlot.prototype.render = function(margin=5) {
	d3.select('body').select('svg').selectAll(`#Data-${this.name}`).remove()
	d3.selectAll(`#Line-${this.name}`).remove()

	let xDist = 	(this.x1 - this.x0) - this.p*2
	let yDist = 	(this.y1 - this.y0) - margin*2 - this.p*2

	let subDivs = 	this.maxPoints
	let divLen = 	xDist/subDivs

	for (let i in this.data) {
		let xLoc = (i*divLen) + (this.x0 + this.p) + divLen
		let yLoc = (this.data[i]/(this.yLim1 - this.yLim0)) * yDist + margin + this.p

		d3.select('body').select('svg').append('circle')
			.attr('id', 'Data-' + this.name)
			.attr('cx', xLoc).attr('cy', yLoc)
			.attr('r', 1).style('stroke', 'black')
	}
}
scatterPlot.prototype.clearData = function() {
	this.data = []
}
scatterPlot.prototype.scale = function() {
	this.yLim0 = 	this.cMin
	this.yLim1 = 	this.cMax
}