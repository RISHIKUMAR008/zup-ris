import React, { useEffect, useState } from "react";
import { format } from "date-fns";
const Sidebar = ({ character, onClose }) => {
  const [homeworld, setHomeworld] = useState(null);

  useEffect(() => {
    const fetchHomeworld = async () => {
      try {
        const res = await fetch(character.homeworld);
        const data = await res.json();
        setHomeworld(data);
      } catch {
        setHomeworld(null);
      }
    };

    if (character?.homeworld) {
      fetchHomeworld();
    }
  }, [character.homeworld]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{character.name}</h2>
        <p>
          <strong>Height:</strong> {(character.height / 100).toFixed(2)} m
        </p>
        <p>
          <strong>Mass:</strong> {character.mass} kg
        </p>
        <p>
          <strong>Date Added:</strong>{" "}
          {format(new Date(character.created), "dd-MM-yyyy")}
        </p>
        <p>
          <strong>Films Count:</strong> {character.films.length}
        </p>
        <p>
          <strong>Birth Year:</strong> {character.birth_year}
        </p>

        {homeworld ? (
          <>
            <h3>Homeworld Details</h3>
            <p>
              <strong>Name:</strong> {homeworld.name}
            </p>
            <p>
              <strong>Terrain:</strong> {homeworld.terrain}
            </p>
            <p>
              <strong>Climate:</strong> {homeworld.climate}
            </p>
            <p>
              <strong>Population:</strong> {homeworld.population}
            </p>
          </>
        ) : (
          <p>Loading homeworld...</p>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
