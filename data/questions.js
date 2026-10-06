// All learning content is local. Correct answers stay separate from the presentation.
const choices = (prefix, rows) => rows.map((row, i) => ({ id: `${prefix}-${i + 1}`, question: row[0], answers: row[1], correct: 0, explanation: row[2], difficulty: row[3] || 1 }));

const detectiveTexts = [
  ['Un día junto al mar', '[[ayer|Ayer|Una oración comienza con mayúscula.]] fui [[ala|a la|La preposición «a» y el artículo «la» se escriben separados.]] playa con mi hermana. El agua estaba muy [[fria|fría|La tilde marca el hiato de la palabra «fría».]] y el sol iluminaba la arena.'],
  ['La mochila de Lía', 'Lía [[preparo|preparó|«Preparó» es una palabra aguda terminada en vocal.]] su mochila para la aventura. Guardó una [[brujula|brújula|Las palabras esdrújulas siempre llevan tilde.]], una linterna y un [[lapiz|lápiz|«Lápiz» es llana y no termina en vocal, n ni s.]].'],
  ['Una invitación', '[[hola|Hola|El saludo inicia la oración con mayúscula.]], Martín. Te invito a mi [[conpleaños|cumpleaños|Se escribe «cumpleaños», con u y con m antes de p.]] el sábado. Trae tu juego [[faborito|favorito|«Favorito» se escribe con v.]].'],
  ['El jardín secreto', 'Detrás del castillo [[avia|había|El verbo «haber» se escribe con h y aquí lleva tilde.]] un jardín. Las [[flores|flores,|Una enumeración separa sus elementos con comas.]] los árboles y las fuentes [[parecian|parecían|«Parecían» lleva tilde por el hiato í-a.]] de otro mundo.'],
  ['La primera pista', 'Dentro del cofre encontramos un [[mensage|mensaje|Las palabras terminadas en -aje se escriben con j.]]. Decía que el tesoro estaba cerca del [[arbol|árbol|«Árbol» es llana y termina en l.]] más [[antiguo|antiguo.|La oración necesita un punto final.]]'],
  ['La biblioteca', 'Los libros [[estavan|estaban|Las formas en -aba del pretérito imperfecto se escriben con b.]] ordenados por colores. En un rincón, [[sofia|Sofía|Los nombres propios comienzan con mayúscula; «Sofía» lleva tilde.]] leía una historia [[fantastica|fantástica|«Fantástica» es esdrújula.]].'],
  ['Una noche de estrellas', 'El cielo estaba [[despejado|despejado.|La siguiente oración necesita separarse con un punto.]] Nos sentamos a observar las estrellas. Mi abuelo [[señalo|señaló|En pasado, «señaló» es aguda y termina en vocal.]] una [[constelacion|constelación|Las agudas terminadas en n llevan tilde.]].'],
  ['El pequeño huerto', 'En el huerto sembramos [[sanaorias|zanahorias|«Zanahoria» se escribe con z y h intercalada.]]. Cada mañana las [[regavamos|regábamos|«Regábamos» se escribe con b y es esdrújula.]] con agua. Pronto [[crecieron|crecieron.|El párrafo termina con un punto.]]'],
  ['Viaje en tren', '[[el|El|La palabra inicia una oración: debe comenzar con mayúscula.]] tren salió temprano. Por la ventana vimos un [[rio|río|La vocal cerrada tónica forma un hiato y lleva tilde.]] y una montaña. El viaje fue [[maraviyoso|maravilloso|«Maravilloso» se escribe con ll.]].'],
  ['El teatro del pueblo', 'Mi amiga [[isabel|Isabel|Los nombres de personas comienzan con mayúscula.]] participó en una obra de teatro. Su personaje era una [[eroina|heroína|«Heroína» se escribe con h y lleva tilde por el hiato.]] muy [[valiente|valiente.|La oración necesita un punto final.]]'],
  ['La receta', 'Para preparar el pastel necesitamos [[arina|harina|«Harina» se escribe con h inicial.]], leche y huevos. Después añadimos [[azucar|azúcar|«Azúcar» es llana y termina en r.]]. La mezcla quedó [[delisiosa|deliciosa|«Deliciosa» se escribe con c.]].'],
  ['Una carta lejana', 'Ayer [[recivi|recibí|«Recibir» se escribe con b; «recibí» lleva tilde.]] una carta de mi prima. Ahora vive en [[colombia|Colombia|Los nombres de países comienzan con mayúscula.]]. Me contó que su nueva escuela es [[enorme|enorme.|Hace falta un punto al final.]]'],
  ['El refugio', 'La lluvia [[comenso|comenzó|«Comenzó» se escribe con z y lleva tilde.]] de repente. Buscamos refugio bajo un [[techo|techo.|Hay que separar las dos oraciones con un punto.]] Allí escuchamos una [[cancion|canción|«Canción» es aguda y termina en n.]].'],
  ['El mapa perdido', 'El mapa [[tenia|tenía|«Tenía» lleva tilde para marcar el hiato.]] una cruz roja. [[nosotros|Nosotros|Después de punto se escribe mayúscula.]] seguimos el camino hasta una [[cueba|cueva|«Cueva» se escribe con v.]].'],
  ['Una gran noticia', '[[mañana|Mañana|La primera palabra de una oración comienza con mayúscula.]] visitaremos el museo. Nuestra profesora nos [[esplico|explicó|«Explicó» se escribe con x y lleva tilde.]] que veremos objetos de hace [[muchisimos|muchísimos|«Muchísimos» es esdrújula y lleva tilde.]] años.']
];
export const detective = detectiveTexts.map(([title, text], i) => ({ id: `detective-${i + 1}`, title, text, difficulty: i < 6 ? 1 : i < 11 ? 2 : 3 }));

