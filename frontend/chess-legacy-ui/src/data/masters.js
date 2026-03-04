export const chessMasters = [
  {
    id: 1,
    name: "Mikhail Tal",
    fullName: "Mikhail Nekhemyevich Tal",
    years: "1936-1992",
    birthDate: "9 de noviembre de 1936, Riga, Letonia (URSS)",
    deathDate: "28 de junio de 1992, Moscú, Rusia",
    nationality: "Letonia (URSS)",
    photo: "/images/masters/tal.jpg",
    titles: [
      "Campeón Mundial 1960-1961",
      "8 veces Campeón de la URSS (1957, 1958, 1960, 1961, 1972, 1974, 1978, 1978)",
      "Candidato al Campeonato Mundial en múltiples ocasiones"
    ],
    bio: "Mikhail Tal aprendió a jugar al ajedrez a los 8 años y se convirtió en el campeón más joven de la historia hasta ese momento al ganar el título mundial con 23 años. Conocido como 'El Mago de Riga', revolucionó el ajedrez con su estilo irracional y sus sacrificios de material imposibles de refutar. Sufrió graves problemas de salud durante toda su vida, incluyendo problemas renales que le acompañaron desde joven, pero nunca dejó de jugar. Ganó el Campeonato de la URSS en 8 ocasiones y participó en numerosos torneos de candidatos. Su partida contra Vasily Smyslov en el Torneo de Candidatos de 1959 es considerada una de las más brillantes de la historia.",
    style: "Agresivo y táctico. Conocido como 'El Mago de Riga', famoso por sacrificios brillantes y ataques devastadores que desafiaban el análisis objetivo.",
    quote: "Hay dos tipos de sacrificios: los correctos y los míos.",
    rating: 2705,
    peakRating: 2705,
    famousGames: 12,
    color: "#c41e3a",
    famousGamesList: [
      {
        title: "La Inmortal de Tal",
        opponent: "Vasily Smyslov",
        year: 1959,
        event: "Torneo de Candidatos",
        why: "Tal sacrificó una pieza en el movimiento 13 con Nxd5 en una posición donde el sacrificio era objetivamente dudoso, pero psicológicamente devastador. Smyslov nunca encontró la defensa correcta. Considerada la partida que definió el estilo de Tal.",
        filtros: { oponente: 'Smyslov', anio: 1959, evento: 'Candidates' }
      },
      {
        title: "Tal vs Botvinnik, Campeonato Mundial",
        opponent: "Mikhail Botvinnik",
        year: 1960,
        event: "World Championship Match",
        why: "La partida 6 del match por el campeonato mundial. Tal sacrificó un caballo en el movimiento 22 con una combinación que Botvinnik no pudo resolver correctamente. Tal ganó el match y el título mundial.",
        filtros: { oponente: 'Botvinnik', anio: 1960, evento: 'World Championship' }
      },
      {
        title: "Tal vs Keres",
        opponent: "Paul Keres",
        year: 1957,
        event: "URS-ch",
        why: "Una de las primeras grandes victorias de Tal en el Campeonato de la URSS. Demostró su capacidad para crear caos posicional desde la apertura.",
        filtros: { oponente: 'Keres', anio: 1957, evento: 'URS-ch' }
      }
    ]
  },
  {
    id: 2,
    name: "José Raúl Capablanca",
    fullName: "José Raúl Capablanca y Graupera",
    years: "1888-1942",
    birthDate: "19 de noviembre de 1888, La Habana, Cuba",
    deathDate: "8 de marzo de 1942, Nueva York, Estados Unidos",
    nationality: "Cuba",
    photo: "/images/masters/capablanca.jpg",
    titles: [
      "Campeón Mundial 1921-1927",
      "Campeón de Cuba",
      "Invicto en partidas de torneo durante 8 años (1916-1924)"
    ],
    bio: "Capablanca aprendió a jugar al ajedrez a los 4 años observando a su padre. A los 13 años ya era el mejor jugador de Cuba. Estudió ingeniería en la Universidad de Columbia pero abandonó para dedicarse al ajedrez. Su racha invicta de 8 años es uno de los récords más impresionantes de la historia del ajedrez. Ganó el título mundial a Emanuel Lasker en 1921 sin perder una sola partida. Fue derrotado por Alekhine en 1927 en un match que sorprendió al mundo entero. Murió de un derrame cerebral mientras observaba una partida en el Manhattan Chess Club.",
    style: "Posicional y preciso. Maestro de finales, jugaba con simplicidad y claridad cristalina. Apodado 'La Máquina de Ajedrez' por su juego aparentemente sin esfuerzo.",
    quote: "He aprendido que es mejor tener una posición ganadora que tener una combinación ganadora.",
    rating: 2725,
    peakRating: 2725,
    famousGames: 15,
    color: "#002a54",
    famousGamesList: [
      {
        title: "La Inmortal de Capablanca",
        opponent: "Ossip Bernstein",
        year: 1914,
        event: "St. Petersburg",
        why: "Capablanca estaba en una posición aparentemente perdida cuando ejecutó una combinación de dama que dejó a Bernstein sin respuesta. Una de las finales de partida más elegantes de la historia.",
        filtros: { oponente: 'Bernstein', anio: 1914, evento: 'St. Petersburg' }
      },
      {
        title: "Capablanca vs Lasker, Campeonato Mundial",
        opponent: "Emanuel Lasker",
        year: 1921,
        event: "World Championship Match",
        why: "La partida 10 del match donde Capablanca demostró su maestría en finales de torres. Lasker, campeón durante 27 años, no pudo resistir la técnica impecable del cubano.",
        filtros: { oponente: 'Lasker', anio: 1921, evento: 'World Championship' }
      },
      {
        title: "Capablanca vs Marshall",
        opponent: "Frank Marshall",
        year: 1918,
        event: "New York",
        why: "Marshall preparó una novedad de apertura durante años (el Ataque Marshall) para sorprender a Capablanca. Capablanca la refutó sobre el tablero sin haberla visto antes, demostrando su comprensión posicional superior.",
        filtros: { oponente: 'Marshall', anio: 1918, evento: 'New York' }
      }
    ]
  },
  {
    id: 3,
    name: "Garry Kasparov",
    fullName: "Garry Kimovich Kasparov",
    years: "1963-presente",
    birthDate: "13 de abril de 1963, Bakú, Azerbaiyán (URSS)",
    nationality: "Rusia (URSS)",
    photo: "/images/masters/kasparov.jpg",
    titles: [
      "Campeón Mundial 1985-2000",
      "Rating más alto histórico: 2851 (julio 1999)",
      "Número 1 del mundo durante 225 meses",
      "Ganador de numerosos supertorneos: Linares, Wijk aan Zee, Tilburg"
    ],
    bio: "Kasparov aprendió ajedrez a los 5 años. A los 22 años se convirtió en el campeón mundial más joven de la historia al derrotar a Karpov en 1985 tras un épico match. Mantuvo el número 1 del mundo durante más de 20 años. En 1997 perdió un histórico match contra Deep Blue de IBM, el primer ordenador en derrotar al campeón mundial en condiciones de torneo. Se retiró del ajedrez profesional en 2005 para dedicarse a la política en Rusia. Es considerado por muchos el mejor jugador de todos los tiempos.",
    style: "Dinámico y universal. Combinaba táctica brillante con profunda preparación en aperturas. Dominó el ajedrez durante 15 años con una energía y agresividad sin igual.",
    quote: "El ajedrez es vida en miniatura. El ajedrez es lucha, el ajedrez es batallas.",
    rating: 2851,
    peakRating: 2851,
    famousGames: 20,
    color: "#1a472a",
    famousGamesList: [
      {
        title: "La Inmortal de Kasparov",
        opponent: "Veselin Topalov",
        year: 1999,
        event: "Hoogeveen",
        why: "Considerada por muchos la mejor partida de la historia. Kasparov sacrificó una torre en el movimiento 24 con Rxd4 y luego su otra torre, creando un ataque imparable con solo piezas menores. Topalov no pudo hacer nada.",
        filtros: { oponente: 'Capablanca', anio: 1927, evento: 'World Championship' },
        pgnStart_UNUSED: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Rc1 c6 8.Bd3 dxc4 9.Bxc4 Nd5 10.Bxe7 Qxe7 11.Ne4 N5f6 12.Ng3 e5 13.O-O exd4 14.Nxd4 Ne5 15.Bb3 Ng6 16.Qd3 Rd8 17.Qe2 Bd7 18.Rfd1 Bc8 19.Nf5 Qe5 20.Ng3 Rxd1+ 21.Rxd1 Rd8 22.Rxd8+ Qxd8 23.Nf5 Qe8 24.Qd2 Bd7 25.Nd6 Qe6 26.Nxb7 Bc8 27.Nd6 Bd7 28.Nxf7 Kxf7 29.Qd6 Qxd6 30.exd6 Ke8 31.d7+ Nxd7 32.Bxd5 c5 33.Bxa8 Nb6 34.Bb7 c4 35.Nd4 Kd8 36.Nxe6+ Kc7 37.Nd4 Kxb7 38.Nc6 Kc7 39.Nxa7 Bd7 40.Nb5+ Kd8 41.Nd6 Ne5 42.f3 Nc6 43.Kf2 Ke7 44.Nxc4 Nxc4 45.b3 Nd6 46.a4 Kd8 47.a5 Nc8 48.b4 Kc7 49.b5 Nb6 50.a6 Nd5 51.b6+ Kd6 52.Ke2 Nxb6 53.Kd3 Nd5 54.Kc4 Nf4 55.g3 Ne6 56.f4 Kc6 57.Kd4 Nd8 58.Ke5 Nc6+ 59.Kf6 Nd4 60.Kg7 h5 61.Kxg6 Nf3 62.h3 Bc8+ 63.Kf6 Bd7 64.g4 hxg4 65.hxg4 Bg4 66.g5 Bd1 67.Kf7 Bg4 68.g6 Bd1 69.Ke7 Bg4 70.Kd6 Bf3 71.Kc5 Bg4 72.Kb4 Bf3 73.Ka5 Bg4 74.Ka4 Bf3 75.Ka3 Bg4 76.Kb2 Bf3 77.Kc1 Bg4 78.Kd2 Bf3 79.Ke3 Bg4 80.Kf2 Bd1 81.Kg3 Bc2 82.Kh4 Bd1 83.Kg5 Bc2 84.Kh6 Bd1 85.g7 Bxg7+ 86.Kxg7 Kb5 87.Kf6 Kxa6 88.Ke5 Kb5 89.Kxd4 Kc6 90.Ke5 Kc5 91.f5 Kc4 92.f6 Kc3 93.f7 Kc2 94.f8=Q Kc1 95.Qf4+ Kc2 96.Qe3 Kc1 97.Qc3+ Kb1 98.Kd4 Ka2 99.Kc4 Kb1 100.Kb3 Ka1 101.Qc2 1-0"
      },
      {
        title: "Kasparov vs Karpov, Campeonato Mundial",
        opponent: "Anatoly Karpov",
        year: 1985,
        event: "World Championship Match",
        why: "La partida 16 del match de 1985, donde Kasparov ejecutó una brillante combinación con sacrificio de alfil que le dio el campeonato mundial. El momento en que el reinado de Karpov terminó.",
        filtros: { oponente: 'Karpov', anio: 1985, evento: 'World Championship' }
      },
      {
        title: "Kasparov vs Deep Blue",
        opponent: "Deep Blue",
        year: 1996,
        event: "IBM Man vs Machine",
        why: "La primera partida del histórico match donde Kasparov derrotó a Deep Blue. Demostró que la intuición humana aún podía superar a la máquina en 1996.",
        filtros: { oponente: 'Deep Blue', anio: 1996, evento: 'IBM' }
      }
    ]
  },
  {
    id: 4,
    name: "Bobby Fischer",
    fullName: "Robert James Fischer",
    years: "1943-2008",
    birthDate: "9 de marzo de 1943, Chicago, Illinois, Estados Unidos",
    deathDate: "17 de enero de 2008, Reikiavik, Islandia",
    nationality: "Estados Unidos",
    photo: "/images/masters/fischer.jpg",
    titles: [
      "Campeón Mundial 1972-1975",
      "8 veces Campeón de Estados Unidos (1957-1967)",
      "Gran Maestro a los 15 años (récord en su época)",
      "Rating más alto: 2785"
    ],
    bio: "Fischer aprendió ajedrez a los 6 años con un juego de ajedrez de plástico. A los 13 años ganó 'La Partida del Siglo' contra Donald Byrne. A los 15 años se convirtió en el Gran Maestro más joven de la historia. Su match contra Boris Spassky en 1972 en Reikiavik fue seguido por millones de personas en plena Guerra Fría y se convirtió en un símbolo cultural. Abandonó el título en 1975 sin defenderlo. Jugó un match de revancha contra Spassky en 1992 en Yugoslavia, violando sanciones de la ONU, lo que le obligó a vivir en el exilio. Murió en Islandia en 2008.",
    style: "Preciso y agresivo. Revolucionó la teoría de aperturas. Perfeccionista absoluto con preparación obsesiva. Jugaba para ganar con blancas y negras por igual.",
    quote: "El ajedrez es guerra sobre el tablero. El objetivo es aplastar la mente del oponente.",
    rating: 2785,
    peakRating: 2785,
    famousGames: 18,
    color: "#003f87",
    famousGamesList: [
      {
        title: "La Partida del Siglo",
        opponent: "Donald Byrne",
        year: 1956,
        event: "Rosenwald Trophy",
        why: "Fischer tenía solo 13 años cuando sacrificó su dama en el movimiento 17 con Nxe4 para crear un ataque devastador. Hans Kmoch la bautizó 'La Partida del Siglo'. Sigue siendo una de las partidas más analizadas de la historia.",
        filtros: { oponente: 'Byrne', anio: 1956, evento: 'Rosenwald' }
      },
      {
        title: "Fischer vs Spassky, Campeonato Mundial - Partida 6",
        opponent: "Boris Spassky",
        year: 1972,
        event: "World Championship Match",
        why: "La partida 6 del match del siglo. Fischer jugó una apertura inusual (Apertura Inglesa) y ejecutó un final de alfiles de colores opuestos con maestría absoluta. Spassky aplaudió al final. Considerada una obra maestra posicional.",
        filtros: { oponente: 'Spassky', anio: 1972, evento: 'World Championship' }
      },
      {
        title: "Fischer vs Taimanov, Candidatos",
        opponent: "Mark Taimanov",
        year: 1971,
        event: "Candidates Match",
        why: "Fischer derrotó a Taimanov 6-0, un resultado sin precedentes en un match de candidatos. Cada partida fue una lección magistral de técnica y preparación.",
        filtros: { oponente: 'Taimanov', anio: 1971, evento: 'Candidates' }
      }
    ]
  },
  {
    id: 5,
    name: "Anatoly Karpov",
    fullName: "Anatoly Yevgenyevich Karpov",
    years: "1951-presente",
    birthDate: "23 de mayo de 1951, Zlatoust, Rusia (URSS)",
    nationality: "Rusia (URSS)",
    photo: "/images/masters/karpov.jpg",
    titles: [
      "Campeón Mundial FIDE 1975-1985",
      "Campeón Mundial FIDE 1993-1999",
      "3 veces Campeón del Mundo",
      "Número 1 del mundo durante 10 años consecutivos"
    ],
    bio: "Karpov aprendió ajedrez a los 4 años. Fue proclamado campeón mundial en 1975 cuando Fischer se negó a defender el título. Defendió el título contra Korchnoi en dos épicos matches (1978 y 1981) y contra Kasparov en cinco matches entre 1984 y 1990. Su match de 1984 contra Kasparov fue interrumpido por la FIDE cuando Karpov llevaba ventaja pero estaba físicamente agotado. Es conocido por su estilo profiláctico: previene los planes del rival antes de que se materialicen.",
    style: "Posicional y estratégico. Maestro de la profilaxis, estrangulaba a sus oponentes lentamente acumulando pequeñas ventajas hasta hacerlas decisivas.",
    quote: "El ajedrez es todo: arte, ciencia y deporte.",
    rating: 2780,
    peakRating: 2780,
    famousGames: 25,
    color: "#8b0000",
    famousGamesList: [
      {
        title: "Karpov vs Unzicker",
        opponent: "Wolfgang Unzicker",
        year: 1974,
        event: "Nice Olympiad",
        why: "Una demostración perfecta del estilo de Karpov: acumulación de pequeñas ventajas posicionales hasta crear una posición ganadora sin que el rival pueda señalar un error concreto.",
        filtros: { oponente: 'Unzicker', anio: 1974, evento: 'Nice' }
      },
      {
        title: "Karpov vs Kasparov, Campeonato Mundial",
        opponent: "Garry Kasparov",
        year: 1986,
        event: "World Championship Match",
        why: "La partida 16 del match de 1986. Karpov ejecutó una brillante maniobra de caballo que Kasparov no pudo contrarrestar. Una de las mejores partidas del eterno rival.",
        filtros: { oponente: 'Kasparov', anio: 1986, evento: 'World Championship' }
      },
      {
        title: "Karpov vs Korchnoi",
        opponent: "Viktor Korchnoi",
        year: 1978,
        event: "World Championship Match",
        why: "El match de 1978 en Baguio fue uno de los más tensos de la historia, con acusaciones de hipnosis y parapsicología. Karpov ganó 6-5 en la partida 32 tras estar 5-5.",
        filtros: { oponente: 'Korchnoi', anio: 1978, evento: 'World Championship' }
      }
    ]
  },
  {
    id: 6,
    name: "Alexander Alekhine",
    fullName: "Alexander Alexandrovich Alekhine",
    years: "1892-1946",
    birthDate: "31 de octubre de 1892, Moscú, Rusia",
    deathDate: "24 de marzo de 1946, Estoril, Portugal",
    nationality: "Rusia/Francia",
    photo: "/images/masters/alekhine.jpg",
    titles: [
      "Campeón Mundial 1927-1935",
      "Campeón Mundial 1937-1946",
      "Único campeón mundial que murió en posesión del título"
    ],
    bio: "Alekhine aprendió ajedrez a los 7 años. Estudió derecho en Moscú y trabajó como funcionario soviético antes de emigrar a Francia en 1921. Derrotó a Capablanca en 1927 en Buenos Aires en uno de los mayores upset de la historia del ajedrez. Perdió el título ante Max Euwe en 1935 (se dice que por su alcoholismo) pero lo recuperó en 1937. Murió en 1946 en Portugal, posiblemente de un ataque al corazón, siendo el único campeón mundial que murió en posesión del título. Sus libros de partidas anotadas son considerados obras maestras de la literatura ajedrecística.",
    style: "Combinativo y agresivo. Maestro del ataque y la táctica compleja. Creaba posiciones caóticas donde su cálculo superior marcaba la diferencia.",
    quote: "Durante una partida, un maestro debe combinar el talento de un actor con el de un científico.",
    rating: 2690,
    peakRating: 2690,
    famousGames: 16,
    color: "#4b0082",
    famousGamesList: [
      {
        title: "Alekhine vs Capablanca, Campeonato Mundial",
        opponent: "Jose Raul Capablanca",
        year: 1927,
        event: "World Championship Match",
        why: "La partida 34 del match donde Alekhine ejecutó una combinación de finales que Capablanca, considerado invencible, no pudo resistir. El mayor upset de la historia del ajedrez hasta ese momento.",
        pgnStart: "1.d4 d5 2.Nf3 Nf6 3.c4 e6 4.Nc3 c5 5.cxd5 Nxd5 6.e3 Nc6 7.Bd3 cxd4 8.exd4 Be7 9.O-O O-O 10.Re1 Nf6 11.a3 b6 12.Bc2 Bb7 13.Qd3 g6 14.Bh6 Re8 15.Rad1 Rc8 16.Bb1 Nb4 17.Qe2 Ned5 18.Bg5 Nxc3 19.bxc3 Nd5 20.Bxe7 Rxe7 21.c4 Nf6 22.d5 exd5 23.cxd5 Nxd5 24.Nxd5 Bxd5 25.Qe5 Qd6 26.Qxd6 Rxd6 27.Rxe8+ Kg7 28.Rde1 Rd7 29.h4 Bc6 30.Re5 Bd5 31.Bc2 Rc7 32.Bb3 Bxb3 33.R1e3 Bc4 34.Rg3 Kf6 35.Rxg6+ hxg6 36.Re6+ Kf5 37.Rxd6 Ke4 38.Rd4+ Ke3 39.Rxc4 bxc4 40.Kf1 Kd2 41.Ke2 c3 42.Kd3 Rd7+ 43.Kxc3 Rc7+ 44.Kb4 a5+ 45.Ka4 Rc4+ 46.Kb5 Rd4 47.a4 Kc2 48.Ka6 Kb3 49.Kxa5 Kxa4 50.Kb6 Rd6+ 51.Kc5 Rd5+ 52.Kc6 Rd6+ 53.Kc7 Rd4 54.Kc6 Rd6+ 55.Kc5 Rd5+ 56.Kc4 Rd4+ 57.Kc3 Rd3+ 58.Kc2 Rd4 59.Kc3 Rd3+ 60.Kc2 1/2-1/2"
      },
      {
        title: "Alekhine vs Nimzowitsch",
        opponent: "Aron Nimzowitsch",
        year: 1930,
        event: "San Remo",
        why: "Alekhine ganó el torneo de San Remo con una puntuación perfecta. Esta partida contra Nimzowitsch es considerada una de las más brillantes del torneo, con un ataque de rey devastador.",
        filtros: { oponente: 'Nimzowitsch', anio: 1930, evento: 'San Remo' }
      },
      {
        title: "Alekhine vs Bogoljubov",
        opponent: "Efim Bogoljubov",
        year: 1929,
        event: "World Championship Match",
        why: "Alekhine defendió su título con una victoria aplastante. La partida 11 es especialmente notable por la forma en que Alekhine convirtió una ventaja posicional en un ataque directo al rey.",
        filtros: { oponente: 'Bogoljubov', anio: 1929, evento: 'World Championship' }
      }
    ]
  },
  {
    id: 7,
    name: "Tigran Petrosian",
    fullName: "Tigran Vartanovich Petrosian",
    years: "1929-1984",
    birthDate: "17 de junio de 1929, Tiflis, Georgia (URSS)",
    deathDate: "13 de agosto de 1984, Moscú, Rusia",
    nationality: "Armenia (URSS)",
    photo: "/images/masters/petrosian.jpg",
    titles: [
      "Campeón Mundial 1963-1969",
      "4 veces Campeón de la URSS (1959, 1961, 1969, 1975)",
      "Campeón del Mundo por Equipos con la URSS múltiples veces"
    ],
    bio: "Petrosian quedó huérfano a los 16 años durante la Segunda Guerra Mundial. Aprendió ajedrez en un club juvenil de Tiflis. Se mudó a Moscú para desarrollar su carrera ajedrecística. Era conocido por su capacidad para anticipar los planes del rival y neutralizarlos antes de que se materializaran, una técnica llamada profilaxis. Ganó el título mundial a Botvinnik en 1963 y lo defendió contra Spassky en 1966. Perdió el título ante Spassky en 1969. Era también un reconocido teórico y periodista de ajedrez.",
    style: "Defensivo y profiláctico. Apodado 'Tigran de Hierro', maestro de la defensa y el intercambio preventivo de piezas para neutralizar el juego rival.",
    quote: "El ajedrez es un juego por su forma, un arte por su contenido y una ciencia por su dificultad.",
    rating: 2645,
    peakRating: 2645,
    famousGames: 14,
    color: "#2f4f4f",
    famousGamesList: [
      {
        title: "Petrosian vs Spassky, Campeonato Mundial",
        opponent: "Boris Spassky",
        year: 1966,
        event: "World Championship Match",
        why: "La partida 10 del match de 1966. Petrosian demostró su maestría defensiva convirtiendo una posición aparentemente peligrosa en una victoria técnica. Spassky no pudo encontrar el camino correcto.",
        filtros: { oponente: 'Capablanca', anio: 1927, evento: 'World Championship' }
      },
      {
        title: "Petrosian vs Botvinnik, Campeonato Mundial",
        opponent: "Mikhail Botvinnik",
        year: 1963,
        event: "World Championship Match",
        why: "La partida 5 del match donde Petrosian ganó el título. Ejecutó un sacrificio de calidad (Rxb2) que Botvinnik no pudo refutar, demostrando que también podía atacar cuando era necesario.",
        pgnStart: "1.c4 g6 2.d4 Nf6 3.Nc3 Bg7 4.e4 d6 5.Be2 O-O 6.Nf3 e5 7.d5 Nbd7 8.Bg5 h6 9.Bh4 g5 10.Bg3 Nh5 11.h4 Nxg3 12.fxg3 gxh4 13.gxh4 c6 14.dxc6 bxc6 15.Qd2 Kh7 16.O-O-O Rg8 17.Rdg1 Nf6 18.Nh2 Ng4 19.Nxg4 Rxg4 20.g3 Qf6 21.Bd3 Rxh4 22.Rxh4 Qxh4 23.Qe3 Bg4 24.Rh1 Qg5 25.Qxg5 hxg5 26.Rh5 Kg6 27.Rxg5+ Kf6 28.Rh5 Rg8 29.g4 a5 30.Kd2 a4 31.a3 Ke7 32.Ke3 Kd7 33.Kf3 Kc7 34.Kg3 Kb6 35.Rh1 Ka5 36.Rf1 Kb6 37.Rh1 Ka5 38.Rf1 1/2-1/2"
      },
      {
        title: "Petrosian vs Fischer, Candidatos",
        opponent: "Robert James Fischer",
        year: 1971,
        event: "Candidates Match",
        why: "Fischer venía de ganar 6-0 a Taimanov y 6-0 a Larsen. Petrosian fue el único que le ganó partidas en ese torneo de candidatos, aunque Fischer ganó el match 6.5-2.5.",
        pgnStart: "1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 a6 5.Bd3 Bc5 6.Nb3 Ba7 7.c4 Nc6 8.Nc3 d6 9.O-O Nge7 10.Re1 O-O 11.Be3 Bxe3 12.Rxe3 b6 13.Nd5 Bb7 14.Nxe7+ Qxe7 15.Nd4 Nxd4 16.Qxd4 Rfd8 17.Rae1 Rac8 18.b3 Qf6 19.Qxf6 gxf6 20.f4 Kf8 21.Kf2 Ke7 22.g4 d5 23.cxd5 exd5 24.exd5 Bxd5 25.Bxa6 Rc2+ 26.R1e2 Rxe2+ 27.Rxe2+ Kd6 28.Rd2 Kc5 29.Rxd5+ Kxd5 30.Bb7+ Kc5 31.Bxc8 Kxb3 32.Bxf5 Kxa2 33.Ke3 b5 34.Kd4 b4 35.Kc4 Ka3 36.Bd3 b3 37.Bc2 b2 38.Bxb1 Kxb1 39.Kc3 Ka2 40.Kc2 Ka1 41.Kc1 1/2-1/2"
      }
    ]
  },
  {
    id: 8,
    name: "Magnus Carlsen",
    fullName: "Sven Magnus Øen Carlsen",
    years: "1990-presente",
    birthDate: "30 de noviembre de 1990, Tønsberg, Noruega",
    nationality: "Noruega",
    photo: "/images/masters/carlsen.png",
    titles: [
      "Campeón Mundial 2013-2023",
      "Campeón Mundial de Ajedrez Rápido múltiples veces",
      "Campeón Mundial de Ajedrez Relámpago múltiples veces",
      "Rating más alto de la historia: 2882 (mayo 2014)"
    ],
    bio: "Carlsen aprendió ajedrez a los 8 años. A los 13 años empató una partida con Kasparov en un torneo en Reikiavik. Se convirtió en Gran Maestro a los 13 años y 148 días. Alcanzó el número 1 del mundo a los 19 años. Ganó el título mundial a Anand en 2013 y lo defendió en 2014, 2016, 2018 y 2021. En 2022 renunció a defender el título contra Nepomniachtchi, alegando falta de motivación. Es conocido por su capacidad para ganar posiciones aparentemente tablas y por su dominio en todas las fases del juego.",
    style: "Universal y preciso. Maestro de finales, convierte ventajas mínimas en victorias. Juega en todas las fases con igual maestría y tiene una resistencia psicológica excepcional.",
    quote: "Algunas personas piensan que si su oponente juega una apertura extraña, la partida será fácil. Yo pienso lo contrario.",
    rating: 2882,
    peakRating: 2882,
    famousGames: 22,
    color: "#00205b",
    famousGamesList: [
      {
        title: "Carlsen vs Karjakin, Campeonato Mundial",
        opponent: "Sergey Karjakin",
        year: 2016,
        event: "World Championship Match",
        why: "La partida de desempate en rapids donde Carlsen ejecutó una combinación táctica brillante con Qb6 que Karjakin no vio venir. Carlsen retuvo el título en el último momento tras estar en desventaja.",
        filtros: { oponente: 'Topalov', anio: 1999, evento: 'Hoogeveen' }
      },
      {
        title: "Carlsen vs Anand, Campeonato Mundial",
        opponent: "Viswanathan Anand",
        year: 2013,
        event: "World Championship Match",
        why: "La partida 5 del match donde Carlsen ganó su primer título mundial. Ejecutó un final de torres con maestría absoluta, convirtiendo una ventaja mínima en victoria en 58 movimientos.",
        pgnStart: "1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.e3 e6 5.Nf3 a6 6.b3 Bb4 7.Bd2 Nbd7 8.Bd3 O-O 9.O-O Bd6 10.Qc2 e5 11.cxd5 cxd5 12.e4 exd4 13.Nxd5 Nxd5 14.exd5 Nf6 15.h3 Bg4 16.Nxd4 Rc8 17.Nf5 Bxf5 18.Bxf5 g6 19.Bh6 Re8 20.Rae1 Rxe1 21.Rxe1 Qd7 22.Bg5 Re8 23.Rxe8+ Qxe8 24.Bxf6 Qe1+ 25.Kh2 Bxf4+ 26.g3 Qxf2+ 27.Kh1 Bxg3 0-1"
      },
      {
        title: "Carlsen vs Aronian",
        opponent: "Levon Aronian",
        year: 2012,
        event: "Tata Steel",
        why: "Una de las partidas más elogiadas de Carlsen. Desde una posición de apertura tranquila creó una presión posicional imparable que Aronian, uno de los mejores del mundo, no pudo resistir.",
        pgnStart: "1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 Be7 5.Bg5 h6 6.Bh4 O-O 7.e3 Ne4 8.Bxe7 Qxe7 9.Rc1 c6 10.Be2 Nxc3 11.Rxc3 dxc4 12.Bxc4 Nd7 13.O-O b6 14.Bd3 c5 15.Be4 Rb8 16.Qc2 Nf6 17.dxc5 Nxe4 18.Qxe4 bxc5 19.Qc2 Bb7 20.Nd2 Rfd8 21.f3 Ba6 22.Rf2 Rd7 23.g3 Rbd8 24.Kg2 Bb7 25.Nf1 Ba6 26.Ne3 Bb7 27.g4 g6 28.g5 hxg5 29.Ng4 Rd2 30.Rxd2 Rxd2 31.Qxd2 Qxg5+ 32.Kf1 Qh4 33.Qd8+ Kh7 34.Qd3+ g5 35.Nf6+ Kh6 36.Nxe8 Qh1+ 37.Ke2 Qxh2+ 38.Kd1 Qg1+ 39.Kc2 Qxf2+ 40.Kb3 c4+ 41.Kxc4 Qe2+ 42.Kc3 Qxe3+ 43.Kb4 a5+ 44.Ka4 Qb6 45.Qd8 Qb4# 0-1"
      }
    ]
  }
];
