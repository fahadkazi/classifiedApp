var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassifiedSchema = new Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String, required: true, },
	price: { type: Number, required: true },
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: null },
	contact: {
		name: String,
		phone: Number,
		email: String
	},
	categories: [],
	image: String,
	user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Classified', ClassifiedSchema);