export const escapeRoom = [
  { text: 'Lía entró en la biblioteca buscando un mapa. Al cruzar el umbral, la puerta se cerró. Una nota decía: «Solo quien comprende lo que lee encuentra la salida».', question: '¿Qué debe hacer Lía para salir?', answers: ['Comprender los textos y resolver las pistas', 'Romper todas las ventanas', 'Esperar a que amanezca', 'Encontrar una espada'], clue: 'La primera llave está escondida entre las palabras.', explanation: 'La nota explica de forma directa la condición para encontrar la salida.' },
  { text: 'Desde un estante, el viento susurró un secreto. Las páginas despertaron y saludaron a la viajera.', question: '¿Qué recurso da cualidades humanas al viento y a las páginas?', answers: ['Personificación', 'Comparación', 'Hipérbole', 'Onomatopeya'], clue: 'Busca el estante donde los libros parecen hablar.', explanation: 'Susurrar secretos y saludar son acciones humanas atribuidas a elementos no humanos.' },
  { text: 'Un libro azul brillaba como una estrella. Lía lo abrió y encontró el dibujo de una luna.', question: '¿Qué recurso aparece en «brillaba como una estrella»?', answers: ['Comparación', 'Personificación', 'Hipérbole', 'Ironía'], clue: 'Sigue el símbolo de la luna.', explanation: 'Se comparan dos elementos mediante la palabra «como».' },
  { text: 'Seguí a Lía hasta la escalera. Yo llevaba la lámpara y ella sostenía el libro. No sabía qué nos esperaba arriba.', question: '¿Qué tipo de narrador cuenta este fragmento?', answers: ['Un personaje en primera persona', 'Un narrador omnisciente en tercera persona', 'Un narrador en segunda persona', 'Una voz que no participa'], clue: 'La lámpara revela una escalera oculta.', explanation: '«Seguí», «yo» y «no sabía» muestran que un personaje relata su experiencia.' },
  { text: 'La escalera estaba cubierta de polvo, pero había huellas recientes. Lía escuchó pasos al otro lado de la pared.', question: '¿Qué se puede inferir de estas señales?', answers: ['Alguien ha pasado por allí hace poco', 'Nadie ha entrado en cien años', 'La escalera acaba de construirse', 'Lía está al aire libre'], clue: 'Las huellas conducen a un reloj detenido.', explanation: 'Las huellas recientes y los pasos sugieren la presencia de alguien más.' },
  { text: '«Para cuidar los libros, usa un separador y evita doblar las páginas. Devuélvelos a su sitio después de leer», indicaba un cartel junto al reloj.', question: '¿Cuál es la intención principal del cartel?', answers: ['Dar instrucciones para cuidar los libros', 'Contar una aventura', 'Describir a Lía', 'Hacer reír al lector'], clue: 'El separador del libro rojo guarda otro símbolo.', explanation: 'Los verbos «usa», «evita» y «devuélvelos» presentan instrucciones.' },
  { text: 'Bajo la luna de papel,\nun río de tinta corría;\ncada palabra era un farol\nque la noche encendía.', question: 'Por su organización en versos, ¿a qué género pertenece?', answers: ['Poesía', 'Noticia', 'Manual de instrucciones', 'Artículo científico'], clue: 'Cuatro versos señalan el cuarto cajón.', explanation: 'El texto está organizado en versos y emplea lenguaje expresivo y figurado.' },
  { text: 'Lía encontró tres llaves: una oxidada, una rota y una dorada. La cerradura tenía el mismo símbolo de sol que la llave dorada.', question: '¿Qué llave parece adecuada para abrir la cerradura?', answers: ['La dorada', 'La rota', 'La oxidada', 'Ninguna, porque no hay cerradura'], clue: 'La llave del sol abre el escritorio.', explanation: 'El símbolo compartido relaciona la llave dorada con la cerradura.' },
  { text: 'GUARDIÁN: Has llegado lejos.\nLÍA: Solo quiero volver al valle.\nGUARDIÁN: Entonces lee la última página.\n(El guardián se aparta de la puerta).', question: '¿Qué rasgo es propio de un texto teatral?', answers: ['Diálogos y una acotación entre paréntesis', 'Datos ordenados en una tabla', 'Una lista de ingredientes', 'Un narrador que describe todos los pensamientos'], clue: 'La última página está detrás del retrato.', explanation: 'Los nombres introducen diálogos y la acotación indica una acción escénica.' },
  { text: 'Lía unió los símbolos y leyó el mensaje: «Compartir lo que aprendemos abre más puertas que guardar el saber». Entregó el mapa al guardián y la salida se iluminó.', question: '¿Qué enseñanza resume el desenlace?', answers: ['El conocimiento crece cuando se comparte', 'Los mapas siempre deben ocultarse', 'Aprender no ayuda a resolver problemas', 'Las bibliotecas no tienen salida'], clue: '¡El saber compartido abre la puerta!', explanation: 'El mensaje final y la acción de compartir el mapa expresan esa enseñanza.' }
].map((q, i) => ({ ...q, id: `escape-${i + 1}`, correct: 0, difficulty: Math.min(3, Math.floor(i / 4) + 1) }));

