# Tipografía oficial: Switzer (Fontshare)

Switzer es la tipografía oficial de Mindware Nexus (ver `diseño.md` §2).
Es gratuita para uso comercial bajo la
[ITF Free Font License](https://www.fontshare.com/licenses/itf-ffl) y los
archivos viven versionados en esta carpeta — no hay pasos manuales.

| Archivo                   | Peso | Uso                          |
| ------------------------- | ---- | ---------------------------- |
| `switzer-regular.woff2`   | 400  | Texto normal                 |
| `switzer-medium.woff2`    | 500  | Labels, botones y navegación |
| `switzer-semibold.woff2`  | 600  | Cards y subtítulos           |
| `switzer-bold.woff2`      | 700  | Titulares                    |

- Las declaraciones `@font-face` viven en `src/app/globals.css`.
- Los pesos 400 y 700 se precargan en `src/app/layout.tsx` (anti-FOUT).
- Fallback automático: Geist (vía `next/font`) → pila del sistema.

> Nota: la elección original era Söhne (Klim, comercial). Switzer la
> reemplaza como estándar oficial. Si se adquiere la licencia de Söhne,
> coloca aquí sus `.woff2` y restaura los `@font-face` correspondientes.
