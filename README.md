# BA. Arquitectos & Desarrolladores — Sitio web

Landing de una sola página para **BA. Arquitectos & Desarrolladores**, estudio de arquitectura y desarrolladora en San Pablo, Tucumán.

Sitio estático: HTML + CSS + JavaScript, sin dependencias ni paso de compilación.

## Estructura

```
index.html        Contenido y estructura
styles.css        Estilos (paleta: negro, hormigón, madera, arena, blanco)
main.js           Animaciones y formulario → WhatsApp
.htaccess         Caché para Hostinger / Apache
assets/img/       Fotos en WebP
```

## Secciones

Portada · Nuestra mirada · Proyectos (Casa 613, 617, 1113, Utopía, Buona Visione, Casa VJ) · Casa 613 destacada · Proceso · Por qué San Pablo · Estudio · Contacto

## Ver en local

```bash
python -m http.server 8765
```

y abrir `http://localhost:8765/`. También funciona abriendo `index.html` directamente.

## Publicar

- **Hostinger:** subir el contenido de esta carpeta a `public_html`.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.

Al actualizar, cambiar el `?v=AAAAMMDD` de `styles.css` y `main.js` en `index.html` para que los navegadores descarguen la versión nueva.

## Fotos

Las imágenes provienen del Instagram del estudio ([@ba.arquitectos.ok](https://www.instagram.com/ba.arquitectos.ok/)) y fueron mejoradas con super-resolución. Reemplazarlas por los originales en alta resolución mejora la nitidez: mismos nombres de archivo en `assets/img/`.
