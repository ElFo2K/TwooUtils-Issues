# TwooUtils Bug Reporter

Web estática para reportar errores de TwooUtils. Al enviar el formulario, abre un Issue ya rellenado en el repositorio independiente `ElFo2K/TwooUtils-Issues`; el código del mod permanece privado.

## Preparación del tracker

1. Crea en GitHub el repositorio público `ElFo2K/TwooUtils-Issues` sin añadir el código del mod.
2. Sube `index.html`, `app.js` y la carpeta `app` a la rama `main`.
3. Activa **Issues** en `Settings → General → Features` y conserva la etiqueta `bug`.
4. En `Settings → Pages`, selecciona **Deploy from a branch**, `main` y `/ (root)`.
5. La web quedará en `https://elfo2k.github.io/TwooUtils-Issues/`.

## Vista local

Abre `index.html` en el navegador o ejecuta `python -m http.server 8080`.

El borrador del formulario se guarda únicamente en `localStorage`. La web no recopila ni envía información por sí sola: el usuario revisa el contenido final en GitHub antes de publicarlo.
