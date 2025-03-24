import PropTypes from "prop-types";

const Footer = ({ data }) => {
  if (!data) return null;

  const { social } = data;

  return (
    <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links" aria-label="Social media links">
            {social
              ?.filter((network) => network.enabled)
              .map((network) => (
                <li key={network.name}>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${network.name} profile`}
                  >
                    {network.icon}
                  </a>
                </li>
              ))}
          </ul>

          <ul className="copyright">
            <li>&copy; Copyright 2024</li>
            <li>
              Design by{" "}
              <a
                title="Styleshout"
                href="http://www.styleshout.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Styleshout website"
              >
                Styleshout
              </a>
            </li>
          </ul>
        </div>
        <div id="go-top">
          <a
            className="smoothscroll"
            title="Back to Top"
            href="#home"
            aria-label="Scroll back to top"
          >
            <i className="icon-up-open" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  data: PropTypes.shape({
    social: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        enabled: PropTypes.bool.isRequired,
      })
    ),
  }),
};

export default Footer;
