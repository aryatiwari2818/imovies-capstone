const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' }
}, { timestamps: true });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  posterUrl: String,
  description: String
}, { timestamps: true });
movieSchema.index({ title: 'text', genre: 1, language: 1 });

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }
});

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  showTime: { type: String, required: true },
  date: { type: String, required: true },
  bookedSeats: { type: [String], default: [] }
}, { timestamps: true });
showSchema.index({ date: 1, movie: 1 });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'SUCCESS' }
}, { timestamps: true });
bookingSchema.index({ user: 1 });

module.exports = {
  User: mongoose.model('User', userSchema),
  Movie: mongoose.model('Movie', movieSchema),
  Theatre: mongoose.model('Theatre', theatreSchema),
  Show: mongoose.model('Show', showSchema),
  Booking: mongoose.model('Booking', bookingSchema)
};