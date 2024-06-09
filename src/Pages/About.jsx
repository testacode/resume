import React from 'react';

const About = ({ data }) => {
  if (!data) return null;

  const { bio, atsresumepdf, atsresumedocx } = data;

  return (
    <section id="about">
      <div className="row">
        <div className="three columns">
          <div className="profile-pic" alt="Carlos Monti Profile Pic" />
        </div>
        <div className="nine columns main-col">
          <h2>About Me</h2>
          <p>{bio}</p>
          <div className="row">
            <div className="columns contact-details">
              <h2>Contact Details</h2>
              <p className="address">
                <span>Check my linkedin account up there!</span>
              </p>
            </div>
            <div className="columns download">
              <p>
                <a href={atsresumepdf} className="button">
                  <i className="fa fa-download" />
                  PDF Resume
                </a>
                <a href={atsresumedocx} className="button">
                  <i className="fa fa-download" />
                  DOCX Resume
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
