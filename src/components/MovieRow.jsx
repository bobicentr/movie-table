function MovieRow({ movie, deleteAction, session }) {
    return (
        <tr className="align-middle row">
      <td className="col-1 text-wrap">
         <img src={ movie.poster } style={{ width: '50px'}} />
      </td>
      <td className="fw-bold col-2 text-wrap">{movie.title}</td>
      <td className="col-1">{movie.year}</td>
      <td className="col-1"><span className="badge...">{movie.rating}</span></td>
      <td className="col-3">{movie.genre}</td>
      <td className="col-2">{movie.length}</td>
      <td className="col-1">{movie.type}</td>
      {!session ? (
          <></>
        ) : (
          <td className="col-1">
          <button onClick={() => deleteAction(movie.poster)}>Delete</button>
        </td>
        )}

    </tr>
    )
}

export default MovieRow