export const synonyms = choices('synonym', [
  ['Rápido', ['Veloz', 'Lento', 'Quieto', 'Pesado'], '«Veloz» y «rápido» expresan velocidad.'],
  ['Alegre', ['Contento', 'Triste', 'Serio', 'Enojado'], '«Alegre» y «contento» expresan felicidad.'],
  ['Valiente', ['Audaz', 'Cobarde', 'Débil', 'Indeciso'], 'Alguien audaz se atreve a afrontar dificultades.'],
  ['Enorme', ['Gigantesco', 'Diminuto', 'Estrecho', 'Breve'], 'Ambas palabras indican un tamaño muy grande.'],
  ['Hermoso', ['Bello', 'Feo', 'Roto', 'Sucio'], '«Hermoso» y «bello» expresan belleza.'],
  ['Comenzar', ['Iniciar', 'Terminar', 'Detener', 'Olvidar'], 'Iniciar es dar comienzo a algo.'],
  ['Terminar', ['Concluir', 'Empezar', 'Continuar', 'Repetir'], 'Concluir significa llegar al final.'],
  ['Camino', ['Sendero', 'Destino', 'Mochila', 'Reloj'], 'Un sendero es un camino, normalmente estrecho.'],
  ['Silencioso', ['Callado', 'Ruidoso', 'Musical', 'Veloz'], 'Callado y silencioso indican ausencia de ruido.'],
  ['Ayudar', ['Colaborar', 'Impedir', 'Molestar', 'Abandonar'], 'Colaborar es contribuir o ayudar en una tarea.'],
  ['Observar', ['Mirar', 'Ocultar', 'Dormir', 'Olvidar'], 'Observar es mirar con atención.'],
  ['Sencillo', ['Simple', 'Complicado', 'Difícil', 'Confuso'], 'Lo sencillo tiene poca complicación.'],
  ['Difícil', ['Complicado', 'Fácil', 'Sencillo', 'Evidente'], 'Algo complicado presenta dificultades.'],
  ['Antiguo', ['Viejo', 'Moderno', 'Nuevo', 'Reciente'], 'Ambas palabras pueden referirse a algo de mucho tiempo atrás.'],
  ['Brillante', ['Resplandeciente', 'Opaco', 'Oscuro', 'Apagado'], 'Lo resplandeciente emite o refleja mucha luz.'],
  ['Amable', ['Cordial', 'Hostil', 'Brusco', 'Desatento'], 'Una persona cordial muestra amabilidad.'],
  ['Escaso', ['Insuficiente', 'Abundante', 'Infinito', 'Excesivo'], 'Algo escaso puede ser insuficiente para lo que se necesita.'],
  ['Fuerte', ['Robusto', 'Frágil', 'Débil', 'Delicado'], 'Robusto significa fuerte o resistente.'],
  ['Tranquilo', ['Sereno', 'Agitado', 'Nervioso', 'Inquieto'], 'Sereno describe un estado de calma.'],
  ['Generoso', ['Dadivoso', 'Tacaño', 'Egoísta', 'Avaro'], 'Dadivoso es quien da con generosidad.', 2],
  ['Descubrir', ['Hallar', 'Esconder', 'Perder', 'Cubrir'], 'Hallar es encontrar algo que se buscaba o se desconocía.'],
  ['Prudente', ['Cauteloso', 'Temerario', 'Imprudente', 'Atrevido'], 'La cautela y la prudencia ayudan a evitar riesgos.', 2],
  ['Fugaz', ['Breve', 'Eterno', 'Duradero', 'Permanente'], 'Algo fugaz dura poco tiempo.', 3],
  ['Perseverante', ['Constante', 'Inconstante', 'Distraído', 'Apático'], 'La perseverancia consiste en mantener el esfuerzo.', 2],
  ['Nítido', ['Claro', 'Borroso', 'Confuso', 'Difuso'], 'Lo nítido se distingue con claridad.', 2]
]);

