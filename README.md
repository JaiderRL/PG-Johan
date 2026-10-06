# Misión: Palabra

Videojuego educativo 2D en español. Acompaña a **Lía** por el reino de las letras, restaura manuscritos, resuelve el misterio de una biblioteca y vence a **Borrón**, una criatura de tinta. La última aventura consiste en escribir tu propia historia.

El proyecto funciona con **HTML5, CSS3 y JavaScript modular**, sin frameworks, cuentas, servicios de pago, API de IA ni backend de aplicación. Todos los recursos del juego son locales. Node.js y Playwright se utilizan únicamente para servir archivos, preparar la distribución y ejecutar pruebas.

## Ejecutar

**Con VS Code:** abre esta carpeta y ejecuta `index.html` con Live Server.

**Con Node.js 20 o posterior:** desde esta carpeta, ejecuta:

```sh
node scripts/serve.mjs
```

Abre **http://localhost:4173**. No necesitas instalar dependencias para jugar ni para utilizar este servidor estático. También puedes usar `npm start` (`npm.cmd start` en PowerShell si la política de ejecución bloquea `npm.ps1`). Detén el servidor con `Ctrl+C`.

Es importante servir los archivos por HTTP: no abras el archivo mediante `file://`, porque el juego utiliza módulos JavaScript. Cualquier servidor estático es suficiente. Para probar el modo sin conexión, visita el juego una primera vez en localhost o HTTPS y espera a que termine la instalación del service worker.

## Qué incluye

- Menú ilustrado, mapa de ocho destinos y desbloqueo progresivo.
- Escenarios y protagonistas originales, botones con relieve, partículas y animaciones.
- Puntos, tres estrellas por desafío, vidas, tiempo activo, bonificaciones y rachas.
- Tres dificultades, pausa manual y pausa automática al ocultar la pestaña.
- Resultados de victoria y derrota, reintentos y acceso al siguiente desafío.
- Doce logros, estadísticas y mejores marcas.
- Música ambiental y efectos sintetizados con Web Audio.
- Opciones de música, efectos, volumen, movimiento y pantalla completa.
- Guardado en `localStorage`: progreso, configuración, logros, estadísticas, borrador y relatos.
- Interfaz adaptable, teclado, controles táctiles y respeto por `prefers-reduced-motion`.
- Manifest e instalación PWA con caché para funcionamiento offline básico.

## Los ocho desafíos

| Desafío | Contenido disponible | Partida normal | Mecánica |
| --- | --- | --- | --- |
| Detective de palabras | 15 textos, 3 errores cada uno | 3 textos · 03:30 | Tocar palabras, leer correcciones, revisar y avanzar |
| El misterio de la biblioteca | 10 fragmentos conectados | 10 pistas · 07:00 | Interpretar el texto y abrir la puerta |
| Batalla de sinónimos | 25 palabras | 7 rondas · 01:40 | Elegir un sinónimo y atacar a Borrón |
| Construye la oración | 20 oraciones | 5 rondas · 03:00 | Ordenar por clic, toque o arrastre |
| ¿Quién dijo qué? | 15 preguntas | 5 rondas · 02:30 | Reconocer obras, autores y personajes |
| La carrera de las tildes | 25 ejercicios | 7 rondas · 02:00 | Acentuar correctamente para avanzar |
| Palabra prohibida | 20 conceptos | 3 rondas · 01:30 por ronda | Describir por escrito sin usar las palabras restringidas |
| Crea tu propia historia | 15 elementos por cada una de 4 categorías | Sin límite | Crear, guardar y revisar un relato |

Hay **130 ejercicios/conceptos** en los siete primeros bancos y **50.625 combinaciones** para escritura creativa. Las partidas toman ejercicios de bolsas aleatorias que se conservan entre sesiones para reducir repeticiones. Las oraciones se ordenan por dificultad creciente. La biblioteca mantiene sus diez pistas en secuencia para conservar el sentido de su narrativa.

## Reglas de juego

- **Acierto:** 100 puntos. Respuesta en menos de cinco segundos: 50 adicionales.
- **Racha:** desde 3 aciertos, ×2; desde 5, ×3; desde 10 aparece «Imparable». Un error reinicia la racha.
- **Error:** una vida menos y hasta 25 puntos menos, sin puntuaciones negativas. Se explica el error y se puede volver a intentar mientras queden vidas.
- **Completar:** 500 puntos adicionales y desbloqueo del siguiente destino.
- **Estrellas:** 1 para 40–59 %, 2 para 60–79 % y 3 para 80–100 % de precisión. Una derrota no concede estrellas ni desbloquea niveles.
- **Fácil:** 5 vidas, 50 % más de tiempo y puntos ×0,8. **Normal:** 3 vidas. **Difícil:** 2 vidas, 25 % menos de tiempo y puntos ×1,25.
- Palabra prohibida conserva sus 90 segundos por concepto en todas las dificultades. La historia no tiene reloj de cuenta regresiva.
- El tiempo se detiene al pausar, ocultar la pestaña o completar una etapa mientras se lee la explicación. Las partidas abandonadas comienzan de nuevo; las mejores marcas y los desafíos completados se mantienen.

