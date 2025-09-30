interface GigCardProps {
  date: string;
  venue: string;
  location: string;
  ticketInfo: string;
  buttonText: string;
  onButtonHover: (isHovered: boolean) => void;
  isButtonHovered: boolean;
}

const GigCard = ({ date, venue, location, ticketInfo, buttonText, onButtonHover, isButtonHovered }: GigCardProps) => {
  const isUrl = ticketInfo.startsWith('http');
  const isFree = ticketInfo.toLowerCase() === 'free' || ticketInfo === '';

  return (
    <div className={`p-6 transition-all duration-300 group ${isButtonHovered ? 'border-2 border-black hover:bg-black/5' : 'border-2 border-foreground hover:bg-foreground/5'}`}>
      <div className="space-y-4">
        <p className="font-body text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide">
          {date}
        </p>
        <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider">
          {venue} — {location}
        </h3>
        
        {isFree ? (
          <div 
            className={`inline-block font-body text-base md:text-lg lg:text-xl xl:text-2xl uppercase px-6 py-4 md:px-8 md:py-5 min-h-[44px] ${isButtonHovered ? 'border-2 border-black bg-black/10' : 'border-2 border-foreground bg-foreground/10'}`}
          >
            {buttonText || 'FREE ENTRY'}
          </div>
        ) : isUrl ? (
          <a
            href={ticketInfo}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => onButtonHover(true)}
            onMouseLeave={() => onButtonHover(false)}
            className={`inline-block font-body text-base md:text-lg lg:text-xl xl:text-2xl uppercase px-6 py-4 md:px-8 md:py-5 min-h-[44px] transition-all duration-300 ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}
          >
            {buttonText || 'GET TICKETS'} →
          </a>
        ) : (
          <div className={`inline-block font-body text-base md:text-lg lg:text-xl xl:text-2xl uppercase px-6 py-4 md:px-8 md:py-5 min-h-[44px] ${isButtonHovered ? 'border-2 border-black' : 'border-2 border-foreground'}`}>
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigCard;
