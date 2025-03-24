import { useEffect, useCallback } from "react";

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
      <nav id="nav-wrap">
        <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
          Show navigation
        </a>
        <a className="mobile-btn" href="#home" title="Hide navigation">
          Hide navigation
        </a>

        <ul id="nav" className="nav">
          <li className="current">
            <a
              className="smoothscroll"
              href="#home"
              onClick={(e) => handleScroll(e, "#home")}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className="smoothscroll"
              href="#about"
              onClick={(e) => handleScroll(e, "#about")}
            >
              About
            </a>
          </li>
          <li>
            <a
              className="smoothscroll"
              href="#resume"
              onClick={(e) => handleScroll(e, "#resume")}
            >
              Resume
            </a>
          </li>
        </ul>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          <h1 className="responsive-headline">{name}</h1>
          <h3>
            I&apos;m a {city} based <span>{occupation}</span>. {description}.
          </h3>
          <hr />
          <ul className="social">
            {social?.map((network) => (
              <li key={network.name}>
                <a href={network.url}>
                  <i className={network.className}></i>
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
        >
          <i className="icon-down-circle"></i>
        </a>
      </p>
    </header>
  );
};

export default Header;
