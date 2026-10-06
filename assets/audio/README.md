# Audio de Misión: Palabra

El juego incluye música y efectos **funcionales**, generados localmente con Web Audio en `js/audio.js`. No requiere archivos WAV/MP3, acceso a internet ni descargas. Los navegadores activan el audio tras la primera interacción de la persona que juega.

AudioManager gestiona:

| Evento | Identificador |
| --- | --- |
| Botón | `click` |
| Acierto | `correct` |
| Error | `wrong` |
| Estrella / logro | `star` |
| Victoria | `win` |
| Derrota | `lose` |
| Aviso de cuenta regresiva | `warning` |
| Música | Secuencia ambiental de `configure()` |

Las secuencias están en `melodies`; `tone()` controla frecuencia, ataque, duración y tipo de onda. `master` aplica el volumen global. `configure()` respeta música y efectos, y `suspend()` detiene el audio al ocultar la pestaña.

Para sustituir la síntesis por grabaciones:

1. Coloca sonidos propios o debidamente autorizados en esta carpeta, preferiblemente con nombres como `correct.mp3`, `wrong.mp3` y `ambient.mp3`.
2. Sustituye la implementación interna de `play()` y el acompañamiento de `configure()`, conservando la interfaz de AudioManager y el respeto por `GameState.settings`.
3. Captura rechazos de `HTMLAudioElement.play()` y errores de carga. Mantén la síntesis como alternativa si un recurso no puede cargarse.
4. Añade los archivos al service worker e incrementa su versión para conservar el funcionamiento offline.

No se distribuyen archivos vacíos ni se solicitan URLs de audio inexistentes.
