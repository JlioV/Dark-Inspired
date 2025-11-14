import React, { useState } from "react";
import Header from "./components/Header";
import CreadorDePersonajes from "./components/CreadorDePersonajes";
import Galeria from "./components/Galeria";
import Historiador from "./components/Historiador";
import Historias from "./components/Historias";
import Footer from "./components/Footer";


import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";

export default function App() {
  const [currentView, setCurrentView] = useState("creator");
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const [personajeEditando, setPersonajeEditando] = useState(null);

  const handleEditCharacter = (personaje) => {
    setPersonajeEditando(personaje);
    setCurrentView("creator");
  };

  return (
    <>
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        openLogin={() => setLoginOpen(true)}
        openRegister={() => setRegisterOpen(true)}
      />

      {currentView === "creator" && (
        <CreadorDePersonajes personajeInicial={personajeEditando} />
      )}

      {currentView === "gallery" && (
        <Galeria onEditCharacter={handleEditCharacter} />
      )}

      {currentView === "stories" && (
        <Historias onEditCharacter={handleEditCharacter} />
      )}

      {/* Vista aislada del historiador si la necesitaras */}
      {currentView === "history" && <Historiador />}
      
      <Footer />


      <LoginModal visible={loginOpen} close={() => setLoginOpen(false)} />
      <RegisterModal visible={registerOpen} close={() => setRegisterOpen(false)} 
        />
    </>
    
  );
}