export const sentences = [
  ['La luna ilumina el camino.', 1], ['Los niños juegan en el parque.', 1], ['Mi hermana lee un cuento.', 1], ['El pájaro construye su nido.', 1], ['Las estrellas brillan esta noche.', 1],
  ['Nuestra maestra explica la lección.', 1], ['Una mariposa visita las flores.', 1], ['El viento mueve las hojas.', 1], ['Lía encontró una llave dorada.', 1], ['Tu abuelo prepara el desayuno.', 1],
  ['Después de clase visitaremos la biblioteca.', 2], ['Los exploradores cruzaron el río con cuidado.', 2], ['Cada mañana escucho el canto de los pájaros.', 2], ['Mi mejor amiga escribe poemas muy hermosos.', 2], ['La pequeña tortuga avanzó lentamente hacia el agua.', 2],
  ['Aunque llovía mucho, decidimos continuar nuestro viaje.', 3], ['Cuando terminó la tormenta, apareció un hermoso arcoíris.', 3], ['El libro que me prestaste contiene historias fascinantes.', 3], ['Si cuidamos la naturaleza, construiremos un futuro mejor.', 3], ['Mientras Lía leía el mapa, su compañero encendió la linterna.', 3]
].map(([answer, difficulty], i) => ({ id: `sentence-${i + 1}`, answer, tokens: answer.split(' '), difficulty }));

