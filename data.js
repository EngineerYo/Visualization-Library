let data = function(v, label = '', opts = {}) {

	if (v === undefined) {
		throw new Error(`ERROR\tNo value to data`)
	}

	this.v = 		v
	this.label = 	label
	this.opts = 	opts
	this.sub = 		{}

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