import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [movies, setMovies] = useState([
    { id: 1, title: 'Inception', genre: 'Sci-Fi', language: 'English', rating: 8.8, poster: 'https://via.placeholder.com/150', description: 'A thief who steals corporate secrets through the use of dream-sharing technology.' },
    { id: 2, title: 'Interstellar', genre: 'Sci-Fi', language: 'English', rating: 8.6, poster: 'https://via.placeholder.com/150', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.' },
    { id: 3, title: 'The Dark Knight', genre: 'Action', language: 'English', rating: 9.0, poster: 'https://via.placeholder.com/150', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.' }
  ]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Fetch movies from Express Backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setMovies(data);
      })
      .catch((err) => console.log('Backend server running offline or empty DB, using default demo data.'));
  }, []);

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      setUser({ email: authEmail, name: authEmail.split('@')[0] });
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter ? movie.genre === genreFilter : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container py-4">
      {/* Navbar Header */}
      <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h1 className="h3 text-primary m-0">🎬 IMovies Capstone</h1>
        <div>
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold">Welcome, {user.name}!</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setShowAuthModal(true)}>Login</button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal d-block tab-index='-1'" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Login</h5>
                <button className="btn-close" onClick={() => setShowAuthModal(false)}></button>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAuthModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Sign In</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search movies by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="">All Genres</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
          </select>
        </div>
      </div>

      {/* Movie Grid / Booking View */}
      {!selectedMovie ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredMovies.map((movie) => (
            <div className="col" key={movie.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <span className="badge bg-info text-dark mb-2">{movie.genre}</span>
                  <p className="card-text text-muted">{movie.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold">⭐ {movie.rating}/10</span>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedMovie(movie)}>Book Tickets</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card shadow-sm p-4">
          <button className="btn btn-link text-start p-0 mb-3" onClick={() => setSelectedMovie(null)}>← Back to Movies</button>
          <h3>{selectedMovie.title} - Select Seats</h3>
          <p className="text-muted">Genre: {selectedMovie.genre} | Rating: {selectedMovie.rating}</p>
          
          <div className="d-flex flex-wrap gap-2 my-3">
            {['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'].map((seat) => (
              <button
                key={seat}
                className={`btn ${selectedSeats.includes(seat) ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
            <div>
              <strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}<br/>
              <strong>Total Amount:</strong> ${selectedSeats.length * 12}
            </div>
            <button 
              className="btn btn-success" 
              disabled={selectedSeats.length === 0}
              onClick={() => {
                alert(`Booking confirmed for ${selectedSeats.join(', ')}! Total: $${selectedSeats.length * 12}`);
                setSelectedMovie(null);
                setSelectedSeats([]);
              }}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;