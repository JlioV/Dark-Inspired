// src/views/PersonajesView.jsx
import React, { useState } from "react";
import CreadorDePersonajes from "../components/CreadorDePersonajes";
import Galeria from "../components/Galeria";

export default function PersonajesView() {
  const [personajeEnEdicion, setPersonajeEnEdicion] = useState(null);

  const handleEditCharacter = (personaje) => {
    setPersonajeEnEdicion(personaje);
  };

  return (
    <div className="personajes-page">
      <div className="personajes-layout">
        <CreadorDePersonajes personajeInicial={personajeEnEdicion} />
        <Galeria onEditCharacter={handleEditCharacter} />
      </div>
    </div>
  );
}
