import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Hero.css";
const Hero = () => {
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // NEW STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    homeworld: "",
    film: "",
    species: "",
  });

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://swapi.dev/api/people/");
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data = await res.json();
      setCharacters(data.results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleNext = () => {
    if (currentIndex < filteredCharacters.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  // 🔍 Combined Search + Filter Logic
  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      const matchesSearch = char.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesHomeworld = filter.homeworld
        ? char.homeworld.includes(filter.homeworld)
        : true;

      const matchesFilm = filter.film
        ? char.films.some((film) => film.includes(filter.film))
        : true;

      const matchesSpecies = filter.species
        ? char.species.some((sp) => sp.includes(filter.species))
        : true;

      return matchesSearch && matchesHomeworld && matchesFilm && matchesSpecies;
    });
  }, [characters, searchTerm, filter]);

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const character = filteredCharacters[currentIndex];

  return (
    <div className="app">
      <h1 className="title">Star Wars Characters</h1>

      {/* 🔹 Search & Filter Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filter.homeworld}
          onChange={(e) =>
            setFilter((f) => ({ ...f, homeworld: e.target.value }))
          }
        >
          <option value="">Filter by Homeworld</option>
          <option value="1">Tatooine</option>
          <option value="2">Alderaan</option>
          <option value="3">Yavin IV</option>
        </select>

        <select
          value={filter.film}
          onChange={(e) => setFilter((f) => ({ ...f, film: e.target.value }))}
        >
          <option value="">Filter by Film</option>
          <option value="1">A New Hope</option>
          <option value="2">The Empire Strikes Back</option>
        </select>

        <select
          value={filter.species}
          onChange={(e) =>
            setFilter((f) => ({ ...f, species: e.target.value }))
          }
        >
          <option value="">Filter by Species</option>
          <option value="1">Human</option>
          <option value="2">Droid</option>
        </select>
      </div>

      {character ? (
        <div
          className="character-card single"
          onClick={() => handleCardClick(character)}
        >
          <img
            src={`https://picsum.photos/300?random=${currentIndex}`}
            alt={character.name}
          />
          <h3>{character.name}</h3>
        </div>
      ) : (
        <p>No characters found.</p>
      )}

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          ⬅ Prev
        </button>
        <span>
          {currentIndex + 1} / {filteredCharacters.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredCharacters.length - 1}
        >
          Next ➡
        </button>
      </div>

      {selectedCharacter && (
        <Sidebar character={selectedCharacter} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Hero;
