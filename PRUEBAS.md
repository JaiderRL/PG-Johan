# Validación de Misión: Palabra

Validación local realizada el **23 de septiembre de 2026** sobre Windows, sirviendo el proyecto mediante HTTP. Se inspeccionaron además capturas de escritorio y móvil.

## Entorno verificado

| Componente | Versión / configuración |
| --- | --- |
| Node.js | 20.19.0 |
| Playwright | 1.63.0 |
| Google Chrome | 154.0.8037.57 |
| Microsoft Edge | 153.0.4234.48 |
| Servidor | `scripts/serve.mjs`, localhost:4173 |

## Pruebas de reglas y datos: 10 aprobadas

Comando: `npm test`.

1. Ocho niveles, tamaños mínimos de bancos, IDs únicos y doce logros.
2. Cuatro respuestas distintas y un índice válido por pregunta.
3. Textos de Detective analizables, tres errores explicados y correcciones completas.
4. Conservación de tokens, tildes, mayúsculas y puntuación en oraciones.
5. Umbrales de estrellas, puntos, bonificaciones y multiplicadores.
6. Detección de términos prohibidos con normalización y límites de palabra.
7. Los siete criterios de evaluación de relatos.
8. Persistencia, validación de configuración y recuperación de JSON corrupto.
9. Bloqueo progresivo y bolsas de ejercicios sin repetición antes de agotarse.
10. Escape de texto antes de insertarlo en HTML.

## Recorrido completo: 24 grupos aprobados

Comando: `npm run test:browser` con el servidor activo.

**En Chrome y en Edge**, con un perfil de prueba vacío:

- Abrir inicio, pulsar Jugar y comprobar siete desafíos bloqueados.
- Comprobar que el reloj avanza y se detiene al pausar.
- Completar los ocho desafíos en secuencia, utilizando sus controles y sin modificar el desbloqueo de la aplicación.
- Verificar puntos y tres estrellas en los resultados de cada desafío.
- Regresar al mapa después de cada victoria y comprobar el siguiente desbloqueo.
- Perder una vida por una respuesta errónea y recibir feedback.
- Abrir la puerta después de resolver las diez pistas de la biblioteca.
- Construir una oración mediante arrastre y completar las restantes por clic.
- Completar Palabra prohibida mediante el modo escrito.
- Escribir un relato, recargar y comprobar que el borrador se conserva.
- Guardar y evaluar la historia con siete criterios satisfechos.
- Cerrar el contexto del navegador y restaurar sus datos para comprobar los ocho niveles y los logros.
- Revisar estadísticas y conservar cambios de sonido, volumen, dificultad y animaciones tras recargar.
- Cancelar el borrado y comprobar que el progreso continúa intacto.
- Recorrer todas las pantallas y los ocho juegos a 390 px, y ordenar palabras mediante eventos táctiles.
- Perder por agotamiento de vidas, reintentar y recuperar las vidas iniciales.
- Avanzar el reloj simulado hasta agotar el tiempo y comprobar la derrota.
- Confirmar el borrado y comprobar el reinicio del progreso.

Resultado: **sin excepciones JavaScript ni respuestas HTTP de error detectadas durante el recorrido instrumentado**.

## Compatibilidad: 12 grupos aprobados

Comando: `npm run test:compatibility` con el servidor activo.

Se midieron 14 pantallas —inicio, mapa, opciones, logros, estadísticas, créditos y los ocho juegos— en cada resolución:

| Resolución | Resultado |
| --- | --- |
| 1920 × 1080 | Sin desbordamiento horizontal |
| 1440 × 810 | Sin desbordamiento horizontal; mapa completo en pantalla |
| 1366 × 768 | Sin desbordamiento horizontal |
| 768 × 1024 | Sin desbordamiento horizontal |
| 390 × 844 | Sin desbordamiento horizontal |
| 320 × 640 | Sin desbordamiento horizontal |

También se verificaron:

- Preferencia de movimiento reducido: las pantallas se muestran sin animación de entrada.
- Cierre de diálogos al cambiar de ruta y acceso a controles con teclado.
- Contenido HTML guardado en relatos mostrado como texto, sin ejecutar etiquetas o eventos.
- Palabra prohibida: tres rondas completas por escrito en Chrome y Edge, sin controles de voz ni acceso a las APIs de reconocimiento, incluso sin AudioContext.
- Validación de texto corto sin pérdida de vidas y penalización por palabras restringidas antes de corregir y completar el desafío.
- Almacenamiento bloqueado: aviso visible y continuidad del juego en memoria.
- **PWA offline:** 35 recursos precargados; navegador sin red, recarga, inicio, mapa y primer desafío con ilustraciones disponibles.

La precarga incluye los módulos y datos de los ocho juegos. La prueba offline interactiva recorre el primero; los ocho fueron completados por separado en las pruebas de navegador con conexión local.

## Evidencias y reproducción

Los scripts generan `test-results/report.json`, `test-results/compatibility.json` y capturas PNG. El ZIP incluye los informes JSON bajo `evidence/`; las capturas permanecen en la carpeta local `test-results/`. Las pruebas usan perfiles aislados y no cambian el progreso del navegador personal.

En este entorno de ejecución restringido se usaron las opciones `--preserve-symlinks --preserve-symlinks-main` para ejecutar Node desde la carpeta de trabajo. No son necesarias al utilizar el proyecto normalmente.

## Límites de lo comprobado

- La opción de micrófono fue retirada. Las comprobaciones de compatibilidad se actualizaron y ejecutaron de nuevo para verificar el modo exclusivamente escrito; el informe del recorrido completo conserva la validación inicial de los ocho desafíos.
- El uso móvil se comprobó mediante emulación de viewport y eventos táctiles; **no se probó en teléfonos físicos, Safari/iOS ni un WebView de Android**.
- La generación de audio y sus controles están implementados; no se realizó una valoración humana de su reproducción en altavoces.
- Se ofrece el control de pantalla completa y recuperación ante rechazo del navegador; la inmersión real depende del dispositivo.
- No se generó ni firmó un APK. La integración futura con Capacitor se documenta en el README.
- La rúbrica de historias y el análisis de palabras prohibidas son reglas mecánicas; no sustituyen una revisión pedagógica del significado ni de la calidad del texto.
