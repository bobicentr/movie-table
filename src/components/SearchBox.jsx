import { useState, useEffect, useRef } from "react"

function SearchBox({ addAction }) {
    const [inputValue, setInputValue] = useState('')
    const [results, setResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const formRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setShowDropdown(false) 
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        try {
            const url = `https://www.omdbapi.com/?apikey=284ea34a&s=${inputValue}`
            const response = await fetch(url)
            const data = await response.json()

            if (data.Search) {
                setResults(data.Search)
                setShowDropdown(true)
            } else {
                setResults([])
                setShowDropdown(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const selectMovie = async (imdbID) => {
        try {
            const url = `https://www.omdbapi.com/?apikey=284ea34a&i=${imdbID}`
            const response = await fetch(url)
            const fullData = await response.json()

            addAction(fullData)

            setInputValue('')
            setResults([])
            setShowDropdown(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <nav className="navbar navbar-light bg-light mb-4">
            <div className="container-fluid">
                <a href="#" className="navbar-brand">My Film Watchlist</a>
                
                <form 
                    ref={formRef} 
                    className="d-flex position-relative" 
                    onSubmit={handleSearch}
                >
                    <input 
                        type="search" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        className="form-control me-2" 
                        placeholder="Movie title..."
                        onFocus={() => { if(results.length > 0) setShowDropdown(true) }}
                    />
                    <button type="submit" className="btn btn-outline-success">Search</button>

                    {showDropdown && results.length > 0 && (
                        <ul className="list-group position-absolute w-100" style={{ top: '100%', left: 0, zIndex: 1050 }}>
                            {results.map((movie) => (
                                <li 
                                    key={movie.imdbID} 
                                    className="list-group-item list-group-item-action d-flex align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => selectMovie(movie.imdbID)}
                                >
                                    {movie.Poster !== "N/A" ? (
                                        <img 
                                            src={movie.Poster} 
                                            alt={movie.Title} 
                                            style={{ width: '40px', height: '60px', objectFit: 'cover', marginRight: '10px' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '40px', height: '60px', background: '#eee', marginRight: '10px' }}></div>
                                    )}
                                    <div>
                                        <div className="fw-bold">{movie.Title}</div>
                                        <small className="text-muted">{movie.Year}</small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            </div>
        </nav>
    )
}

export default SearchBox