La precisión incluye los intentos incorrectos. En escritura creativa se calcula a partir de los siete criterios de la rúbrica. Las estadísticas de tiempo contabilizan actividad, excluyendo las pausas.

## Expresión escrita

**Palabra prohibida:** exige al menos 12 palabras y 8 distintas. Detecta el concepto, las palabras prohibidas, sus plurales simples y las variantes especificadas en el banco; ignora diferencias de mayúsculas y tildes. No realiza un análisis semántico de la explicación. Las variantes adicionales se muestran en pantalla.

Palabra prohibida se juega exclusivamente por escrito. Escribe en «Escribe tu explicación» y pulsa «Comprobar». El contador de palabras se actualiza mientras escribes. No se solicita acceso al micrófono.

**Escritura creativa:** guarda el borrador tras cada cambio. «Guardar historia» crea o actualiza un relato, y «Nueva historia» conserva el anterior antes de generar otros elementos. Se mantienen los 30 relatos guardados más recientes y el borrador actual.

La evaluación comprueba siete criterios: 60 palabras, una palabra clave de cada uno de los cuatro elementos, mayúscula inicial y puntuación con cierre. Para completar se necesitan las 60 palabras y cinco criterios. No se evalúan originalidad, coherencia ni calidad literaria. Es una guía de revisión, complementaria al acompañamiento docente.

## Estructura y arquitectura

```text
index.html                 Entrada, accesibilidad y carga de módulos
manifest.json              Metadatos e iconos PWA
service-worker.js          Precarga de recursos locales y funcionamiento offline
css/
  styles.css               Identidad visual, pantallas y minijuegos
  animations.css           Efectos y preferencias de movimiento
  responsive.css           Adaptación a móviles, tablets y pantallas amplias
js/
  app.js                   Menú, mapa, opciones, logros, estadísticas y resultados
  router.js                Navegación por hash y limpieza de pantallas
  game-state.js            Estado compartido, progreso y bolsas de ejercicios
  game-engine.js           Partidas, puntuación, vidas, reloj, pausa y resultados
  storage.js               Persistencia, validación y recuperación de errores
  audio.js                 AudioManager y síntesis musical
  achievements.js          Desbloqueo y persistencia de logros
  icons.js                 Sistema de iconos SVG y estrellas
  ui.js                    Diálogos, notificaciones y feedback
  utils.js                 Reglas compartidas y evaluación local
  games/                   Un módulo por minijuego y componente de opciones
data/
  levels.js                Metadatos de niveles y dificultades
  questions.js             Bancos de ejercicios y elementos narrativos
  achievements.js          Definiciones de los 12 logros
assets/
  images/backgrounds/      Dos escenarios PNG originales
  images/characters/       Lía y Borrón en SVG
  images/icons/            Emblema SVG e iconos PNG instalables
  ART.md                   Recursos visuales, procedencia y prompts exactos
  audio/README.md          Síntesis y sustitución de sonidos
scripts/
  serve.mjs                Servidor estático local
  build.mjs                Copia de distribución a dist/
  render-icons.mjs         Rasterización del emblema original para la PWA
tests/
  core.test.mjs            Pruebas de contenido, reglas y persistencia
  browser.mjs              Recorrido completo en Chrome y Edge
  compatibility.mjs        Responsive, modo escrito, fallos de APIs y offline
PRUEBAS.md                 Alcance y resultados de validación
```

`GameState` se exporta como singleton modular; no se publica en `window`. Contiene el progreso duradero y la partida actual (`session`). `GameSession` proporciona el ciclo común y cada minijuego implementa `mount(session)` y `session.renderRound()`. El router ejecuta la limpieza de la pantalla saliente, y la sesión detiene relojes y listeners cuando se abandona.

Los datos educativos no dependen del DOM. Las funciones de evaluación se comparten con las pruebas. Los relatos y explicaciones se insertan como texto escapado. Si el almacenamiento está bloqueado o lleno, el juego avisa y conserva el estado en memoria mientras permanezca abierto.

## Agregar preguntas

Edita `data/questions.js`. Conserva IDs únicos y estables. Los ejercicios de opciones tienen cuatro respuestas y un índice `correct` entre 0 y 3. El componente baraja la posición de las respuestas al mostrarlas.

```js
{
  id: 'synonym-26',
  question: 'Apacible',
  answers: ['Tranquilo', 'Ruidoso', 'Hostil', 'Inquieto'],
  correct: 0,
  explanation: 'Apacible describe algo tranquilo o agradable.',
  difficulty: 2
}
```

Los bancos que utilizan el ayudante `choices()` reciben filas `[pregunta, respuestas, explicación, dificultad]`; la respuesta correcta se coloca primero en los datos y la interfaz la baraja.

