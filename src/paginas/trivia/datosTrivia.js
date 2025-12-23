// ==========================================
// 1. MENSAJES DE FEEDBACK (TIPO MEME/FÚTBOL)
// ==========================================
export const mensajesAcierto = [
    "¡CRACK! Te sabes hasta la talla de los guayos.",
    "¡DOMANDO! Ni MisterChip tiene ese dato.",
    "¡GOLAZO! La clavaste en el ángulo.",
    "¡MAESTRO! Estás para dirigir a la selección.",
    "Sencillito, jugando de taco.",
    "¡CALIDAD PURA! Juegas de smoking.",
    "¡UFFF! Esa la sabía Pelé y tú.",
    "Definición de 'Killer', no perdonas una.",
    "¡Elegancia Francia! Respuesta correcta.",
    "Estás intratable hoy, ¿te tomaste la sopita?",
    "¡A lo Panenka! Con clase.",
    "¡TIKI-TAKA! Pase a la red.",
    "Tienes más fútbol que el televisor.",
    "¡Fenómeno! Te pareces al gordo Ronaldo.",
    "¡Correcto! Pidan el VAR si quieren, fue legal."
];

export const mensajesError = [
    "¡AL PALO! Pero qué burro, póngale cero.",
    "¡PENAL ERRAO! Dedícate al tenis, amigo.",
    "¿Ves fútbol de espaldas o qué?",
    "¡SE TE CONGELÓ EL PECHO! Respuesta incorrecta.",
    "Salí de ahí maravilla, esa no era.",
    "Ni mi abuela fallaba esa...",
    "¡Tronco! Te rebotan hasta los libros.",
    "¡Roja directa! Vete a las duchas.",
    "Fue gol... pero en contra.",
    "¡Ay mi madre el Bicho! Fallaste.",
    "Esa respuesta la dio un hincha de cartón.",
    "¡Pifia monumental! Blooper del año.",
    "Te falta ver más partidos de los 90.",
    "¿Seguro que no eres árbitro? Porque estás ciego.",
    "¡Horrible! Le pegaste con el tobillo."
];

