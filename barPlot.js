let barPlot = function(pos, name, yLim0, yLim1, p=5) {
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

	this.xLen = 	x1 - x0 - this.p*2
	this.yLen = 	y1 - y0 - this.p*2 - this.margin

	this.name = name
	this.catSums = {}

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

		this.data = {}
		this.name = name
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
	}
	let onLeave = function(name, obj) {
	}
	let onMove = function(name, obj) {
		let mouse = d3.mouse(obj)
	}

	this.initialize()

	this.setup({name: this.name})
	this.construct({tBound: this.tBound, lBound: this.lBound, rBound: this.rBound, bBound: this.bBound, p: this.p, xLen: this.xLen, yLen: this.yLen, name: this.name})
}
barPlot.prototype.sort = function(type) {
	if (type == 'ASCEND') {

	}
	else if (type == 'DESCEND') {

	}
	else if (type == 'ALPHABETICAL') {

	}
}
barPlot.prototype.addData = function(datum) {
	if (this.data[datum.opts.category] === undefined) {
		this.data[datum.opts.category] = [datum]
		this.catSums[datum.opts.category] = datum.v
	}
	else {
		this.data[datum.opts.category].push(datum)
		this.catSums[datum.opts.category] += datum.v
	}
}
barPlot.prototype.removeData = function(category, label) {
	delete this.data[category][label]
}

barPlot.prototype.render = function() {

	let nCategories = 	Object.keys(this.data).length
	let xSpan = 		(this.xLen+this.p*2)/nCategories

	let count = 	0

	for (let i in this.data) {
		let cat = 		this.data[i]
		let sum = 		this.catSums[i]


		for (let v in this.data[i]) {
			let datum = 	cat[v]

			let ySpan = 	(datum.v/sum) * (yLen)
			let xLoc = 		this.lBound + this.p + count*xSpan
			let yLoc = 		this.bBound - ySpan

			d3.select(`#{this.name}`).select(`#data`).append('rect')
				
			}
		}
		let ySpan =		(this.data[i])


	}

}