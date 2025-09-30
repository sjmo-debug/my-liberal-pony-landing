import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';
import GigCard from './GigCard';

interface Gig {
  date: string;
  venue: string;
  location: string;
  ticketInfo: string;
  buttonText: string;
  parsedDate: Date;
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1zcS_vYBVjS2BYinxHFwEiygsGe5krgnRlC8z-2o8lLc/export?format=csv&gid=0';

const parseDate = (dateStr: string): Date => {
  // Parse d/mm/yy or d/m/yy format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    let year = parseInt(parts[2], 10);
    
    // Handle 2-digit year
    if (year < 100) {
      year += 2000;
    }
    
    return new Date(year, month, day);
  }
  return new Date();
};

const formatDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  // Add ordinal suffix
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                 day === 2 || day === 22 ? 'nd' :
                 day === 3 || day === 23 ? 'rd' : 'th';
  
  return `${dayName}, ${day}${suffix} ${month} ${year}`;
};

const GigSection = () => {
  const { data: gigs, isLoading, error } = useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${SHEET_CSV_URL}&timestamp=${timestamp}`);
      const csvText = await response.text();
      
      return new Promise<Gig[]>((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedGigs = results.data
              .map((row: any) => {
                // Get values, trying header names first, then column indexes as fallback
                const rowArray = Object.values(row);
                const dateStr = row.Date || row.date || rowArray[0] || '';
                const venue = row.Venue || row.venue || rowArray[1] || '';
                const location = row.Location || row.location || rowArray[2] || '';
                
                // Column D (index 3) for button text, Column E (index 4) for hyperlink
                const buttonText = rowArray[3] || '';
                const hyperlink = rowArray[4] || '';
                
                // Combine them: if there's a hyperlink, pass it; otherwise just the text
                const ticketInfo = hyperlink || buttonText;
                
                if (!dateStr || !venue) return null;
                
                const parsedDate = parseDate(dateStr);
                
                return {
                  date: formatDate(parsedDate),
                  venue,
                  location,
                  ticketInfo,
                  buttonText,
                  parsedDate,
                };
              })
              .filter((gig): gig is Gig => gig !== null)
              .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
            
            resolve(parsedGigs);
          },
          error: reject,
        });
      });
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-24 pt-16 border-t-4 border-foreground">
        <p className="font-body text-base md:text-lg uppercase text-center">
          Unable to load gigs. Please try again later.
        </p>
      </div>
    );
  }

  const now = new Date();
  const upcomingGigs = gigs?.filter(gig => gig.parsedDate >= now) || [];

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-24 pt-16 border-t-4 border-foreground">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider text-center mb-12">
          UPCOMING GIGS
        </h2>
        <div className="flex justify-center">
          <div className="animate-pulse font-body text-lg uppercase">Loading gigs...</div>
        </div>
      </div>
    );
  }

  if (!upcomingGigs || upcomingGigs.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-24 pt-16 border-t-4 border-foreground">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider text-center mb-12">
          UPCOMING GIGS
        </h2>
        <p className="font-body text-base md:text-lg uppercase text-center">
          No upcoming gigs scheduled. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-24 pt-16 border-t-4 border-foreground">
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider text-center mb-12">
        UPCOMING GIGS
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {upcomingGigs.map((gig, index) => (
          <GigCard
            key={index}
            date={gig.date}
            venue={gig.venue}
            location={gig.location}
            ticketInfo={gig.ticketInfo}
            buttonText={gig.buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default GigSection;
