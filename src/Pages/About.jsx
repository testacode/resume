import React from "react";

const About = ({ data }) => {
  if (!data) return null;

  const { name, bio, phone, email, resumedownload } = data;

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
                <span>{phone}</span>
                <br />
                <span>{email}</span>
              </p>
            </div>
            <div className="columns download">
              <p>
                <a href={resumedownload} className="button">
                  <i className="fa fa-download" />
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

export default About;
