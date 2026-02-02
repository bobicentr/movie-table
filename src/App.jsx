import React, { useState, useEffect } from 'react'

import MovieRow from './components/MovieRow'
import SearchBox from './components/SuggestBox.jsx'
import LoginModal from './components/LoginModal.jsx'
import { supabase } from './client.js'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import OfferedMoviesTable from './components/OfferedMoviesTable.jsx'

function App() {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
      document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])
  const [movies, setMovies] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [session, setSession] = useState(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  const handleLogout = async () => {
      await supabase.auth.signOut()
  }
 
  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('poster:posterUrl, title:name, year, genre:genres, rating, length: filmLength, type')
    if (error) {
      console.log('Ошибка при загрузке:', error)
      return
    }

    if (data) {
        console.log('Пришли данные:', data)
        setMovies(data)
    }
  }

  const deleteMovie = async (urlToDelete) => {
    const { error } = await supabase
            .from('movies')
            .delete()
            .eq('posterUrl', urlToDelete)

        if (!error) {
            setMovies(movies.filter(item => item.poster !== urlToDelete))
        } else {
            alert(error.message)
        }
}

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
  const [yearRange, setYearRange] = useState([1950, 2025])
 
  const selectHandle = (event) => {
    setSelectTerm(event.target.value)
  }

  const filteredMovies = movies.filter(movie => {
    const matchTitle = (movie.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = (movie.type || "").toLowerCase().includes(selectTerm.toLowerCase())
    return matchTitle && matchType && movie.year > yearRange[0] && movie.year < yearRange[1]
  })

  return (
  <div className="container mt-4">
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
        <select className='form-select' value={selectTerm} onChange={selectHandle} name="" id="">
          <option value="">All</option>
          <option value="Фильм">Films</option>
          <option value="Сериал">Series</option>
          <option value="Аниме">Anime</option>
          <option value="Мульт-сериал">Multiplication</option>
          <option value="Аниме-сериал">Anime-series</option>
        </select>
      </div>
      
      {!session ? (
            <button className="btn btn-primary col-md-2" onClick={() => setIsModalOpen(true)}>
               Log In
            </button>
        ) : (
            <div className="d-flex gap-2 align-items-center col-md-2">
               <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
               </button>
            </div>
        )}
      <div className="col-2"><button className="btn btn-outline-secondary col-12" onClick={toggleTheme}>
          {theme === 'dark' ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
      </button></div>
    </div>
    <div className="container-fluid row">
    <Slider className='col-md-12 mt-5' range min={1950} max={2025} 
      value={yearRange}
      onChange={(value) => setYearRange(value)} 
      styles={{
        track: { backgroundColor: 'lightblue' }, 
        handle: { 
            borderColor: 'lightblue', 
            backgroundColor: '#fff',
            opacity: 1,
            boxShadow: 'none'
        },
        rail: { backgroundColor: '#ccc' }
      }}
      handleRender={(node, handleProps) => {
        return React.cloneElement(node, {}, (
            <div className="slider-tooltip">
                {handleProps.value}
            </div>
        ));
      }}
    />
    </div>
    <SearchBox addAction={addMovie}/>
    {session && (
    <OfferedMoviesTable 
        onMovieAdded={() => fetchMovies()} 
    />
    )}
    <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    <div style={{ maxHeight: '70vh', overflowY: 'auto', border: '1px solid #444', borderRadius: '8px' }}>
  
  <table className="table table-hover table-sm mb-0"> 
    
    <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#212529', color: 'white' }}>
      <tr>
        <th style={{ width: '60px' }}>Poster</th>
        <th style={{ width: '25%' }}>Title</th>
        <th style={{ width: '80px' }}>Year</th>
        <th style={{ width: '80px' }}>Rating</th>
        <th style={{ width: '20%' }}>Genre</th>
        <th style={{ width: '100px' }}>Length</th>
        <th style={{ width: '100px' }}>Type</th>
        
        {session && <th style={{ width: '80px' }}>Actions</th>}
      </tr>
    </thead>

    <tbody>
      {filteredMovies.map((movie) => (
         <MovieRow 
            key={movie.id || movie.poster} 
            movie={movie} 
            deleteAction={deleteMovie} 
            session={session}
         />
      ))}
    </tbody>
  </table>

</div>
  </div>

  
  )
}

export default App
