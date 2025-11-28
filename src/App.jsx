import { useEffect, useState } from 'react'

import MovieRow from './components/MovieRow'
import SearchBox from './components/SearchBox'
import { supabase } from './client.js'

function App() {
  const [movies, setMovies] = useState([])

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('poster:posterUrl, title:name, year, genre:genres, rating, length: filmLength, type')
    if (error) {
      console.log('Ошибка при загрузке:', error)
      return // Выходим, дальше не идем
    }

  // Если ошибки нет — обновляем стейт
    if (data) {
        console.log('Пришли данные:', data) // <-- Посмотри сюда в консоли браузера!
        setMovies(data)
    }
  }

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
      poster: data.Poster,
    }

    setMovies([...movies, newMovie])
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectTerm, setSelectTerm] = useState('')
  const [yearPicker, setYearPicker] = useState('')
 
  const selectHandle = (event) => {
    setSelectTerm(event.target.value)
  }

  const filteredMovies = movies.filter(movie => {
    const matchTitle = (movie.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = (movie.type || "").toLowerCase().includes(selectTerm.toLowerCase())
    return matchTitle && matchType
  })

  return (
  <div className="container mt-4">
    <SearchBox addAction={addMovie}/>
    <div className="container row">
      <div className="col-md-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="🔍 Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="col-md-4">
        <select className='form-select bg-white text-dark' value={selectTerm} onChange={selectHandle} name="" id="">
          <option selected="" value="">All</option>
          <option value="Фильм">Films</option>
          <option value="Сериал">Series</option>
          <option value="Аниме">Anime</option>
          <option value="Мульт-сериал">Multiplication</option>
          <option value="Аниме-сериал">Anime-series</option>
        </select>
      </div>
    </div>
    <table className="table table-hover">
    <thead>
      <tr>
        <th>Poster</th>
        <th>Title</th>
        <th>Year</th>
        <th>Rating</th>
        <th>Genre</th>
        <th>Length</th>
        <th>Type</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredMovies.map((movie) => (
         <MovieRow 
            key={movie.poster} 
            movie={movie} 
            deleteAction={deleteMovie} 
         />
      ))}
    </tbody>
  </table>
  </div>

  
  )
}

export default App
