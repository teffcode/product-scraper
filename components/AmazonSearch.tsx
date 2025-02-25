import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { CardContent } from "@/components/ui/CardContent";

interface Product {
  title: string;
  price: string;
  image: string;
  link: string;
}

export default function AmazonSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/scrape?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar en Amazon..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>Buscar</button>
      </div>
      {loading && <p>Cargando resultados...</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results?.map((product, index) => (
          <Card key={index}>
            <CardContent>
              <Image
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover mb-2"
                width={24}
                height={24}
                unoptimized
              />
              <h2 className="text-sm font-semibold">{product.title}</h2>
              <p className="text-lg font-bold">{product.price}</p>
              <a href={product.link} target="_blank" className="text-blue-600 underline">Ver en Amazon</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
