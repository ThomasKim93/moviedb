import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Movie() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allMovieData, setAllMovieData] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState(6); // 초기에 보이는 영화 수
  const dbData = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: { api_key: "f89a6c1f22aca3858a4ae7aef10de967" },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [popularRes, topRatedRes, upcomingRes] = await Promise.all([
        dbData.get("/movie/popular"),
        dbData.get("/movie/top_rated"),
        dbData.get("/movie/upcoming"),
      ]);

      const allMovies = [
        ...popularRes.data.results,
        ...topRatedRes.data.results,
        ...upcomingRes.data.results,
      ];

      setAllMovieData(allMovies);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMovies = (movies) => {
    if (searchQuery === "") {
      return movies;
    }
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleLoadMore = () => {
    setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 6);
  };

  const displayedMovies = filteredMovies(allMovieData).slice(0, visibleMovies);

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="영화 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setSearchQuery("")}>검색</button>
      </div>

      <section className="movie">
        <h2>MOVIE</h2>
        <ul className="movie-flex">
          {displayedMovies.map((e) => (
            <li key={e.id}>
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w200${e.poster_path}`}
                alt={e.title}
              />
              <h3>{e.title}</h3>
            </li>
          ))}
        </ul>
        {visibleMovies < filteredMovies(allMovieData).length && (
          <button className ="btn" onClick={handleLoadMore}>영화 더보기</button>
        )}
      </section>
    </>
  );
}