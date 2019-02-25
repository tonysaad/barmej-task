import React from "react";

const MoviesList = props => (<React.Fragment>
	<h2>{props.title}</h2>
  <ul className="moviesList">
    {(props.movies.map((movie, key) => (
      <li key={`movie-${key}`}>
        <img src={movie.Poster} alt={movie.Title} />
				<h5 className="title">
					{movie.Title} <span className="rating">{movie.imdbRating || movie.Year}</span>
				</h5>
        <span className="genre">{movie.Genre || movie.Type}</span>
        <p className="plot">{movie.Plot}</p>
        <a
          title={(movie.watched) ? `لم يتم مشاهدة ${movie.Title}` : `تمت مشاهدة ${movie.Title}`}
          onClick={() => props.watchToggleFn(movie)}
          className="btn watch"
        >
          <i className={(movie.watched) ? 'fas fa-eye-slash' : 'fas fa-eye'}></i> {(movie.watched) ? 'لم يتم المشاهدة' : 'تمت المشاهدة'}
        </a>
        <a
          title={`Delete ${movie.Title}`}
          onClick={() => props.deleteMovie(movie)}
          className="delete"
        >
          <i className="fas fa-trash-alt"></i>
        </a>
      </li>
    )))}
  </ul>
</React.Fragment>);

export default MoviesList;