export const literature = choices('literature', [
  ['Un hidalgo manchego sale a vivir aventuras con su escudero Sancho Panza. ¿De qué obra se trata?', ['Don Quijote de la Mancha', 'La Celestina', 'Lazarillo de Tormes', 'La vida es sueño'], 'Don Quijote y Sancho Panza son los protagonistas de la novela de Cervantes.'],
  ['¿Quién escribió Don Quijote de la Mancha?', ['Miguel de Cervantes', 'Federico García Lorca', 'Gustavo Adolfo Bécquer', 'Félix María Samaniego'], 'Miguel de Cervantes publicó las dos partes en 1605 y 1615.'],
  ['¿Cómo se llama el escudero de don Quijote?', ['Sancho Panza', 'Rocinante', 'Segismundo', 'Lázaro'], 'Sancho Panza acompaña a don Quijote; Rocinante es su caballo.'],
  ['Un joven relata sus experiencias al servicio de varios amos, entre ellos un ciego. ¿Qué obra es?', ['Lazarillo de Tormes', 'Don Juan Tenorio', 'Fuenteovejuna', 'La Celestina'], 'Lázaro cuenta su vida y lo que aprende al servir a distintos amos.'],
  ['¿Quién es el autor de Lazarillo de Tormes?', ['Es anónimo', 'Miguel de Cervantes', 'Lope de Vega', 'José Zorrilla'], 'Lazarillo de Tormes se publicó de forma anónima.'],
  ['Calisto y Melibea son personajes centrales de…', ['La Celestina', 'La vida es sueño', 'Rimas', 'El conde Lucanor'], 'La Celestina narra la historia de Calisto y Melibea y la intervención de Celestina.'],
  ['¿Con qué autor se asocia La Celestina?', ['Fernando de Rojas', 'Pedro Calderón de la Barca', 'Antonio Machado', 'Rubén Darío'], 'Fernando de Rojas es el autor asociado tradicionalmente a La Celestina.'],
  ['Segismundo, un príncipe encerrado en una torre, protagoniza…', ['La vida es sueño', 'Fuenteovejuna', 'Lazarillo de Tormes', 'Don Quijote de la Mancha'], 'Segismundo es el protagonista de La vida es sueño, de Calderón de la Barca.'],
  ['¿Quién escribió La vida es sueño?', ['Pedro Calderón de la Barca', 'Fernando de Rojas', 'Gustavo Adolfo Bécquer', 'Miguel de Cervantes'], 'La vida es sueño es una obra teatral de Calderón de la Barca.'],
  ['¿Qué autor escribió la obra teatral Fuenteovejuna?', ['Lope de Vega', 'José Zorrilla', 'Rubén Darío', 'Jorge Manrique'], 'Fuenteovejuna es una obra de Lope de Vega.'],
  ['Rimas y leyendas es una colección asociada a…', ['Gustavo Adolfo Bécquer', 'Félix María Samaniego', 'Fernando de Rojas', 'Don Juan Manuel'], 'Bécquer es conocido por sus poemas, las Rimas, y sus relatos, las Leyendas.'],
  ['¿Quién escribió las Coplas a la muerte de su padre?', ['Jorge Manrique', 'Lope de Vega', 'José Zorrilla', 'Miguel de Cervantes'], 'Jorge Manrique compuso las Coplas como elegía por la muerte de su padre.'],
  ['El conde Lucanor pide consejo a un personaje que responde con relatos. ¿Cómo se llama ese consejero?', ['Patronio', 'Sancho', 'Rocinante', 'Calisto'], 'Patronio aconseja al conde Lucanor mediante cuentos con enseñanza.'],
  ['¿Quién escribió Don Juan Tenorio?', ['José Zorrilla', 'Pedro Calderón de la Barca', 'Fernando de Rojas', 'Jorge Manrique'], 'Don Juan Tenorio es una obra teatral de José Zorrilla.'],
  ['En una fábula, una cigarra no se prepara para el invierno, mientras una hormiga trabaja. ¿Qué es una moraleja?', ['La enseñanza del relato', 'El nombre del autor', 'Una indicación teatral', 'El título de un capítulo'], 'La moraleja expresa la enseñanza que se extrae de una fábula.']
]);

