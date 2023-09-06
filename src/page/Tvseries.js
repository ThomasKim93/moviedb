import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


export default function TVSeries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTVSeriesData, setAllTVSeriesData] = useState([]);
  const [visibleTVSeries, setVisibleTVSeries] = useState(6); // 초기에 보이는 TV 시리즈 수
  const dbData = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: { api_key: "f89a6c1f22aca3858a4ae7aef10de967" },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [popularRes, topRatedRes, onAirRes] = await Promise.all([
        dbData.get("/tv/popular"),
        dbData.get("/tv/top_rated"),
        dbData.get("/tv/on_the_air"),
      ]);

      const allTVSeries = [
        ...popularRes.data.results,
        ...topRatedRes.data.results,
        ...onAirRes.data.results,
      ];

      setAllTVSeriesData(allTVSeries);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTVSeries = (series) => {
    if (searchQuery === "") {
      return series;
    }
    return series.filter((tvSeries) =>
      tvSeries.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleLoadMore = () => {
    setVisibleTVSeries((prevVisibleTVSeries) => prevVisibleTVSeries + 6);
  };

  const displayedTVSeries = filteredTVSeries(allTVSeriesData).slice(0, visibleTVSeries);

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          placeholder="TV 시리즈 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setSearchQuery("")}>검색</button>
      </div>

      <section className="movie">
        <h2>TV Series</h2>
        <ul className="movie-flex">
          {displayedTVSeries.map((series) => (
            <li key={series.id}>
              <Link to={`/tv/${series.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${series.poster_path}`}
                  alt={series.name}
                />
              </Link>
                <h3>{series.name}</h3>
             
            </li>
          ))}
        </ul>
        {visibleTVSeries < filteredTVSeries(allTVSeriesData).length && (
          <button className="btn" onClick={handleLoadMore}>TV 시리즈 더보기</button>
        )}
      </section>
    </>
  );
}