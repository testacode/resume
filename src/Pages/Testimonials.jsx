import PropTypes from "prop-types";

const Testimonials = ({ data }) => {
  if (!data) return null;

  return (
    <section id="testimonials">
      <div className="text-container">
        <div className="row">
          <div className="two columns header-col">
            <h1>
              <span>Client Testimonials</span>
            </h1>
          </div>

          <div className="ten columns flex-container">
            <ul className="slides">
              {data.testimonials?.map((testimonial) => (
                <li key={testimonial.user}>
                  <blockquote>
                    <p>{testimonial.text}</p>
                    <cite>{testimonial.user}</cite>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

Testimonials.propTypes = {
  data: PropTypes.shape({
    testimonials: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default Testimonials;
