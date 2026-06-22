# design.md — Estilo oficial Mindware Nexus

## 1. Tipografía

### Fuente principal recomendada para la aplicación

La fuente recomendada para la interfaz web y el widget es:

```css
font-family: "Hanken Grotesk", system-ui, sans-serif;
```

Uso recomendado:

* Hanken Grotesk 400 para texto normal.
* Hanken Grotesk 600 para subtítulos, labels, botones y elementos destacados.
* Hanken Grotesk 700 para títulos, secciones principales y métricas.

---

## 2. Fuentes mencionadas en la marca

### MADE Good Time Grotesk

Uso en la marca:

* Títulos hero.
* Portadas.
* Nombre visual “Mindware Nexus”.

Nota:

* Es una fuente comercial.
* Requiere licencia web.
* Usar solo en landing o material de marketing si se cuenta con licencia.

---

### Cy Grotesk

Uso en la marca:

* Subtítulos.
* Frases destacadas de portada.

Alternativa libre recomendada:

```css
font-family: "Space Grotesk", system-ui, sans-serif;
```

---

### HK Grotesk / Hanken Grotesk

Uso recomendado:

* Titulares de secciones.
* Interfaz principal.
* Dashboard.
* Widget.
* Formularios.
* Tablas.
* Componentes internos.

Fuente recomendada para producto:

```css
font-family: "Hanken Grotesk", system-ui, sans-serif;
```

---

### Arial

Uso mencionado:

* Cuerpo de texto.
* Tablas.

Recomendación para la app:

* Usar la pila del sistema o Hanken Grotesk regular para mantener coherencia visual.

---

## 3. Paleta oficial de colores

```css
:root {
  --purple-deep: #3D1A4E;
  --purple-primary: #522566;
  --lavender: #AD74C3;
  --lilac-light: #F8EDFB;
  --mint-green: #34D399;
  --coral: #FB7185;
  --charcoal: #111827;
  --white: #FFFFFF;
}
```

---

## 4. Uso oficial de colores

### Púrpura profundo — `#3D1A4E`

Uso:

* Fondo principal oscuro.
* Headers.
* Footer del widget.

---

### Púrpura primario — `#522566`

Uso:

* Color primario de marca.
* Portadas.
* Botones primarios.

---

### Lavanda — `#AD74C3`

Uso:

* Acento de marca.
* Texto “Nexus”.
* Enlaces.
* Resaltados sobre fondo oscuro.

---

### Lila claro — `#F8EDFB`

Uso:

* Fondo de secciones claras.
* Tarjetas.
* Paneles.

---

### Verde menta — `#34D399`

Uso:

* Estados positivos.
* Estado “Calificado”.
* Urgencia “Alta”.
* Crecimiento.
* Éxito.

---

### Coral — `#FB7185`

Uso:

* Métricas de dolor.
* Alertas.
* Advertencias.

---

### Gris carbón — `#111827`

Uso:

* Texto principal sobre fondos claros.

---

### Blanco — `#FFFFFF`

Uso:

* Texto sobre fondos púrpura.
* Superficies de tarjetas.

---

## 5. Recomendación visual para la aplicación

La aplicación debe usar una sola familia tipográfica principal:

```css
font-family: "Hanken Grotesk", system-ui, sans-serif;
```

La fuente MADE Good Time Grotesk debe reservarse para piezas de marketing o landing si existe licencia web.

El dashboard, paneles internos y widget deben mantener coherencia usando Hanken Grotesk y la paleta oficial definida anteriormente.

---

## 6. Aplicación en frontend

### Landing

Puede usar:

* MADE Good Time Grotesk para títulos hero, si hay licencia.
* Cy Grotesk o Space Grotesk para subtítulos destacados.
* Hanken Grotesk para textos normales y secciones internas.

### Dashboard

Debe usar:

* Hanken Grotesk como fuente principal.
* `#F8EDFB` para fondos de paneles.
* `#FFFFFF` para tarjetas.
* `#111827` para texto principal.
* `#522566` para botones primarios.
* `#3D1A4E` para headers o zonas oscuras.
* `#34D399` para estados positivos.
* `#FB7185` para alertas.

### Widget

Debe usar:

* Hanken Grotesk como tipografía.
* La paleta oficial del producto.
* `#3D1A4E` para footer o header oscuro.
* `#522566` como color principal.
* `#FFFFFF` para superficies y texto sobre fondos púrpura.