export const accents = choices('accent', [
  ['Elige la escritura correcta de «camion».', ['Camión', 'Cámion', 'Camíon', 'Camion'], '«Camión» es aguda y termina en n.'],
  ['Elige la escritura correcta de «arbol».', ['Árbol', 'Arból', 'Arbol', 'Árból'], '«Árbol» es llana y termina en una consonante distinta de n o s.'],
  ['Elige la escritura correcta de «musica».', ['Música', 'Musíca', 'Musicá', 'Musica'], '«Música» es esdrújula; todas las esdrújulas llevan tilde.'],
  ['¿Qué palabra es aguda?', ['Café', 'Mesa', 'Árbol', 'Música'], 'En «café» la sílaba tónica es la última: fé.'],
  ['¿Qué palabra es llana o grave?', ['Lápiz', 'Canción', 'Sofá', 'Teléfono'], 'La sílaba tónica de «lápiz» es la penúltima.'],
  ['¿Qué palabra es esdrújula?', ['Pájaro', 'Papel', 'Reloj', 'Casa'], 'La sílaba tónica de «pájaro» es la antepenúltima.'],
  ['Elige la escritura correcta.', ['Dígamelo', 'Digámelo', 'Digamelo', 'Digameló'], '«Dígamelo» es sobresdrújula: la sílaba tónica está antes de la antepenúltima.', 3],
  ['Elige la escritura correcta de «pais».', ['País', 'Páis', 'Pais', 'Páís'], 'La tilde en la í marca el hiato a-í.'],
  ['Elige la escritura correcta del sustantivo singular «rio».', ['Río', 'Rió', 'Rio', 'Ríos'], 'El sustantivo «río» lleva tilde en la í por el hiato.'],
  ['¿Cuál contiene un diptongo?', ['Ciudad', 'País', 'Poeta', 'Teatro'], 'En «ciudad», iu forma un diptongo: las dos vocales pertenecen a una sílaba.'],
  ['¿Cuál contiene un hiato?', ['Poeta', 'Causa', 'Aire', 'Puente'], 'Dos vocales abiertas forman hiato: po-e-ta.'],
  ['Elige la escritura correcta de «facil».', ['Fácil', 'Facíl', 'Facil', 'Fácíl'], '«Fácil» es llana y termina en l.'],
  ['Elige la escritura correcta de «corazon».', ['Corazón', 'Córazon', 'Corázon', 'Corazon'], '«Corazón» es aguda y termina en n.'],
  ['Elige la escritura correcta de «telefono».', ['Teléfono', 'Télefono', 'Telefóno', 'Telefonó'], '«Teléfono» es esdrújula.'],
  ['¿Qué palabra está bien escrita?', ['Joven', 'Jóven', 'Jovén', 'Jóvén'], '«Joven» es llana terminada en n: no lleva tilde.'],
  ['Elige el plural correcto de «joven».', ['Jóvenes', 'Jovenes', 'Jovénes', 'Jovenés'], '«Jóvenes» es esdrújula, por eso sí lleva tilde.'],
  ['¿Qué oración usa correctamente «tú» o «tu»?', ['Tú eres una gran exploradora.', 'Tu eres una gran exploradora.', 'Tú mochila es verde.', 'Olvidaste tú cuaderno.'], 'El pronombre personal «tú» lleva tilde diacrítica; el posesivo «tu» no.'],
  ['¿Qué oración utiliza correctamente el posesivo «tu»?', ['Este es tu cuaderno.', 'Este es tú cuaderno.', 'Tu llegaste temprano.', 'Solo tu conoces la salida.'], 'El posesivo «tu» acompaña a un sustantivo y no lleva tilde.'],
  ['¿Qué oración utiliza correctamente «él» o «el»?', ['Él llegó antes que nosotros.', 'El llegó antes que nosotros.', 'Él camino es largo.', 'Abre él libro.'], 'El pronombre personal «él» lleva tilde; el artículo «el» no.'],
  ['¿Qué oración utiliza correctamente «más» para expresar cantidad?', ['Quiero un poco más de agua.', 'Quiero un poco mas de agua.', 'Quiero más de agua un poco.', 'Un agua de más quiero poco.'], '«Más», cuando expresa cantidad, lleva tilde.'],
  ['Elige la escritura correcta de «baul».', ['Baúl', 'Bául', 'Baul', 'Báúl'], 'La ú tónica forma hiato con la a y lleva tilde.'],
  ['Elige la escritura correcta de «despues».', ['Después', 'Déspues', 'Despúes', 'Despues'], '«Después» es aguda terminada en s; la tilde del diptongo se pone en la vocal abierta.'],
  ['¿Qué palabra NO necesita tilde?', ['Reloj', 'Camion', 'Arbol', 'Lapiz'], '«Reloj» es aguda, pero termina en j.'],
  ['¿Qué palabra es sobresdrújula?', ['Cuéntamelo', 'Cuéntame', 'Cuenta', 'Contó'], 'En «cuéntamelo» la sílaba tónica es anterior a la antepenúltima.', 3],
  ['Elige la escritura correcta de «oceano».', ['Océano', 'Óceano', 'Oceáno', 'Oceanó'], '«Océano» tiene cuatro sílabas (o-cé-a-no) y es esdrújula.', 2]
]);

