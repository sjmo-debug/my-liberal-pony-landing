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

export const useAboutContent = () => {
  return useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${ABOUT_SHEET_URL}&timestamp=${timestamp}`);
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

              resolve(entries.length > 0 ? entries : FALLBACK);
            },
            error: () => resolve(FALLBACK),
          });
        });
      } catch {
        return FALLBACK;
      }
    },
    refetchInterval: 300000,
    staleTime: 300000,
  });
};
