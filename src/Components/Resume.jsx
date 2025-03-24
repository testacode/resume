import PropTypes from "prop-types";

const Resume = ({ data }) => {
  if (!data) return null;

  const { education, work, skills } = data;

  return (
    <section id="resume">
      <div className="row education">
        <div className="three columns header-col">
          <h2>
            <span>Education</span>
          </h2>
        </div>

        <div className="nine columns main-col">
          <div className="row item">
            <div className="twelve columns">
              {education?.map((edu) => (
                <div key={edu.school}>
                  <h3>{edu.school}</h3>
                  <p className="info">
                    {edu.degree} <span>&bull;</span>
                    <em className="date">{edu.graduated}</em>
                  </p>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row work">
        <div className="three columns header-col">
          <h2>
            <span>Work</span>
          </h2>
        </div>

        <div className="nine columns main-col">
          {work?.map((job) => (
            <div key={job.company}>
              <h3>{job.company}</h3>
              <p className="info">
                {job.title}
                <span>&bull;</span> <em className="date">{job.years}</em>
              </p>
              {job.technology && (
                <p className="tech-stack">
                  <strong>Technologies:</strong> {job.technology}
                </p>
              )}
              <p>{job.description}</p>
              {job.contractor && (
                <p className="contractor-note">{job.contractor}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="row skill">
        <div className="three columns header-col">
          <h2>
            <span>Skills</span>
          </h2>
        </div>

        <div className="nine columns main-col">
          <div className="bars">
            <ul className="skills" aria-label="Skills proficiency">
              {skills?.map((skill) => (
                <li key={skill.name.toLowerCase()}>
                  <span
                    style={{ width: skill.level }}
                    className={`bar-expand ${skill.name.toLowerCase()}`}
                    role="progressbar"
                    aria-valuenow={parseInt(skill.level)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label={`${skill.name} proficiency: ${skill.level}`}
                  ></span>
                  <em>{skill.name}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

Resume.propTypes = {
  data: PropTypes.shape({
    education: PropTypes.arrayOf(
      PropTypes.shape({
        school: PropTypes.string.isRequired,
        degree: PropTypes.string.isRequired,
        graduated: PropTypes.string.isRequired,
        description: PropTypes.string, // Made optional
      })
    ),
    work: PropTypes.arrayOf(
      PropTypes.shape({
        company: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        years: PropTypes.string.isRequired,
        technology: PropTypes.string,
        description: PropTypes.string.isRequired,
        contractor: PropTypes.string,
      })
    ),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        level: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default Resume;
