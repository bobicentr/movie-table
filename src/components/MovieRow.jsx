function MovieRow({ movie, deleteAction, session }) {
    return (
<tr className="align-middle">
      
      {/* Poster */}
      <td>
         <img 
            src={movie.poster} 
            alt={movie.title}
            style={{ width: '40px', height: '60px', objectFit: 'cover' }} 
         />
      </td>

      {/* Title (Жирный) */}
      <td className="fw-bold text-wrap">{movie.title}</td>

      {/* Year */}
      <td>{movie.year}</td>

      {/* Rating */}
      <td>
        <span className="badge bg-warning text-dark">
            {movie.rating}
        </span>
      </td>

      {/* Genre (text-muted чтобы не рябило в глазах) */}
      <td className="small text-muted">{movie.genre}</td>

      {/* Length */}
      <td className="small">{movie.length}</td>

      {/* Type */}
      <td>{movie.type}</td>

      {/* Actions (Кнопка Delete) */}
      {/* Важно: Если сессии нет, мы просто НЕ рисуем эту ячейку, 
          чтобы количество ячеек совпадало с количеством заголовков */}
      {session && (
        <td>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={() => deleteAction(movie.poster)} // Или movie.id, как у тебя настроено
          >
             <i className="bi bi-trash"></i>
          </button>
        </td>
      )}

    </tr>
    )
}

export default MovieRow