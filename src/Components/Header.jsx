import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const Header = ({ data }) => {
  const handleScroll = useCallback((e, target) => {
    e.preventDefault();
    const element = document.querySelector(target);
    if (!element) return;

    window.scrollTo({
      top: element.offsetTop,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const setHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        header.style.height = `${window.innerHeight}px`;
      }
    };

    // Set initial height
    setHeaderHeight();

    // Update on resize
    window.addEventListener("resize", setHeaderHeight);
    return () => window.removeEventListener("resize", setHeaderHeight);
  }, []);

  if (!data) return null;

  const {
    name,
    occupation,
    description,
    address: { city },
    social,
  } = data;

  return (
    <header id="home">
      <nav id="nav-wrap" role="navigation" aria-label="Main navigation">
        <a
          className="mobile-btn"
          href="#nav-wrap"
          title="Show navigation"
          aria-label="Show navigation menu"
        >
          Show navigation
        </a>
        <a
          className="mobile-btn"
          href="#home"
          title="Hide navigation"
          aria-label="Hide navigation menu"
        >
          Hide navigation
        </a>

        <ul id="nav" className="nav">
          <li className="current">
            <a
              className="smoothscroll"
              href="#home"
              onClick={(e) => handleScroll(e, "#home")}
              aria-label="Go to home section"
            >
              Home
            </a>
          </li>
          <li>
            <a
              className="smoothscroll"
              href="#about"
              onClick={(e) => handleScroll(e, "#about")}
              aria-label="Go to about section"
            >
              About
            </a>
          </li>
          <li>
            <a
              className="smoothscroll"
              href="#resume"
              onClick={(e) => handleScroll(e, "#resume")}
              aria-label="Go to resume section"
            >
              Resume
            </a>
          </li>
        </ul>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          <h1 className="responsive-headline">{name}</h1>
          <h2>
            I&apos;m a {city} based <span>{occupation}</span>. {description}.
          </h2>
          <hr />
          <ul className="social" aria-label="Social media links">
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
        </div>
      </div>

      <p className="scrolldown">
        <a
          className="smoothscroll"
          href="#about"
          onClick={(e) => handleScroll(e, "#about")}
          aria-label="Scroll down to about section"
        >
          <i className="icon-down-circle" aria-hidden="true"></i>
        </a>
      </p>
    </header>
  );
};

Header.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    occupation: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    address: PropTypes.shape({
      city: PropTypes.string.isRequired,
    }).isRequired,
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

export default Header;
