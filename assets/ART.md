# Recursos visuales originales

Los escenarios se generaron para este proyecto con la herramienta integrada `imagegen`, aplicando la habilidad imagegen. La imagen del usuario se utilizó como orientación estética; no se copiaron sus personajes ni su logotipo. Los SVG, la marca tipográfica y los controles se construyeron como recursos nativos del proyecto.

| Ruta | Uso | Sustitución sugerida |
| --- | --- | --- |
| `assets/images/backgrounds/valley.png` | Valle, menú, mapa y desafíos al aire libre | Ilustración panorámica; izquierda oscura y despejada, protagonista a la derecha |
| `assets/images/backgrounds/library.png` | Biblioteca y desafíos de lectura/escritura | Interior panorámico con centro de bajo contraste |
| `assets/images/characters/lia.svg` | Personaje animable en detective, batalla y carrera | SVG o PNG transparente, proporción 180:240 |
| `assets/images/characters/borron.svg` | Rival original de tinta | SVG o PNG transparente, proporción 180:220 |
| `assets/images/icons/emblem.svg` | Emblema y favicon | Marca cuadrada con zona de seguridad |
| `assets/images/icons/icon-192.png`, `icon-512.png` | Instalación PWA | Regenerar al cambiar el emblema |
| `js/icons.js` | Iconos de interfaz en SVG | Mantener viewBox 0 0 24 24 y uso de currentColor |

Los iconos PNG se rasterizaron desde el emblema SVG propio mediante `scripts/render-icons.mjs`. Para regenerarlos, inicia el servidor local e instala las dependencias de desarrollo; después ejecuta `node scripts/render-icons.mjs`.

No hay fuentes externas: la interfaz utiliza Trebuchet MS/Segoe UI y Georgia con alternativas del sistema. La apariencia tipográfica puede variar ligeramente entre plataformas. No es necesario sustituir ningún recurso para que el juego funcione.

## Prompt exacto del valle

Use case: illustration-story. Asset type: full-screen background for an original Spanish educational adventure videogame, widescreen 16:9. Create a polished lush hand-painted 2D storybook videogame environment, crisp clean shapes with painterly texture, atmospheric depth and warm golden rim light, appealing to ages 10-16. Scene: a magical verdant valley with turquoise distant mountains, a small ivory castle with terracotta and teal roofs on an island hill in the upper right distance, a winding cream path through mossy grass, mature trees framing the upper corners, sunlit floating golden firefly particles, little wildflowers and a beautiful ancient open book on a stone in the bottom right. Original protagonist: a young female explorer with dark curly short hair, warm brown skin, mustard-yellow cape, teal tunic, brown hiking boots and a small burgundy satchel, shown full-body at right around x=76%, y=70%, looking toward the castle holding an illuminated compass. A tiny teal bird companion beside her. Composition essential: left 55 percent has low-detail deep petrol and emerald tree shade, mostly free of subjects, with enough dark visual quiet to overlay a large game title and menu; detailed scenery and protagonist concentrated on right 45 percent. Foreground foliage along bottom edge, the path leads from bottom center toward distant right castle. Sophisticated rich emerald, deep petrol, warm buttery gold, jade and aqua colors; not neon, not photorealistic, no plastic 3D, no anime, no copied characters. This is ONLY illustration; absolutely no text, no lettering, no numbers, no UI, no buttons, no logo, no watermark. Render landscape 1536x1024 or wider.

## Prompt exacto de la biblioteca

Use case: illustration-story. Asset type: original background for educational fantasy videogame, wide landscape. A beautiful mysterious magical castle library at twilight, hand-painted detailed 2D storybook game art. Giant curved wooden bookshelves full of colorful antique volumes flank a wide vaulted room. Warm amber lights and floating golden motes, teal light through arched windows, an ornate closed door in the distant center, a reading desk and open ancient book in the bottom left, ferns and little climbing plants. Dark navy shadows, petrol, emerald, warm amber, rich walnut. Atmospheric, inviting rather than scary, polished illustration with crisp shapes. Composition: edges detailed, large center area relatively low detail in shadow to place a readable game UI. No characters, no text, no letters, no UI, no logo, no watermark. Wide 1536x1024.

## Integración

Los dos PNG están copiados dentro del proyecto. No dependen de rutas internas de Codex ni de servicios externos. Si cambias nombres o extensiones, actualiza CSS, módulos de juego y `service-worker.js`. Incrementa la versión de la caché tras cambiar imágenes publicadas.

