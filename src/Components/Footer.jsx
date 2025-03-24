import PropTypes from "prop-types";

const Footer = ({ data }) => {
  if (!data) return null;

  return (
    <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">
            {data.social?.map((network) => (
              <li key={network.name}>
                <a href={network.url}>
                  <i className={network.className}></i>
                </a>
              </li>
            ))}
          </ul>

          <ul className="copyright">
            <li>&copy; Copyright 2024</li>
            <li>
              Design by{" "}
              <a title="Styleshout" href="http://www.styleshout.com/">
                Styleshout
              </a>
            </li>
          </ul>
        </div>
        <div id="go-top">
          <a className="smoothscroll" title="Back to Top" href="#home">
            <i className="icon-up-open"></i>
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
        className: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default Footer;
