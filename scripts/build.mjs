import { cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'manifest.json', 'service-worker.js', 'css', 'js', 'data', 'assets']) await cp(path.join(root, file), path.join(output, file), { recursive: true });
await writeFile(path.join(output, '.build-info'), `Misión: Palabra 1.0.0\n${new Date().toISOString()}\n`);
console.log('Juego estático copiado a dist/. Listo para servir o sincronizar con Capacitor.');
