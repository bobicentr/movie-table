import { useState, useEffect, useRef } from "react";
import { supabase } from "../client.js";

function SuggestBox() {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const formRef = useRef(null);

  const KP_API_KEY = "c2f87bc7-9924-41c2-aca6-bd9a6c014f9d";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${inputValue}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-KEY": KP_API_KEY,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.films && data.films.length > 0) {
        setResults(data.films);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  const handleSelectMovie = async (film) => {
    setShowDropdown(false);
    setInputValue("");

    try {
      const apiPoster = film.posterUrl;
      const searchYear = parseInt(film.year);

      const checkMain = await supabase
        .from("movies")
        .select("posterUrl")
        .eq("year", searchYear);

      if (checkMain.data) {
        const exists = checkMain.data.some((m) => m.posterUrl === apiPoster);
        if (exists) {
          alert("Этот фильм уже есть в коллекции!");
          return;
        }
      }

      const checkOffer = await supabase
        .from("offered_movies")
        .select("posterUrl")
        .eq("year", searchYear);

      if (checkOffer.data) {
        const exists = checkOffer.data.some((o) => o.posterUrl === apiPoster);
        if (exists) {
          alert("Этот фильм уже кто-то предложил!");
          return;
        }
      }

      let formattedTime = null;
      if (film.filmLength && film.filmLength.includes(":")) {
        formattedTime =
          film.filmLength.length === 5
            ? film.filmLength + ":00"
            : film.filmLength;
      }

      const newOffer = {
        name: film.nameRu || film.nameEn || film.nameOriginal,
        year: searchYear,
        posterUrl: apiPoster,
        genres: film.genres.map((g) => g.genre).join(", "),
        rating:
          film.rating && film.rating !== "null" ? film.rating.toString() : "0",
        type: film.type === "TV_SERIES" ? "Сериал" : "Фильм",
        filmLength: formattedTime,
      };

      // --- ОТПРАВКА ---
      const { error } = await supabase
        .from("offered_movies")
        .insert([newOffer]);

      if (error) {
        console.error("Ошибка записи:", error);
        alert("Ошибка: " + error.message);
      } else {
        alert("Спасибо! Ваше предложение отправлено.");
      }
    } catch (error) {
      console.error("Глобальная ошибка:", error);
    }
  };

  return (
    <div className="container mt-5 mb-5 p-4 border rounded">
      <h4>Не нашли любимый фильм?</h4>
      <p className="text-secondary">Предложите его, и мы добавим его в базу.</p>

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
          placeholder="Название фильма (Кинопоиск)..."
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
        />
        <button type="submit" className="btn btn-primary">
          🔍 Найти
        </button>

        {showDropdown && results.length > 0 && (
          <ul
            className="list-group position-absolute w-100"
            style={{ top: "100%", left: 0, zIndex: 1050 }}
          >
            {results.map((film) => (
              <li
                key={film.filmId}
                className="list-group-item list-group-item-action d-flex align-items-center border-secondary"
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectMovie(film)}
              >
                <img
                  src={film.posterUrlPreview}
                  alt={film.nameRu}
                  style={{
                    width: "40px",
                    height: "60px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <div className="fw-bold">{film.nameRu || film.nameEn}</div>
                  <small className="text-muted">
                    {film.year}, {film.genres?.[0]?.genre}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}

export default SuggestBox;
