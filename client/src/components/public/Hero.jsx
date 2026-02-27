import logo from '../../assets/SRIGANDHA_LOGO.png';

const Hero = ({ title, subtitle, backgroundImage }) => {
  return (
    <div
      className="relative bg-cover bg-center h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' // Slightly richer yellow/orange gradient
      }}
    >
      {/* Dark overlay for text readability */}
      <div className={`absolute inset-0 ${backgroundImage ? 'bg-black/50' : 'bg-black/10'}`}></div>

      {/* Decorative Logo Watermark (only if no background image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <img
            src={logo}
            alt=""
            className="w-full h-auto opacity-[0.07] transform -rotate-12 scale-125 md:scale-150 grayscale blur-[1px]"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl font-medium drop-shadow-md text-gray-800 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Hero;