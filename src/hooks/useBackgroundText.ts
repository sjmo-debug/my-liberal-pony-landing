import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

const BACKGROUND_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc/export?format=csv&gid=1394626976';

export const useBackgroundText = () => {
  return useQuery({
    queryKey: ['backgroundText'],
    queryFn: async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${BACKGROUND_SHEET_URL}&timestamp=${timestamp}`);
        const csvText = await response.text();
        
        return new Promise<string>((resolve) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const entries = results.data
                .map((row: any) => {
                  const rowArray = Object.values(row);
                  return row.Background || row.background || rowArray[0] || '';
                })
                .filter((text: string) => text && text.trim() !== '');
              
              if (entries.length === 0) {
                resolve('ERROR');
              } else {
                const randomIndex = Math.floor(Math.random() * entries.length);
                resolve(entries[randomIndex]);
              }
            },
            error: () => resolve('ERROR'),
          });
        });
      } catch {
        return 'ERROR';
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 300000,
  });
};
