import { useState } from 'react'

import MovieCard from './components/MovieRow'
import SearchBox from './components/SearchBox'

function App() {
  const [movies, setMovies] = useState([
    {
        id: 1, 
        title: "Oldboy", 
        year: 2003, 
        genre: "Thriller, Mystery", // Жанры лучше писать строкой через запятую, как в API
        poster: "https://m.media-amazon.com/images/M/MV5BMTAwNzNjYWItZmI0Ni00ZTcyLWIwNWMtZjlmNGMxZTEyYTJmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        plot: "After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find that he must find his captor in five days.",
        rating: "8.4" 
    },
    // ... другие фильмы
])

  const deleteMovie = (idToDelete) => {
    setMovies(movies.filter(movie => movie.id !== idToDelete))
}

  const [error, setError] = useState('');

  const addMovie = (data) => {
    
    const newMovie = {
      id: data.imdbID,
      title: data.Title,
      year: data.Year,
      plot: data.Plot,
      imdbRating: data.imdbRating,
      genre: data.Genre,
      poster: data.Poster
    }

    setMovies([...movies, newMovie])
  }

  return (
  <div className="container mt-4">
  
    <div className="row">
    <SearchBox addAction={addMovie}/>
      {movies.map((item) => (
        <MovieCard  movie={item} deleteAction={deleteMovie}/>
      ))}
    </div>
  </div>

  
  )
}

export default App
