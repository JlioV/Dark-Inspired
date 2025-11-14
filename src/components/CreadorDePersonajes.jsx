import React, { useEffect, useRef, useState, useCallback } from "react";
import Historiador from "./Historiador";
import { useAuth } from "../AuthContext";

const CATEGORIES = [
  { key: "cuerpo", label: "Cuerpo" },
  { key: "cara", label: "Cara" },
  { key: "arma", label: "Arma" },
  { key: "armadura", label: "Armadura" },
  { key: "pelo", label: "Pelo" },
];

const DEFAULT_RESOURCES = [
  { id: "c1", tipo: "cuerpo", nombre: "Cuerpo común", src: "/assets/cuerpo/cuerpo1.png" },
  { id: "f1", tipo: "cara", nombre: "Cicatriz", src: "/assets/cara/cara1.png" },
    { id: "f2", tipo: "cara", nombre: "Sonrisa", src: "/assets/cara/cara2.png" },
    { id: "f3", tipo: "cara", nombre: "Loquito", src: "/assets/cara/cara3.png" },
    { id: "f4", tipo: "cara", nombre: "Chino", src: "/assets/cara/cara4.png" },
    

  { id: "w1", tipo: "arma", nombre: "Espada", src: "/assets/arma/arma1.png" },
  { id: "w2", tipo: "arma", nombre: "Baston de mago", src: "/assets/arma/arma2.png" },
   { id: "w3", tipo: "arma", nombre: "Lanza", src: "/assets/arma/arma3.png" },
    { id: "w4", tipo: "arma", nombre: "Daga", src: "/assets/arma/arma4.png" },
     { id: "w5", tipo: "arma", nombre: "Espadon", src: "/assets/arma/arma5.png" },
      { id: "w6", tipo: "arma", nombre: "Hacha", src: "/assets/arma/arma6.png" },
       { id: "w7", tipo: "arma", nombre: "Sable", src: "/assets/arma/arma7.png" },
        { id: "w8", tipo: "arma", nombre: "Martillo", src: "/assets/arma/arma8.png" },
  
  { id: "a1", tipo: "armadura", nombre: "Cuero Negro", src: "/assets/armadura/armadura1.png" },
    { id: "a2", tipo: "armadura", nombre: "Placas", src: "/assets/armadura/armadura2.png" },
      { id: "a3", tipo: "armadura", nombre: "Paladin", src: "/assets/armadura/armadura3.png" },
        { id: "a4", tipo: "armadura", nombre: "Traje de mago", src: "/assets/armadura/armadura4.png" },
          { id: "a5", tipo: "armadura", nombre: "Romana", src: "/assets/armadura/armadura5.png" },

  { id: "h1", tipo: "pelo", nombre: "Rapado", src: "/assets/pelo/pelo1.png" },
   { id: "h2", tipo: "pelo", nombre: "Librito", src: "/assets/pelo/pelo2.png" },
    { id: "h3", tipo: "pelo", nombre: "Moderno", src: "/assets/pelo/pelo3.png" },
      { id: "h4", tipo: "pelo", nombre: "Largo", src: "/assets/pelo/pelo4.png" },
        { id: "h5", tipo: "pelo", nombre: "Emo", src: "/assets/pelo/pelo5.png" },

];

function getInitialSelection(resources) {
  const selection = {};
  ["cuerpo", "cara", "arma", "armadura", "pelo"].forEach((k) => {
    const candidate = resources.find((r) => r.tipo === k);
    selection[k] = candidate ? candidate.id : null;
  });
  return selection;
}