En Detective, marca cada error con `[[original|corrección|explicación]]`, sin espacios extra ni corchetes en la explicación. El parser mantiene la puntuación adyacente unida a la palabra. En oraciones, conserva las mayúsculas y la puntuación en `answer`; los tokens se generan separando por espacios. Para aceptar otras construcciones gramaticales válidas, amplía la comparación de `sentence-builder.js` con respuestas alternativas explícitas.

En Palabra prohibida puedes añadir variantes flexionadas a `variants`. En los elementos de historias, `label` es el texto mostrado y `keys` contiene palabras completas que pueden satisfacer el criterio. Verifica que haya una única respuesta correcta y una explicación clara antes de ampliar un banco.

## Agregar niveles

1. Añade los metadatos a `data/levels.js` y el módulo a `js/games/`.
2. Implementa `mount(session)` utilizando `session.grade()`, `session.completeRound()` y el componente `.feedback`.
3. Registra el módulo en la lista `games` de `js/app.js`.
4. Añade sus archivos a la precarga de `service-worker.js` e incrementa su versión.
5. Si añades un **noveno** destino, actualiza los límites de 8 niveles / 24 estrellas en almacenamiento, mapa, resultados, logros y pruebas. La versión actual está diseñada y validada para los ocho destinos solicitados.

## Cambiar imágenes y sonidos

El inventario está en [assets/ART.md](assets/ART.md). Los escenarios se consumen desde CSS y los personajes desde sus módulos de juego. Puedes reemplazar los archivos conservando sus nombres, o actualizar sus referencias y la lista del service worker. Conserva la zona oscura y libre de detalle del lado izquierdo del valle para que el menú resulte legible.

No hace falta reemplazar ningún recurso para jugar. El sonido es una síntesis local funcional, no un enlace a archivos inexistentes. Las notas, envolventes, volúmenes y melodías están en `js/audio.js`. Consulta [assets/audio/README.md](assets/audio/README.md) para sustituirlos por grabaciones locales.

## Borrar o conservar el progreso

Desde **Opciones → Borrar progreso**, confirma la eliminación. El diálogo enumera todo lo que se borra, incluidas las historias. Cancelar conserva todos los datos.

La clave de almacenamiento es `mision-palabra:v1`. Los datos pertenecen al origen del navegador: cambiar puerto, dominio, navegador o dispositivo crea un espacio de progreso diferente. El modo privado o la limpieza de datos del navegador pueden eliminarlos. No hay sincronización en la nube. Si el navegador deniega almacenamiento, copia tus relatos antes de cerrar.

## PWA y distribución

El service worker precarga HTML, estilos, JavaScript, datos e imágenes. Solo utiliza su propia caché `mision-palabra-v1.0.1`; no borra cachés de otras aplicaciones. Para publicar cambios, incrementa `CACHE` en `service-worker.js` y actualiza `FILES` cuando agregues recursos.

Genera la distribución estática:

```sh
node scripts/build.mjs
```

Sirve o empaqueta el contenido de `dist/`. No necesita `node_modules`, pruebas ni el servidor de desarrollo. La instalación como aplicación depende de las capacidades y criterios del navegador, y requiere HTTPS o localhost.

## Preparación para Android con Capacitor

No se incluye un APK ni se instala Capacitor como dependencia del juego. La entrada HTML, las rutas relativas y la distribución estática están preparadas para integrarse más adelante. Sigue la [documentación oficial de instalación de Capacitor](https://capacitorjs.com/docs/getting-started) y sus requisitos vigentes de Node.js, Android Studio y SDK.

Desde la raíz, cuando quieras crear el proyecto nativo:

```sh
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init
node scripts/build.mjs
npx cap add android
npx cap sync android
npx cap open android
```

Durante la inicialización, usa **Misión Palabra**, un identificador propio como `com.johan.misionpalabra` y configura **`webDir: 'dist'`**. Después de cambios web, ejecuta de nuevo el build y `npx cap sync android`. La firma y compilación de APK se realizan en Android Studio.

Comprueba en el WebView final pantalla completa, audio y almacenamiento. Los desafíos se resuelven con texto y controles táctiles; no requieren permisos de micrófono. Los datos de la versión web no se transfieren automáticamente a la aplicación nativa.

## Pruebas

Para desarrollo y pruebas automatizadas:

```sh
npm install
npm test
```

Con `node scripts/serve.mjs` ejecutándose en otra terminal y Chrome y Edge instalados:

```sh
npm run test:browser
npm run test:compatibility
```

`test:browser` recorre los ocho desafíos con controles de usuario y verifica el desbloqueo natural. `test:compatibility` utiliza datos de prueba para inspeccionar todas las pantallas, simula APIs ausentes y errores, y comprueba la recarga sin red. Las capturas e informes JSON se escriben en `test-results/` y no modifican el progreso de tu navegador habitual.

Consulta [PRUEBAS.md](PRUEBAS.md) para el resultado, las resoluciones verificadas y las limitaciones de las pruebas en dispositivos físicos.
