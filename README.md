# Sistema Oficial del 1er Congreso Internacional de Integración Científica (UNIOR)

Herramienta modular para el diseño, exportación de programas impresos (PDF), seguimiento del comité organizador y consulta de agenda para participantes.

---

## 🚀 Inicio Rápido

Para iniciar el servidor de desarrollo local:

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`.

Para generar la versión de producción optimizada:

```bash
npm run build
```

---

## 🎯 Vistas Principales y Rutas

| Vista | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| **Agenda Participantes** | `#/` o `#/agenda` | Cronograma interactivo optimizado para teléfonos móviles. Filtro por día, carrera, buscador predictivo y modalidad (presencial/virtual). | Libre (público) |
| **Folleto PDF (Diseñador)** | `#/programa` | Réplica exacta de la maqueta de 2 columnas (Jueves 12 / Viernes 13) por carrera. Listo para imprimir o guardar como PDF vectorial a 300 DPI. Incorpora membretes oficiales, fondo texturizado y marcas de agua con opacidad calibrada. | Libre (público) |
| **Panel del Comité** | `#/comite` | Monitor de cruces de sala, alertas de organización, datos pendientes del Excel, matriz de salas en simultáneo y descarga CSV. | **Protegido por PIN** (Predeterminado: `unior2026`) |
| **Auditoría de Fotos** | `#/fotos` | Catálogo de todos los ponentes registrados: 28 con fotografía cargada y 20 pendientes, con filtro por estado y botón de copia con 1 clic. | Libre |

---

## 📸 Fotografías de los Expositores

* Las **28 fotografías subidas** están vinculadas en `src/data/speakerPhotos.js`.
* Para los **20 expositores pendientes**, puedes consultar la pestaña **Fotos** (`#/fotos`), filtrar por *"Pendientes"*, copiar el nombre esperado (ej. `jorge-nakamura.jpg`) y guardarlo en `public/assets/fotos/`.
* Si un ponente no tiene foto, se muestra un avatar de cortesía elegante.

---

## 🏁 Banderas Internacionales (`flag-icons`)

* Se utiliza la biblioteca oficial `flag-icons` (resolución vectorial nítida basada en códigos ISO-3166).
* Mapeo automático de países: Bolivia (`fi-bo`), Brasil (`fi-br`), Chile (`fi-cl`), Paraguay (`fi-py`), etc.
* La bandera se superpone en la esquina inferior derecha de cada tarjeta de expositor.

---

## 🏛️ Logotipos y Marcas de Agua

Los recursos oficiales se integran de la siguiente manera:
* **Cabecera Folleto:** `public/assets/logos/logo-congreso.png`
* **Pie de página - Organiza:** `public/assets/logos/unior-logo.png`
* **Pie de página - Auspiciadores:**
  * `gador.png` (Gobierno Autónomo Departamental de Oruro)
  * `gador-secretaria-cultura.png` (Cultura y Turismo Oruro)
  * `gamo.png` (Gobierno Autónomo Municipal de Oruro)
  * `gamo-secretaria-cultura.png` (Secretaría Municipal de Cultura)
* **Fondo:** `public/assets/watermarks/fondo-gris.jpg`
* **Marca de agua:** `public/assets/watermarks/Unior Escudo Negro.png` con opacidad calibrada al 7%.
