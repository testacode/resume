import React from "react";

const Footer = ({ data }) => {
  if (!data) return null;

  const { social } = data;

  return (
    <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">
            {!!social &&
              social.map((network) => {
                return (
                  <li key={network.name}>
                    <a href={network.url}>
                      <i className={network.className} />
                    </a>
                  </li>
                );
              })}
          </ul>

          <ul className="copyright">
            <li>&copy; Copyright 2017 Tim Baker</li>
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
            <i className="icon-up-open" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
