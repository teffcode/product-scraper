# 📌 Explicación paso a paso del código

## 1️⃣ **Importaciones y Definición de Tipos**
```ts
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
```
- `NextApiRequest` y `NextApiResponse`: Tipos de Next.js para manejar solicitudes y respuestas API.
- `puppeteer`: Librería para automatizar un navegador y hacer web scraping.

---

## 2️⃣ **Definimos el Tipo `Product`**
```ts
type Product = {
  title: string;
  price: string;
  image: string;
  link: string;
};
```
- Cada producto tendrá:
  - `title`: nombre del producto.
  - `price`: precio del producto.
  - `image`: URL de la imagen.
  - `link`: enlace a la página del producto.

---

## 3️⃣ **Función Principal de la API**
```ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
```
- `handler` maneja la solicitud HTTP.
- `req`: Datos de la solicitud (ej. parámetros de búsqueda).
- `res`: Respuesta que se enviará al usuario.

---

## 4️⃣ **Obtenemos el Parámetro de Búsqueda**
```ts
const query = req.query.query as string || "laptop"; 
const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
```
- `req.query.query`: Extrae el parámetro de búsqueda.
- `encodeURIComponent(query)`: Asegura que la URL sea válida.

---

## 5️⃣ **Iniciamos Puppeteer**
```ts
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle2" });
```
- Abre un navegador en **modo headless** (sin interfaz).
- Carga la página de búsqueda en Amazon.
- Espera hasta que la red esté inactiva (`networkidle2`).

---

## 6️⃣ **Extraemos los Datos con `evaluate`**
```ts
const products: Product[] = await page.evaluate(() => {
  const items = document.querySelectorAll('.s-result-item[role="listitem"]');
  const data: Product[] = [];
```
- `page.evaluate()`: Ejecuta código en la página.
- `.s-result-item[role="listitem"]`: Selecciona productos relevantes.

---

## 7️⃣ **Recorremos los Productos y Extraemos Información**
```ts
items.forEach((item) => {
  const title = item.querySelector("a h2 span")?.textContent || "No title";
  const price = item.querySelector(".a-price span")?.textContent || "N/A";
  const image = item.querySelector("img.s-image")?.getAttribute("src") || "";
  const link =
    "https://www.amazon.com" +
    item.querySelector("h2 a")?.getAttribute("href") ||
    "";

  data.push({ title, price, image, link });
});
```
### 🔹 **Explicación**
- **Título:** `querySelector("a h2 span")?.textContent || "No title"`
- **Precio:** `querySelector(".a-price span")?.textContent || "N/A"`
- **Imagen:** `querySelector("img.s-image")?.getAttribute("src") || ""`
- **Enlace:** Concatena `"https://www.amazon.com"` para formar la URL completa.

---

## 8️⃣ **Cerramos el Navegador**
```ts
await browser.close();
```
- Libera recursos al cerrar Puppeteer.

---

## 9️⃣ **Enviamos la Respuesta JSON**
```ts
res.status(200).json({ products });
```
- Devuelve los productos extraídos en formato JSON.

---

## 🔥 **Ejemplo de Respuesta JSON**
```json
{
  "products": [
    {
      "title": "Apple iPhone 13 (128GB) - Midnight",
      "price": "$699.99",
      "image": "https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_SY741_.jpg",
      "link": "https://www.amazon.com/dp/B09G9HD6PD"
    },
    {
      "title": "iPhone 13 Pro Max (256GB) - Sierra Blue",
      "price": "$1,099.99",
      "image": "https://m.media-amazon.com/images/I/71F9eVX8KHL._AC_SY741_.jpg",
      "link": "https://www.amazon.com/dp/B09G9FPGTN"
    }
  ]
}
```

---

## 🎯 **Resumen**
1. 📩 **Recibe** un parámetro de búsqueda (`/api/scrape?query=producto`).
2. 🌍 **Crea una URL** para buscar en Amazon.
3. 🌐 **Usa Puppeteer** para abrir la página.
4. 🛍️ **Obtiene información** de los productos con `querySelector`.
5. 🔄 **Devuelve los productos** en formato JSON.

---

## 🚀 **Posibles Mejoras**
- **Manejar errores** con `try/catch`.
- **Cachear resultados** para mejorar rendimiento.
- **Usar proxies o user-agents** para evitar bloqueos.

---

¡Ahora tienes una API funcional con Next.js y Puppeteer! 🎉 🔥
