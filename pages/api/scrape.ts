import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

type Product = {
  title: string;
  price: string;
  image: string;
  link: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.query as string || "laptop"; // Parámetro de búsqueda
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;

  // Lanzamos Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Extraemos los productos
  const products: Product[] = await page.evaluate(() => {
    const items = document.querySelectorAll('.s-result-item[role="listitem"]');
    const data: Product[] = [];

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

    return data;
  });

  await browser.close();

  res.status(200).json({ products });
}
