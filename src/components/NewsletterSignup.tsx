interface NewsletterSignupProps {
  showRainbow: boolean;
  onHover: (hovered: boolean) => void;
}

const NewsletterSignup = ({ showRainbow, onHover }: NewsletterSignupProps) => {
  const borderColor = showRainbow ? 'border-black' : 'border-foreground';
  const textColor = showRainbow ? 'text-black' : 'text-foreground';

  return (
    <section className="w-full space-y-8">
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wider ${textColor}`}>
        Subscribe to the Newsletter
      </h2>

      <div
        className={`overflow-hidden transition-all duration-300 ${borderColor} border-2`}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <iframe
          src="https://emt-dptiwtc9n.topmailer.net/hp/FdFKfo2-TjyTTQVZy11B6A/signup"
          title="Subscribe to MY LIBERAL PONY newsletter"
          style={{
            width: '100%',
            height: '180px',
            border: 0,
            filter: showRainbow ? 'none' : 'invert(1)',
            transition: 'filter 0.5s ease',
          }}
        />
      </div>
    </section>
  );
};

export default NewsletterSignup;
