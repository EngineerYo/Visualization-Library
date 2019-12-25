let scatterPlot = function(pos, name, yLim0, yLim1, p=5, maxPoints) {
	let {x0, x1, y0, y1} = 	pos

	this.x0 = 	x0
	this.x1 = 	x1
	this.y0 = 	y0
	this.y1 = 	y1

	this.margin = 	5
	this.p = 		p

	this.tBound = y0 + this.p
	this.bBound = y1 - this.p
	this.lBound = x0 + this.p
	this.rBound = x1 - this.p

	this.xLen = 	x1 - x0 - p*2
	this.yLen = 	y1 - y0 - this.margin*2 - p*2

	this.cMin =	+1e100
	this.cMax =	-1e100

	this.name = name

	this.transform = function(num, s0, s1) {
		return num*(s1/s0)
	}

	this.initialize = function() {
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
			this.maxPoints = 	this.xLen
		}
		else {
			this.maxPoints = maxPoints
		}

	}
	this.construct = function(scope) {
		let {tBound, lBound, rBound, bBound, xLen, yLen, p, name} = scope

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

		d3.select(`#${name}`).select('#body').append('rect')
			.attr('id', `Body`)
			.attr('x', lBound).attr('y', tBound)
			.attr('width', xLen).attr('height', y1 - y0 - p*2)
			.attr('fill', 'white')
		
		d3.select(`#${name}`).append('rect')
			.attr('id', `container`)
			.attr('x', lBound).attr('y', tBound)
			.attr('width', xLen).attr('height', y1 - y0 - p*2)
			.attr('fill', 'white').attr('fill-opacity', 0)
			.on('mouseover', 	function() {onOver(name, this)	})
			.on('mouseleave', 	function() {onLeave(name, this)	})
			.on('mousemove', 	function() {onMove(name, this)	})


		d3.select(`#${name}`).select(`#disp`).append('text')
			.attr('id', 'display')
			.attr('x', 0).attr('y', 0)
			.style('font-family', 'sans-serif')
			.style('font-size', '20px')
			.style('fill', 'black')

		d3.select(`#${name}`).select(`#guideLines`).append('line')
			.attr('id', `xLoc`)
			.attr('x1', lBound).attr('x2', lBound)
			.attr('y1', tBound).attr('y2', bBound)
			.attr('visibility', 'hidden')
			.attr('stroke-width', 0.5).style('stroke', 'grey')
		d3.select(`#${name}`).select(`#guideLines`).append('line')
			.attr('id', `yLoc`)
			.attr('x1', lBound).attr('x2', rBound)
			.attr('y1', bBound).attr('y2', bBound)
			.attr('visibility', 'hidden')
			.attr('stroke-width', 0.5).style('stroke', 'grey')

		d3.select(`#${name}`).select(`#boundingBox`).append('line')
			.attr('id', 'xAxis')
			.attr('x1', x0+p).attr('x2', x1-p)
			.attr('y1', y1-p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		d3.select(`#${name}`).select(`#boundingBox`).append('line')
			.attr('id', 'yAxis')
			.attr('x1', x0+p).attr('x2', x0+p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 2).style('stroke', 'black')
		
		d3.select(`#${name}`).select(`#boundingBox`).append('line')
			.attr('id', 'yLine')
			.attr('x1', x1-p).attr('x2', x1-p)
			.attr('y1', y0+p).attr('y2', y1-p)
			.attr('stroke-width', 1).style('stroke', 'grey')
		d3.select(`#${name}`).select(`#boundingBox`).append('line')
			.attr('id', 'yLine')
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

	let onOver = function(name, obj) {
		d3.select(`#${name}`).select(`#xLoc`)
			.attr('visibility', 'visible')
		d3.select(`#${name}`).select(`#yLoc`)
			.attr('visibility', 'visible')
		d3.select(`#${name}`).select(`#display`)
			.attr('visibility', 'visible')
	}
	let onLeave = function(name, obj) {
		d3.select(`#${name}`).select(`#xLoc`)
			.attr('visibility', 'hidden')
		d3.select(`#${name}`).select(`#yLoc`)
			.attr('visibility', 'hidden')
		d3.select(`#${name}`).select(`#display`)
			.attr('visibility', 'hidden')
	}
	let onMove = function(name, obj) {
		let mouse = d3.mouse(obj)
		d3.select(`#${name}`).select(`#xLoc`)
			.attr('x1', mouse[0]).attr('x2', mouse[0])
		d3.select(`#${name}`).select(`#yLoc`)
			.attr('y1', mouse[1]).attr('y2', mouse[1])

		d3.select(`#${name}`).select(`#display`)
			.attr('x', mouse[0] + 2)
			.attr('y', mouse[1] - 2)
			.text(`${mouse[0]}\n${mouse[1]}`)
	}

	this.initialize()

	this.setup({name: this.name})
	this.construct({tBound: this.tBound, lBound: this.lBound, rBound: this.rBound, bBound: this.bBound, p: this.p, xLen: this.xLen, yLen: this.yLen, name: this.name})
}
scatterPlot.prototype.addData = function(datum, render = false) {
	this.data.unshift(datum)
	if (this.data.length > this.maxPoints) {
		this.data.pop()
	}

	if (datum.v > this.cMax) {
		this.cMax = datum.v
	}
	if (datum.v < this.cMin) {
		this.cMin = datum.v
	}

	if (render == true) {
		this.render()
	}
}
scatterPlot.prototype.render = function() {
	d3.select(`#${this.name}`).select(`#data`).selectAll('*').remove()
	// d3.select(`#${name}`).select(`#data`).selectAll(`#Line-${this.name}`).remove()

	let topLine = 	this.y0 + this.margin + this.p
	let botLine = 	this.y1 - this.margin - this.p

	let subDivs = 	this.maxPoints
	let divLen = 	this.xLen/subDivs

	for (let i in this.data) {

		let ratio = 	(this.data[i].v)/(this.yLim1 - this.yLim0)

		let xLoc = 		i*divLen + this.x0 + this.p + divLen
		let yLoc = 		this.yLen*(1 - ratio) + this.margin + this.p

		d3.select(`#${this.name}`).select(`#data`).append('circle')
			.attr('cx', xLoc).attr('cy', yLoc)
			.attr('r', 0.5).style('stroke', 'black')
	}
}
scatterPlot.prototype.clearData = function() {
	this.data = []
}
scatterPlot.prototype.scale = function() {
	this.yLim0 = 	this.cMin
	this.yLim1 = 	this.cMax
}