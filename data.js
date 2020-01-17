let dId = 	0

let data = function(v, label = '', opts = {}) {
	if (v === undefined) {
		throw new Error(`ERROR\tNo value to data`)
	}

	this.id = 		dId
	this.v = 		v
	this.label = 	label
	this.opts = 	opts
	this.sub = 		{}

	dId++
	return this
}

data.prototype.addSub = function(datum) {
	this.sub[datum.label] = datum
}
data.prototype.addSubs = function(data) {
	let thisData = this
	for (let i in data) {
		thisData.addSub(data[i])
	}
}

// export var data = data