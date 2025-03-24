import { useEffect } from "react";

const Header = ({ data }) => {
  useEffect(() => {
    // Preload the header background image
    const img = new Image();
    img.src = "/images/header-background.jpg";
  }, []);

  if (!data) return null;

  const { name, occupation, description, city, social } = data;

  return (
    <header id="home">
      <nav id="nav-wrap">
        <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
          Show navigation
        </a>
        <a className="mobile-btn" href="#home" title="Hide navigation">
          Hide navigation
        </a>

        <ul id="nav" className="nav">
          <li className="current">
            <a className="smoothscroll" href="#home">
              Home
            </a>
          </li>
          <li>
            <a className="smoothscroll" href="#about">
              About
            </a>
          </li>
          <li>
            <a className="smoothscroll" href="#resume">
              Resume
            </a>
          </li>
          <li>
            <a className="smoothscroll" href="#skills">
              Skills
            </a>
          </li>
        </ul>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          <h1 className="responsive-headline">I&apos;m {name}.</h1>
          <h3>
            I&apos;m a {city} based <span>{occupation}</span>. {description}.
          </h3>
          <hr />
          <ul className="social">
            {social.map((network) => {
              if (!network.enabled) return null;
              return (
                <li key={network.name}>
                  <a href={network.url}>
                    <i>{network.icon}</i>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="scrolldown">
        <a className="smoothscroll" href="#about">
          <i className="icon-down-circle" />
        </a>
      </p>
    </header>
  );
};

export default Header;