export const forbidden = [
  ['Biblioteca', ['libro', 'leer', 'estantería'], ['libros', 'lectura', 'lecturas']],
  ['Escuela', ['estudiante', 'profesor', 'clase'], ['alumno', 'profesora', 'alumna']],
  ['Sol', ['estrella', 'calor', 'luz'], []], ['Lluvia', ['agua', 'nube', 'mojar'], ['mojado', 'mojada']],
  ['Bicicleta', ['rueda', 'pedal', 'montar'], ['pedales', 'pedalear']], ['Amistad', ['amigo', 'compañía', 'cariño'], ['amiga']],
  ['Castillo', ['rey', 'torre', 'fortaleza'], ['reina', 'reyes']], ['Mariposa', ['ala', 'insecto', 'volar'], []],
  ['Océano', ['mar', 'agua', 'ola'], ['mares']], ['Reloj', ['hora', 'tiempo', 'minuto'], []],
  ['Mochila', ['espalda', 'guardar', 'bolsa'], []], ['Música', ['sonido', 'canción', 'instrumento'], ['canciones']],
  ['Teléfono', ['llamar', 'hablar', 'pantalla'], ['llamada']], ['Chocolate', ['cacao', 'dulce', 'comer'], []],
  ['Bosque', ['árbol', 'naturaleza', 'verde'], ['árboles']], ['Estrella', ['cielo', 'noche', 'brillar'], ['brillo']],
  ['Espejo', ['reflejo', 'mirar', 'imagen'], ['reflejar']], ['Brújula', ['norte', 'orientar', 'dirección'], ['orientación']],
  ['Poema', ['verso', 'rima', 'poesía'], ['rimar']], ['Aventura', ['viaje', 'explorar', 'peligro'], ['exploración']]
].map(([word, forbidden, variants], i) => ({ id: `forbidden-${i + 1}`, word, forbidden, variants, difficulty: i < 10 ? 1 : 2 }));

const elements = rows => rows.map(([label, ...keys]) => ({ label, keys }));
export const storyElements = {
  character: elements([['Una astrónoma', 'astrónoma'], ['Un jardinero', 'jardinero'], ['Una exploradora', 'exploradora'], ['Un dragón amable', 'dragón'], ['Una inventora', 'inventora'], ['Un zorro curioso', 'zorro'], ['Una bibliotecaria', 'bibliotecaria'], ['Un músico', 'músico'], ['Una capitana', 'capitana'], ['Un robot', 'robot'], ['Una pintora', 'pintora'], ['Un panadero', 'panadero'], ['Una detective', 'detective'], ['Un búho', 'búho'], ['Una niña valiente', 'niña']]),
  place: elements([['Un castillo abandonado', 'castillo'], ['Una isla flotante', 'isla'], ['Un bosque luminoso', 'bosque'], ['Una biblioteca secreta', 'biblioteca'], ['Una montaña nevada', 'montaña'], ['Un pueblo costero', 'pueblo'], ['Un jardín gigante', 'jardín'], ['Una estación espacial', 'estación'], ['Un museo', 'museo'], ['Una cueva de cristal', 'cueva'], ['Un desierto', 'desierto'], ['Un faro', 'faro'], ['Una ciudad submarina', 'ciudad'], ['Un teatro antiguo', 'teatro'], ['Un planeta lejano', 'planeta']]),
  conflict: elements([['Una desaparición misteriosa', 'desaparición', 'desapareció', 'desaparecido'], ['Un mapa perdido', 'mapa'], ['Una tormenta inesperada', 'tormenta'], ['Un reloj detenido', 'reloj'], ['Un secreto por descubrir', 'secreto'], ['Un puente roto', 'puente'], ['Una promesa difícil', 'promesa'], ['Un mensaje sin remitente', 'mensaje'], ['Una puerta cerrada', 'puerta'], ['Una sombra extraña', 'sombra'], ['Un hechizo accidental', 'hechizo'], ['Un sonido desconocido', 'sonido'], ['Una competición', 'competición'], ['Un tesoro escondido', 'tesoro'], ['Un recuerdo olvidado', 'recuerdo']]),
  object: elements([['Una llave antigua', 'llave'], ['Una brújula mágica', 'brújula'], ['Un cuaderno azul', 'cuaderno'], ['Una semilla dorada', 'semilla'], ['Una linterna', 'linterna'], ['Un violín', 'violín'], ['Una pluma de cristal', 'pluma'], ['Un sombrero rojo', 'sombrero'], ['Una botella', 'botella'], ['Un espejo pequeño', 'espejo'], ['Una moneda', 'moneda'], ['Una carta', 'carta'], ['Un telescopio', 'telescopio'], ['Una campana', 'campana'], ['Una piedra brillante', 'piedra']])
};
