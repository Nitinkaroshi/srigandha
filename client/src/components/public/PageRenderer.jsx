import PropTypes from 'prop-types';
import Hero from './Hero';

const PageRenderer = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'hero':
        return (
          <Hero
            key={index}
            title={section.content.title || ''}
            subtitle={section.content.subtitle || ''}
            backgroundImage={section.content.backgroundImage}
          />
        );

      case 'text':
        return (
          <section key={index} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content.html }}
              />
            </div>
          </section>
        );

      case 'image':
        return (
          <section key={index} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.content.url && (
                <div className="text-center">
                  <img
                    src={`http://localhost:5000${section.content.url}`}
                    alt={section.content.caption || 'Page image'}
                    className="mx-auto rounded-lg shadow-lg max-w-full"
                  />
                  {section.content.caption && (
                    <p className="mt-4 text-gray-600 italic">{section.content.caption}</p>
                  )}
                </div>
              )}
            </div>
          </section>
        );

      case 'custom':
        return (
          <section key={index}>
            <div dangerouslySetInnerHTML={{ __html: section.content.html }} />
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {sections
        .sort((a, b) => a.order - b.order)
        .map((section, index) => renderSection(section, index))}
    </div>
  );
};

PageRenderer.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      order: PropTypes.number,
      content: PropTypes.object
    })
  ).isRequired
};

export default PageRenderer;
