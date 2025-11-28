import React, { useState, useEffect } from 'react'

import MovieRow from './components/MovieRow'
import SearchBox from './components/SuggestBox.jsx'
import LoginModal from './components/LoginModal.jsx'
import { supabase } from './client.js'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import OfferedMoviesTable from './components/OfferedMoviesTable.jsx'

function App() {
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
      setSession(session) // Обновляем стейт, React перерисовывает экран
    })

    return () => subscription.unsubscribe()
  }, []) // Пустой массив = запустить 1 раз при старте

  
  // --- Дополнительно: Функция выхода ---
  const handleLogout = async () => {
      await supabase.auth.signOut()
      // setSession(null) писать не обязательно, 
      // так как сработает слушатель onAuthStateChange (Часть Б)
  }
 
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

  const deleteMovie = async (urlToDelete) => {
    // 1. Удаляем из Базы Данных (Supabase)
    const { error } = await supabase
            .from('movies')
            .delete()
            .eq('posterUrl', urlToDelete) // Ищем в базе по колонке posterUrl

        if (!error) {
            // 2. Удаляем из Локального Стейта (UI)
            // Ошибка была тут: item.urlToDelete
            // Правильно: item.posterUrl (свойство объекта) !== urlToDelete (переменная)
            setMovies(movies.filter(item => item.poster !== urlToDelete))
        } else {
            alert(error.message)
        }
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
        <select className='form-select bg-white text-dark' value={selectTerm} onChange={selectHandle} name="" id="">
          <option value="">All</option>
          <option value="Фильм">Films</option>
          <option value="Сериал">Series</option>
          <option value="Аниме">Anime</option>
          <option value="Мульт-сериал">Multiplication</option>
          <option value="Аниме-сериал">Anime-series</option>
        </select>
      </div>
      
      {!session ? (
            // Если НЕТ сессии -> Кнопка открытия модалки
            <button className="btn btn-primary col-4" onClick={() => setIsModalOpen(true)}>
               Log In
            </button>
        ) : (
            // Если ЕСТЬ сессия -> Кнопка выхода
            <div className="d-flex gap-2 align-items-center col-4">
               <span>Hi, {session.user.email}</span>
               <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
               </button>
            </div>
        )}
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
        onMovieAdded={() => fetchMovies()} // Перезапрашиваем основную таблицу при успехе
    />
    )}
    <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    <table className="table table-hover">
    <thead>
      <tr className='row'>
        <th className='col-1'>Poster</th>
        <th className='col-2'>Title</th>
        <th className='col-1'>Year</th>
        <th className='col-1'>Rating</th>
        <th className='col-3'>Genre</th>
        <th className='col-1'>Length</th>
        <th className='col-2'>Type</th>
        {!session ? (
          <></>
        ) : (
        <th className='col-1'>Actions</th>
        )}
      </tr>
    </thead>
    <tbody>
      {filteredMovies.map((movie) => (
         <MovieRow 
            key={movie.poster} 
            movie={movie} 
            deleteAction={deleteMovie} session={session}
         />
      ))}
    </tbody>
  </table>
  </div>

  
  )
}

export default App
