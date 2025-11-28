import { useState, useEffect } from 'react'
import { supabase } from '../client.js'

function OfferedMoviesTable({ onMovieAdded }) {
    const [offers, setOffers] = useState([])

    useEffect(() => {
        fetchOffers()
    }, [])

    const fetchOffers = async () => {
        const { data, error } = await supabase
            .from('offered_movies')
            .select('*')
        
        if (data) {
            setOffers(data)
        }
        else {
            console.log(error.message)
        }
    }

    const handleReject = async (posterUrl) => {
        const { error } = await supabase
            .from('offered_movies')
            .delete()
            .eq('posterUrl', posterUrl)

        if (!error) {
            setOffers(offers.filter(item => item.posterUrl !== posterUrl))
        } else {
            alert(error.message)
        }
    }

    const handleApprove = async (offer) => {
        const cleanMovie = {
            name: offer.name,
            posterUrl: offer.posterUrl, // Убедись, что берем именно posterUrl
            year: offer.year,
            genres: offer.genres,
            rating: offer.rating,
            filmLength: offer.filmLength,
            type: offer.type
        }

        // 2. Вставляем чистый объект
        const { error: insertError } = await supabase
            .from('movies')
            .insert([cleanMovie])

        if (insertError) {
            // Код 23505 означает "Нарушение уникальности" (дубликат)
            if (insertError.code === '23505' || insertError.message.includes('unique constraint')) {
                alert("⚠️ Этот фильм УЖЕ есть в базе (совпал постер). Заявка будет удалена автоматически.")
                
                // Просто удаляем заявку, так как фильм и так уже есть
                await handleReject(offer.posterUrl) 
                return
            }

            // Любая другая ошибка
            alert("Ошибка при добавлении: " + insertError.message)
            return
        }

        // 3. Если успех — удаляем из предложений
        await handleReject(offer.posterUrl)
        
        // 4. Обновляем экран
        if (onMovieAdded) onMovieAdded()
    }

    if (offers.length === 0) return null

    return (
        <div className="mt-5 mb-5">
            <h4 className="text-white mb-3">🔥 Заявки на добавление ({offers.length})</h4>
            <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                    <thead>
                        <tr>
                            <th style={{width: '60px'}}>Poster</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Info</th>
                            <th style={{width: '150px'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer) => (
                            <tr>
                                <td>
                                    <img 
                                        src={offer.posterUrl} 
                                        alt={offer.name} 
                                        style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td className="fw-bold">{offer.name}</td>
                                <td>{offer.year}</td>
                                <td>
                                    <small className="d-block text-muted">{offer.type}</small>
                                    <small>{offer.genres}</small>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleApprove(offer)}
                                            title="Одобрить"
                                        >
                                            <i className="bi bi-check-lg"></i>
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleReject(offer.posterUrl)}
                                            title="Отклонить"
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OfferedMoviesTable