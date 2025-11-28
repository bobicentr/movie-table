function MovieRow({ movie, deleteAction }) {
    return (
        <tr className="align-middle">
      <td>
         <img src={ movie.poster } style={{ width: '50px'}} />
      </td>
      <td className="fw-bold">{movie.title}</td>
      <td>{movie.year}</td>
      <td><span className="badge...">{movie.rating}</span></td>
      <td>{movie.genre}</td>
      <td>{movie.length}</td>
      <td>{movie.type}</td>
      <td>
        <button onClick={() => deleteAction(movie.id)}>Delete</button>
      </td>
    </tr>
    )
}

export default MovieRow