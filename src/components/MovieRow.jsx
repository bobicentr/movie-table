function MovieRow({ movie, deleteAction, session }) {
  return (
    <tr className="align-middle">
      <td>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{ width: "40px", height: "60px", objectFit: "cover" }}
        />
      </td>

      <td className="fw-bold text-wrap">{movie.title}</td>

      <td>{movie.year}</td>

      <td>
        <span className="badge bg-warning text-dark">{movie.rating}</span>
      </td>

      <td className="small text-muted">{movie.genre}</td>

      <td className="small">{movie.length}</td>

      <td>{movie.type}</td>
      {session && (
        <td>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => deleteAction(movie.poster)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </td>
      )}
    </tr>
  );
}

export default MovieRow;
