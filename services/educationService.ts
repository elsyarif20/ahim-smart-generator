
export interface KBBIResult {
  lema: string;
  arti: string[];
  kelasKata: string[];
}

export const searchKBBI = async (query: string): Promise<KBBIResult | null> => {
  try {
    // Using the low latency API recommended in user request (mirroring Android app logic)
    const response = await fetch(`https://kbbi.raf555.dev/api/kbbi/${encodeURIComponent(query)}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data || !data.data) return null;

    // The API structure usually returns an array of meanings
    return {
      lema: data.data.lema || query,
      arti: data.data.arti || [],
      kelasKata: data.data.kelasKata || []
    };
  } catch (error) {
    console.error("KBBI API Error:", error);
    return null;
  }
};

export const getWikipediaSummary = async (query: string) => {
  try {
    const response = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Wikipedia API Error:", error);
    return null;
  }
};
