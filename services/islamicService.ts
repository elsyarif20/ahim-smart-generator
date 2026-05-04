import { Doa, Hadith, HadithInfo } from "../types";

// API Endpoints
const DOA_API = "https://doa-doa-api-ahmadramadhan.fly.dev/api";
const HADITH_API = "https://hadis-api-id.vercel.app/hadith";
const PRAYER_API = "https://api.myquran.com/v2/sholat";

export const getAllDoa = async (): Promise<Doa[]> => {
  try {
    const response = await fetch(`${DOA_API}`);
    return await response.json();
  } catch (error) {
    console.error("Doa API Error:", error);
    return [];
  }
};

export const getHadithAuthors = async (): Promise<HadithInfo[]> => {
  try {
     const res = await fetch(HADITH_API);
     const data = await res.json();
     // Normalizing for standard perawi
     return [
       { name: "Abu Daud", id: "abu-daud", available: 4419 },
       { name: "Ahmad", id: "ahmad", available: 4305 },
       { name: "Bukhari", id: "bukhari", available: 6638 },
       { name: "Darimi", id: "darimi", available: 3367 },
       { name: "Ibnu Majah", id: "ibnu-majah", available: 4285 },
       { name: "Malik", id: "malik", available: 1587 },
       { name: "Muslim", id: "muslim", available: 4930 },
       { name: "Nasai", id: "nasai", available: 5364 },
       { name: "Tirmidzi", id: "tirmidzi", available: 3625 }
     ];
  } catch {
    return [];
  }
};

export const getHadithByAuthor = async (authorId: string, page: number = 1): Promise<Hadith[]> => {
  try {
    const response = await fetch(`${HADITH_API}/${authorId}?range=${(page-1)*20 + 1}-${page*20}`);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Hadith API Error:", error);
    return [];
  }
};

export const getPrayerTimes = async (cityId: string, date: string): Promise<any> => {
  try {
    // date format: YYYY-MM-DD
    const [year, month, day] = date.split('-');
    const response = await fetch(`${PRAYER_API}/jadwal/${cityId}/${year}/${month}/${day}`);
    const data = await response.json();
    return data.data?.jadwal || null;
  } catch (error) {
    console.error("Prayer Times API Error:", error);
    return null;
  }
};

export const searchCity = async (name: string): Promise<any[]> => {
  try {
    const response = await fetch(`${PRAYER_API}/kota/cari/${name}`);
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
};