export default function CreadorDePersonajes({
  personajeInicial = null,
}) {
  const { user } = useAuth() || {};

  const displayName =
    (user && (user.username || user.email)) || "Invitado";

  const [resources] = useState(DEFAULT_RESOURCES);
  const initialSelection = getInitialSelection(resources);

  const [selection, setSelection] = useState(
    personajeInicial?.capas ?? initialSelection
  );
  const [characterName, setCharacterName] = useState(
    personajeInicial?.nombre_personaje ?? ""
  );
  const [characterStory, setCharacterStory] = useState(""); // historia que se manda a Historiador

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [personajeIdGuardado, setPersonajeIdGuardado] = useState(
    personajeInicial?.id_personaje ?? null
  );

  const canvasRef = useRef(null);
  const [canvasSize] = useState({ w: 512, h: 512 });

  const resourcesByCategory = useCallback(
    (cat) => resources.filter((r) => r.tipo === cat),
    [resources]
  );

  useEffect(() => {
    if (personajeInicial) {
      setSelection(personajeInicial.capas || initialSelection);
      setCharacterName(personajeInicial.nombre_personaje || "");
      setPersonajeIdGuardado(personajeInicial.id_personaje || null);
    } else {
      setSelection(initialSelection);
      setCharacterName("");
      setPersonajeIdGuardado(null);
    }
  }, [personajeInicial]);

  // Render del canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    setImagesLoaded(false);

   const orderedTypes = ["arma", "cuerpo", "cara", "pelo", "armadura"];

    const imgs = [];
    let loaded = 0;

    orderedTypes.forEach((type) => {
      const id = selection[type];
      const res = resources.find((r) => r.id === id);
      if (res && res.src) {
        const img = new Image();
        img.src = res.src;
        img.onload = () => {
          loaded++;
          if (loaded === imgs.length) {
            ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
            orderedTypes.forEach((t) => {
              const r = resources.find((rr) => rr.id === selection[t]);
              if (r && r.src) {
                const im = new Image();
                im.src = r.src;
                ctx.drawImage(im, 0, 0, canvasSize.w, canvasSize.h);
              }
            });
            setImagesLoaded(true);
          }
        };
        imgs.push(img);
      }
    });

    if (imgs.length === 0) setImagesLoaded(true);
  }, [selection, resources, canvasSize]);

  const handleSelect = (category, id) => {
    setSelection((prev) => ({ ...prev, [category]: id }));
  };

  const saveCharacter = async () => {
    if (!user) return alert("Debes iniciar sesión.");
    if (!characterName.trim()) return alert("Poné un nombre.");

    setSaveStatus("saving");

    const canvas = canvasRef.current;
    const imageData = canvas?.toDataURL("image/png") ?? null;

    const payload = {
      id_usuario: user.id,
      nombre_personaje: characterName,
      cuerpo: selection.cuerpo,
      cara: selection.cara,
      pelo: selection.pelo,
      armadura: selection.armadura,
      arma: selection.arma,
      zoom: 512,
      imageData,
    };

    try {
      let res;
      let data;

      if (personajeIdGuardado) {
        res = await fetch(
          `http://localhost:3001/api/personajes/${personajeIdGuardado}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch("http://localhost:3001/api/personajes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      data = await res.json();

      if (!res.ok) setSaveStatus("error");
      else {
        setSaveStatus("success");
        if (!personajeIdGuardado) setPersonajeIdGuardado(data.id_personaje);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }

    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className="creator-view">
      <header className="creator-header">
        <div className="creator-title">
          <h2>Creador de Personajes</h2>
          {user && (
            <div className="creator-user">
              
            </div>
          )}

          <div className="save-area">
            <input
              placeholder="Nombre del personaje"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />

            <button onClick={saveCharacter} className="save-btn">
              {saveStatus === "saving"
                ? "Guardando..."
                : personajeIdGuardado
                ? "Actualizar Personaje"
                : "Guardar Personaje"}
            </button>
          </div>
        </div>
      </header>

      <main className="creator-main">
        <section className="canvas-area">
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
          />
        </section>

        <section className="parts-area">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="category-block">
              <h4>{cat.label}</h4>
              <div className="options-row">
                {resourcesByCategory(cat.key).map((r) => (
                  <button
                    key={r.id}
                    className={`part-btn ${
                      selection[cat.key] === r.id ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(cat.key, r.id)}
                  >
                    <img src={r.src} alt={r.nombre} />
                    <div className="part-name">{r.nombre}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Sección historia */}
      <Historiador
        personajeId={personajeIdGuardado}
        nombre={characterName}
        historia={characterStory}
        onChangeNombre={setCharacterName}
        onChangeHistoria={setCharacterStory}
      />
    </div>
  );
}
