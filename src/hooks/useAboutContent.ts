import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

const ABOUT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc/export?format=csv&gid=846546977';

export interface AboutEntry {
  text: string;
  italic: boolean;
}

const FALLBACK: AboutEntry[] = [
  { text: 'MY LIBERAL PONY IS A COLLECTION OF THOUGHTS, FEELINGS AND OBSERVATIONS FROM A DISABLED QUEER INTROVERT LIVING IN THE UK.', italic: false },
  { text: "MY LIBERAL PONY IS AT TIMES SERIOUS, AT TIMES FUNNY, BUT ALWAYS THE INVITATION INTO AN MRI SCANNER THAT YOU DIDN'T KNOW YOU NEEDED.", italic: false },
  { text: 'MY LIBERAL PONY is not intended to be restricted to a specific genre.', italic: false },
  { text: 'MY LIBERAL PONY shows are a safe space.', italic: false },
  { text: 'MY LIBERAL PONY is not intended to infringe on any copyrights as outlined by the Hasbro corporation however it would also be quite funny if it did.', italic: true },
];

const CACHE_KEY = 'about_page_data';
const CACHE_DURATION = 3600000; // 1 hour

export const useAboutContent = () => {
  return useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const now = Date.now();
      const cachedItem = localStorage.getItem(CACHE_KEY);

      if (cachedItem) {
        try {
          const { data, timestamp } = JSON.parse(cachedItem);
          if (now - timestamp < CACHE_DURATION && Array.isArray(data) && data.length > 0) {
            return data as AboutEntry[];
          }
        } catch {}
      }

      try {
        const response = await fetch(`${ABOUT_SHEET_URL}&timestamp=${now}`);
        const csvText = await response.text();

        return new Promise<AboutEntry[]>((resolve) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const entries = results.data
                .map((row: any) => {
                  const text = row.Text || row.text || row.TEXT || Object.values(row)[0] || '';
                  const italicVal = row.Italic || row.italic || row.ITALIC || row.Style || row.style || '';
                  const italic = typeof italicVal === 'string' && ['yes', 'true', '1', 'italic'].includes(italicVal.toLowerCase().trim());
                  return { text: String(text).trim(), italic };
                })
                .filter((e: AboutEntry) => e.text !== '');

              const result = entries.length > 0 ? entries : FALLBACK;
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
              } catch {}
              resolve(result);
            },
            error: () => resolve(cachedItem ? JSON.parse(cachedItem).data : FALLBACK),
          });
        });
      } catch {
        if (cachedItem) {
          try { return JSON.parse(cachedItem).data as AboutEntry[]; } catch {}
        }
        return FALLBACK;
      }
    },
    refetchInterval: CACHE_DURATION,
    staleTime: CACHE_DURATION,
  });
};