// ==========================================
// 2. BANCO DE 75 PREGUNTAS (ID 1-75)
// ==========================================
export const bancoPreguntas = [
    // --- NIVEL FÁCIL (1-30) ---
    { id: 1, pregunta: "¿Quién es el máximo goleador histórico de los Mundiales?", opciones: ["Pelé", "Ronaldo Nazário", "Miroslav Klose", "Messi"], correcta: "Miroslav Klose" },
    { id: 2, pregunta: "¿Qué país ganó el primer Mundial en 1930?", opciones: ["Brasil", "Uruguay", "Argentina", "Italia"], correcta: "Uruguay" },
    { id: 3, pregunta: "¿Quién es conocido como 'O Rei'?", opciones: ["Maradona", "Pelé", "Cruyff", "Zidane"], correcta: "Pelé" },
    { id: 4, pregunta: "¿En qué año ganó España su único Mundial?", opciones: ["2006", "2010", "2014", "1998"], correcta: "2010" },
    { id: 5, pregunta: "¿Qué jugador dio el cabezazo a Materazzi en 2006?", opciones: ["Totti", "Cannavaro", "Zidane", "Henry"], correcta: "Zidane" },
    { id: 6, pregunta: "¿Quién hizo 'La Mano de Dios'?", opciones: ["Messi", "Maradona", "Kempes", "Riquelme"], correcta: "Maradona" },
    { id: 7, pregunta: "¿Qué selección tiene más Copas del Mundo?", opciones: ["Alemania", "Italia", "Argentina", "Brasil"], correcta: "Brasil" },
    { id: 8, pregunta: "¿Cómo se llama la mascota del Mundial 2014?", opciones: ["Fuleco", "Zakumi", "Naranjito", "Pique"], correcta: "Fuleco" },
    { id: 9, pregunta: "¿Qué país organizó el Mundial de 1994?", opciones: ["Francia", "EE.UU.", "México", "Italia"], correcta: "EE.UU." },
    { id: 10, pregunta: "¿Quién ganó el Balón de Oro en el Mundial 2014?", opciones: ["James Rodríguez", "Thomas Müller", "Lionel Messi", "Neymar"], correcta: "Lionel Messi" },
    { id: 11, pregunta: "¿Qué selección ganó el Mundial de Rusia 2018?", opciones: ["Croacia", "Brasil", "Francia", "Bélgica"], correcta: "Francia" },
    { id: 12, pregunta: "¿Quién fue el goleador del Mundial 2014?", opciones: ["Messi", "Neymar", "James Rodríguez", "Müller"], correcta: "James Rodríguez" },
    { id: 13, pregunta: "¿Qué país fue anfitrión en 2002 junto a Corea del Sur?", opciones: ["China", "Japón", "Tailandia", "Vietnam"], correcta: "Japón" },
    { id: 14, pregunta: "¿Contra quién jugó Argentina la final de Qatar 2022?", opciones: ["Croacia", "Países Bajos", "Francia", "Marruecos"], correcta: "Francia" },
    { id: 15, pregunta: "¿Qué equipo eliminó a Brasil en 2014 con un 7-1?", opciones: ["Holanda", "Argentina", "Alemania", "Francia"], correcta: "Alemania" },
    { id: 16, pregunta: "¿Quién tiene el récord de más partidos en Mundiales?", opciones: ["Matthäus", "Lionel Messi", "Klose", "CR7"], correcta: "Lionel Messi" },
    { id: 17, pregunta: "¿Qué portero tiene el récord de minutos sin recibir gol?", opciones: ["Walter Zenga", "Casillas", "Oliver Kahn", "Buffon"], correcta: "Walter Zenga" },
    { id: 18, pregunta: "¿Qué jugador ha ganado 3 Copas del Mundo?", opciones: ["Maradona", "Cafú", "Pelé", "Beckenbauer"], correcta: "Pelé" },
    { id: 19, pregunta: "¿Quién mordió a Chiellini en el Mundial 2014?", opciones: ["Cavani", "Luis Suárez", "Godín", "Forlán"], correcta: "Luis Suárez" },
    { id: 20, pregunta: "¿De qué nacionalidad era el pulpo Paul?", opciones: ["Español", "Alemán", "Inglés", "Holandés"], correcta: "Alemán" },
    { id: 21, pregunta: "¿Qué país no asistió al primer mundial por el viaje en barco?", opciones: ["Italia", "Brasil", "Uruguay", "Inglaterra"], correcta: "Inglaterra" },
    { id: 22, pregunta: "¿Cómo se llamaba el trofeo anterior a la Copa actual?", opciones: ["Copa América", "Trofeo FIFA", "Jules Rimet", "Copa de Oro"], correcta: "Jules Rimet" },
    { id: 23, pregunta: "¿Qué selección juega de naranja?", opciones: ["Países Bajos", "Costa de Marfil", "Suecia", "Dinamarca"], correcta: "Países Bajos" },
    { id: 24, pregunta: "¿Quién es apodado 'El Fenómeno'?", opciones: ["CR7", "Messi", "Ronaldo Nazário", "Mbappé"], correcta: "Ronaldo Nazário" },
    { id: 25, pregunta: "¿En qué equipo jugaba Maradona en 1986?", opciones: ["Barcelona", "Boca Juniors", "Napoli", "Sevilla"], correcta: "Napoli" },
    { id: 26, pregunta: "¿Qué selección africana llegó a semis en 2022?", opciones: ["Senegal", "Camerún", "Marruecos", "Ghana"], correcta: "Marruecos" },
    { id: 27, pregunta: "¿Quién ganó el Mundial de 1998?", opciones: ["Brasil", "Francia", "Italia", "Croacia"], correcta: "Francia" },
    { id: 28, pregunta: "¿Qué jugador francés anotó 13 goles en un solo Mundial?", opciones: ["Just Fontaine", "Platini", "Henry", "Kopa"], correcta: "Just Fontaine" },
    { id: 29, pregunta: "¿Cuál es el único país que ha jugado todos los Mundiales?", opciones: ["Alemania", "Argentina", "Brasil", "Inglaterra"], correcta: "Brasil" },
    { id: 30, pregunta: "¿Qué técnico dirigió a España en 2010?", opciones: ["Aragonés", "Del Bosque", "Guardiola", "Luis Enrique"], correcta: "Del Bosque" },

    // --- NIVEL MEDIO (31-60) ---
    { id: 31, pregunta: "¿Quién falló el penal decisivo en la final de 1994?", opciones: ["Romario", "Baggio", "Baresi", "Maldini"], correcta: "Baggio" },
    { id: 32, pregunta: "¿Dónde se jugó el Mundial de 1986?", opciones: ["Colombia", "Argentina", "México", "España"], correcta: "México" },
    { id: 33, pregunta: "¿Qué selección es conocida como 'La Azzurra'?", opciones: ["Francia", "Uruguay", "Argentina", "Italia"], correcta: "Italia" },
    { id: 34, pregunta: "¿Quién anotó el gol de la victoria alemana en 2014?", opciones: ["Müller", "Kroos", "Götze", "Klose"], correcta: "Götze" },
    { id: 35, pregunta: "¿Primer país africano en organizar un Mundial?", opciones: ["Egipto", "Nigeria", "Sudáfrica", "Marruecos"], correcta: "Sudáfrica" },
    { id: 36, pregunta: "¿Jugador más viejo en jugar un Mundial (hasta 2018)?", opciones: ["Roger Milla", "Mondragón", "Essam El-Hadary", "Dino Zoff"], correcta: "Essam El-Hadary" },
    { id: 37, pregunta: "¿Qué selección ganó el Mundial de 1978?", opciones: ["Holanda", "Alemania", "Argentina", "Brasil"], correcta: "Argentina" },
    { id: 38, pregunta: "¿Cómo se llama el balón del Mundial 2006?", opciones: ["Jabulani", "Teamgeist", "Brazuca", "Tango"], correcta: "Teamgeist" },
    { id: 39, pregunta: "¿Qué jugador colombiano fue goleador de una Copa América 2001?", opciones: ["Falcao", "Aristizábal", "Asprilla", "Valderrama"], correcta: "Aristizábal" },
    { id: 40, pregunta: "¿Máximo goleador histórico de Uruguay?", opciones: ["Forlán", "Cavani", "Luis Suárez", "Francescoli"], correcta: "Luis Suárez" },
    { id: 41, pregunta: "¿En qué año fue el 'Maracanazo'?", opciones: ["1950", "1954", "1958", "1962"], correcta: "1950" },
    { id: 42, pregunta: "¿Qué jugador es conocido como 'El Bicho'?", opciones: ["Messi", "Ronaldinho", "Cristiano Ronaldo", "Haaland"], correcta: "Cristiano Ronaldo" },
    { id: 43, pregunta: "¿Quién era el DT de Argentina en 2010?", opciones: ["Bielsa", "Pekerman", "Maradona", "Sabella"], correcta: "Maradona" },
    { id: 44, pregunta: "¿Qué equipo son 'Los Diablos Rojos'?", opciones: ["España", "Corea del Sur", "Bélgica", "Chile"], correcta: "Bélgica" },
    { id: 45, pregunta: "¿Quién metió el gol de mano contra Inglaterra en el 86?", opciones: ["Valdano", "Burruchaga", "Maradona", "Ruggeri"], correcta: "Maradona" },
    { id: 46, pregunta: "¿Qué selección ganó la Eurocopa 2004 por sorpresa?", opciones: ["Portugal", "Grecia", "España", "Francia"], correcta: "Grecia" },
    { id: 47, pregunta: "¿Jugador brasileño con corte triangular en 2002?", opciones: ["Rivaldo", "Ronaldinho", "Ronaldo Nazário", "Roberto Carlos"], correcta: "Ronaldo Nazário" },
    { id: 48, pregunta: "¿Quién es 'La Naranja Mecánica'?", opciones: ["Costa de Marfil", "Países Bajos", "Japón", "Australia"], correcta: "Países Bajos" },
    { id: 49, pregunta: "¿Qué selección eliminó a Italia en 2002 con polémica?", opciones: ["Japón", "Corea del Sur", "EE.UU.", "Turquía"], correcta: "Corea del Sur" },
    { id: 50, pregunta: "¿Quién es el arquero apodado 'El Dibu'?", opciones: ["Armani", "Martínez", "Rulli", "Romero"], correcta: "Martínez" },
    { id: 51, pregunta: "¿Quién anotó el gol más rápido de la historia de los Mundiales?", opciones: ["Hakan Şükür", "Pelé", "Dempsey", "Mbappé"], correcta: "Hakan Şükür" },
    { id: 52, pregunta: "¿Cómo se llamó la primera mascota de un Mundial (1966)?", opciones: ["Willie", "Juanito", "Tip and Tap", "Naranjito"], correcta: "Willie" },
    { id: 53, pregunta: "¿Quién es el único portero en ganar el Balón de Oro de un Mundial?", opciones: ["Neuer", "Buffon", "Oliver Kahn", "Casillas"], correcta: "Oliver Kahn" },
    { id: 54, pregunta: "¿En qué estadio se jugó la final de 1950?", opciones: ["Centenario", "Maracaná", "Azteca", "Wembley"], correcta: "Maracaná" },
    { id: 55, pregunta: "¿Qué selección ha perdido más finales (3) sin ganar ninguna?", opciones: ["Países Bajos", "Alemania", "Argentina", "Hungría"], correcta: "Países Bajos" },
    { id: 56, pregunta: "¿Cuál fue el primer equipo africano en ganar un partido en un Mundial?", opciones: ["Egipto", "Túnez", "Camerún", "Nigeria"], correcta: "Túnez" },
    { id: 57, pregunta: "¿Qué jugador tiene el récord de 5 goles en un solo partido?", opciones: ["Oleg Salenko", "Klose", "Fontaine", "Cristiano"], correcta: "Oleg Salenko" },
    { id: 58, pregunta: "¿Quién fue el Balón de Oro del Mundial 2018?", opciones: ["Mbappé", "Modric", "Griezmann", "Hazard"], correcta: "Modric" },
    { id: 59, pregunta: "¿Qué país ganó el Mundial de 1966?", opciones: ["Alemania", "Brasil", "Inglaterra", "Portugal"], correcta: "Inglaterra" },
    { id: 60, pregunta: "¿Quién lesionó a Neymar en el Mundial 2014?", opciones: ["Zúñiga", "Yepes", "Sánchez", "Armero"], correcta: "Zúñiga" },

    // --- NIVEL EXPERTO (61-75) ---
    { id: 61, pregunta: "¿Qué selección fue la primera en llegar a semifinales por Asia?", opciones: ["Japón", "Corea del Sur", "Arabia Saudita", "Corea del Norte"], correcta: "Corea del Sur" },
    { id: 62, pregunta: "¿Quién anotó el gol de la victoria de España en 2010?", opciones: ["Xavi", "Torres", "Iniesta", "Villa"], correcta: "Iniesta" },
    { id: 63, pregunta: "¿En qué año se implementaron las tarjetas amarillas y rojas?", opciones: ["1966", "1970", "1974", "1982"], correcta: "1970" },
    { id: 64, pregunta: "¿Quién fue el capitán de Brasil en el Mundial 2002?", opciones: ["Ronaldo", "Cafú", "Roberto Carlos", "Rivaldo"], correcta: "Cafú" },
    { id: 65, pregunta: "¿Qué jugador alemán ganó el Mundial como jugador y como DT?", opciones: ["Klopp", "Löw", "Beckenbauer", "Matthäus"], correcta: "Beckenbauer" },
    { id: 66, pregunta: "¿Quién fue el goleador del Mundial de México 86?", opciones: ["Maradona", "Lineker", "Careca", "Platini"], correcta: "Lineker" },
    { id: 67, pregunta: "¿Qué selección ganó la medalla de oro en JJ.OO. Río 2016?", opciones: ["Alemania", "Brasil", "Nigeria", "Argentina"], correcta: "Brasil" },
    { id: 68, pregunta: "¿Quién es el máximo goleador histórico de la selección española?", opciones: ["Raúl", "Villa", "Torres", "Morata"], correcta: "Villa" },
    { id: 69, pregunta: "¿Quién marcó el gol 'Fantasma' en la final de 1966?", opciones: ["Charlton", "Hurst", "Moore", "Greaves"], correcta: "Hurst" },
    { id: 70, pregunta: "¿Qué selección sudamericana no ha clasificado nunca a un mundial?", opciones: ["Bolivia", "Venezuela", "Perú", "Ecuador"], correcta: "Venezuela" },
    { id: 71, pregunta: "¿Qué selección ganó el primer Mundial Femenino en 1991?", opciones: ["Noruega", "Alemania", "EE.UU.", "China"], correcta: "EE.UU." },
    { id: 72, pregunta: "¿Quién anotó el gol de título para Alemania en 1990?", opciones: ["Klinsmann", "Matthäus", "Brehme", "Völler"], correcta: "Brehme" },
    { id: 73, pregunta: "¿Qué jugador fue la figura de Colombia en el 5-0 a Argentina?", opciones: ["Higuita", "Valderrama", "Rincón", "Asprilla"], correcta: "Rincón" },
    { id: 74, pregunta: "¿Quién ganó el Mundial de 1954 conocido como 'El Milagro de Berna'?", opciones: ["Hungría", "Alemania", "Brasil", "Suiza"], correcta: "Alemania" },
    { id: 75, pregunta: "¿Qué jugador ghanés falló el penal decisivo contra Uruguay en 2010?", opciones: ["Gyan", "Boateng", "Ayew", "Muntari"], correcta: "Gyan" }
];

// ==========================================
// 3. FUNCIONES INTELIGENTES
// ==========================================
export const obtenerPreguntasAleatorias = (cantidad = 10) => {
    const total = bancoPreguntas.length;
    const indicesSeleccionados = new Set();
    
    // Evitamos bucles infinitos si piden más preguntas de las que hay
    const limite = Math.min(cantidad, total);

    while (indicesSeleccionados.size < limite) {
        const indiceRandom = Math.floor(Math.random() * total);
        indicesSeleccionados.add(indiceRandom);
    }

    // Convertimos los índices en las preguntas reales
    return Array.from(indicesSeleccionados).map(index => bancoPreguntas[index]);
};

export const obtenerMensajeAleatorio = (lista) => {
    if (!lista || lista.length === 0) return "";
    return lista[Math.floor(Math.random() * lista.length)];
};