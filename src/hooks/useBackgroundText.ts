import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

const BACKGROUND_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc/export?format=csv&gid=1394626976';

export interface BackgroundEntry {
  text: string;
  videoUrl: string;
}

export const useBackgroundText = () => {
  return useQuery({
    queryKey: ['backgroundTextList'],
    queryFn: async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${BACKGROUND_SHEET_URL}&timestamp=${timestamp}`);
        const csvText = await response.text();
        
        return new Promise<BackgroundEntry[]>((resolve) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const entries = results.data
                .map((row: any) => {
                  const text = row.Background || row.background || Object.values(row)[0] || '';
                  const videoUrl = row.VIDEO || row.Video || row.video || '';
                  return { text, videoUrl };
                })
                .filter((entry: BackgroundEntry) => entry.text && entry.text.trim() !== '');
              
              if (entries.length === 0) {
                resolve([{ text: 'ERROR', videoUrl: '' }]);
              } else {
                resolve(entries);
              }
            },
            error: () => resolve([{ text: 'ERROR', videoUrl: '' }]),
          });
        });
      } catch {
        return [{ text: 'ERROR', videoUrl: '' }];
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 300000,
  });
};
