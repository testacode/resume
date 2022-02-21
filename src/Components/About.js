import React, { Component } from 'react';

class About extends Component {
  render() {
    if (this.props.data) {
      var profilepic = 'images/' + this.props.data.image;
      var bio = this.props.data.bio;
      var atsResumePDF = this.props.data.atsresumepdf;
      var atsResumeDOCX = this.props.data.atsresumedocx;
    }

    return (
      <section id="about">
        <div className="row">
          <div className="three columns">
            <img className="profile-pic" src={profilepic} alt="Carlos Monti Profile Pic" />
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
                  <a href={atsResumePDF} className="button">
                    <i className="fa fa-download" />
                    PDF Resume
                  </a>
                  <a href={atsResumeDOCX} className="button">
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
  }
}

export default About;
