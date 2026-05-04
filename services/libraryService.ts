import { Book } from "../types";

const BUKUACAK_URL = "https://bukuacak.vercel.app/api";
const MASAKAPA_URL = "https://masak-apa-hari-ini-api.vercel.app/api";

export const getLibraryBooks = async (query: string = ""): Promise<Book[]> => {
  try {
    const fetchBukuacak = async () => {
      try {
        const url = query ? `${BUKUACAK_URL}?search=${encodeURIComponent(query)}` : BUKUACAK_URL;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.data || []);
          return items.map((b: any) => ({
            id: b.id || `ba-${Math.random()}`,
            title: b.title || "Unknown",
            author: b.author || "Bukuacak",
            description: b.description || "Koleksi buku digital.",
            cover: b.cover_url || b.image || `https://placehold.co/400x600/1a1c20/e9d1a3?text=BUKU`,
            category: "Buku Umum",
            externalUrl: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(b.title)}`
          }));
        }
        return [];
      } catch { return []; }
    };

    const fetchMasakApa = async () => {
      try {
        const url = query 
          ? `${MASAKAPA_URL}/search/?q=${encodeURIComponent(query)}` 
          : `${MASAKAPA_URL}/recipes`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const items = (data.results || data.data || []).slice(0, 12);
          return items.map((r: any) => ({
            id: r.key || `ma-${Math.random()}`,
            title: r.title || "Resep Masakan",
            author: "Masak Apa Hari Ini",
            description: `Panduan memasak: ${r.title}.`,
            cover: r.thumb || `https://placehold.co/400x600/1a1c20/e9d1a3?text=RESEP`,
            category: "Resep Makanan",
            externalUrl: `https://masakapahariini.com/resep/${r.key}`
          }));
        }
        return [];
      } catch { return []; }
    };

    const [bukuacak, masakApa] = await Promise.all([fetchBukuacak(), fetchMasakApa()]);
    const combined = [...bukuacak, ...masakApa];

    if (combined.length === 0) throw new Error("Empty results");
    return combined;

  } catch (error) {
    return [
      {
        id: "fb-1",
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        description: "Novel tentang keberanian bermimpi.",
        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1489312211i/34542157.jpg",
        category: "Novel",
        externalUrl: "https://www.google.com/search?tbm=bks&q=Laskar+Pelangi"
      }
    ];
  }
};

