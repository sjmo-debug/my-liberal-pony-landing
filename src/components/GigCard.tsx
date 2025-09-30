interface GigCardProps {
  date: string;
  venue: string;
  location: string;
  ticketInfo: string;
  buttonText: string;
}

const GigCard = ({ date, venue, location, ticketInfo, buttonText }: GigCardProps) => {
  const isUrl = ticketInfo.startsWith('http');
  const isFree = ticketInfo.toLowerCase() === 'free' || ticketInfo === '';

  return (
    <div className="border-2 border-foreground p-6 hover:bg-foreground/5 transition-all duration-300 group">
      <div className="space-y-4">
        <p className="font-body text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide">
          {date}
        </p>
        <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider">
          {venue} — {location}
        </h3>
        
        {isFree ? (
          <div className="inline-block font-body text-sm md:text-base uppercase border border-foreground px-4 py-2 bg-foreground/10">
            {buttonText || 'FREE ENTRY'}
          </div>
        ) : isUrl ? (
          <a
            href={ticketInfo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-body text-sm md:text-base uppercase border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-300"
          >
            {buttonText || 'GET TICKETS'} →
          </a>
        ) : (
          <div className="inline-block font-body text-sm md:text-base uppercase border border-foreground px-4 py-2">
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigCard;
