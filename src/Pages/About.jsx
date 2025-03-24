import PropTypes from "prop-types";

const About = ({ data }) => {
  if (!data) return null;

  const { name, bio, phone, email, atsresumepdf } = data;

  return (
    <section id="about">
      <div className="row">
        <div className="three columns">
          <img
            className="profile-pic"
            src="/images/avatar.png"
            alt={`${name} profile`}
            loading="lazy"
            width="120"
            height="120"
            style={{
              borderRadius: "100%",
              objectFit: "cover",
            }}
            srcSet="/images/avatar.png 1x, /images/avatar@2x.png 2x"
          />
        </div>
        <div className="nine columns main-col">
          <h2>About Me</h2>
          <p>{bio}</p>
          <div className="row">
            <div className="columns contact-details">
              <h2>Contact Details</h2>
              <p className="address">
                <span>{name}</span>
                <br />
                <span>{phone}</span>
                <br />
                <span>{email}</span>
              </p>
            </div>
            <div className="columns download">
              <p>
                <a
                  href={atsresumepdf}
                  className="button"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download my resume in PDF format"
                >
                  <i className="fa fa-download" aria-hidden="true"></i>
                  Download Resume
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

About.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    atsresumepdf: PropTypes.string.isRequired,
  }),
};

export default About;
