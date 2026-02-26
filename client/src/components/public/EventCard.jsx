import config from '../../config/env';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);

  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();
  const year = eventDate.getFullYear();
  const time = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-400 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        {event.image ? (
          <img
            src={`${config.baseUrl}${event.image}`}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Date badge */}
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg text-center overflow-hidden min-w-[60px]">
          <div className="bg-primary text-white text-xs font-bold px-3 py-1 tracking-wider">
            {month}
          </div>
          <div className="px-3 py-1">
            <span className="text-2xl font-extrabold text-gray-800 leading-none">{day}</span>
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {event.price > 0 ? (
            <span className="bg-gray-900/80 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full">
              ${event.price}
            </span>
          ) : (
            <span className="bg-green-500/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Time */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{time} &middot; {year}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Venue */}
        {event.venue && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        )}

        {/* Register Button */}
        {event.registrationLink ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm"
          >
            Register Now
            <svg className="inline-block w-4 h-4 ml-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        ) : (
          <div className="block w-full text-center bg-gray-100 text-gray-600 font-semibold px-6 py-2.5 rounded-lg text-sm">
            Details Coming Soon
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
