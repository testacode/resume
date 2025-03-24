import { CgTwitter } from "react-icons/cg";
import { AiOutlineTwitter } from "react-icons/ai";
import { BsLinkedin } from "react-icons/bs";
import { RiLinkedinFill } from "react-icons/ri";
import { ImInstagram } from "react-icons/im";
import { FaInstagramSquare } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import { ImGithub } from "react-icons/im";
import { RiGitlabFill } from "react-icons/ri";
import { IoLogoGitlab } from "react-icons/io5";
import { ImSkype } from "react-icons/im";

export const data = {
  main: {
    name: "Carlos Monti",
    occupation: "Senior Front End Developer",
    description:
      "I am passionate about learning while creating robust well-finished products",
    image: "avatar.png",
    bio: "I'm father of Alma, and since 10+ years a web software developer. At the moment working very comfortably with ReactJS, Redux, Redux Saga, Styled Components in a SOA (Service Oriented Architecture).",
    contactmessage:
      "If you would like to contact me then please throw a message through the contact form that I will respond to as soon as I can.",
    email: "",
    phone: "",
    address: {
      street: "Vicente López",
      city: "Buenos Aires",
      state: "Argentina",
      zip: "1605",
    },
    website: import.meta.npm_package_homepage,
    atsresumepdf: `https://github.com/testacode/resume/raw/master/public/carlos-monti-cv.pdf`,
    atsresumedocx: `https://github.com/testacode/resume/raw/master/public/carlos-monti-cv.docx`,
    social: [
      {
        enabled: false,
        name: "twitter",
        url: "https://twitter.com/xmontc",
        icon: Math.random() < 0.5 ? <CgTwitter /> : <AiOutlineTwitter />,
      },
      {
        enabled: true,
        name: "linkedin",
        url: "https://www.linkedin.com/in/carlosmonti/",
        icon: Math.random() < 0.5 ? <BsLinkedin /> : <RiLinkedinFill />,
      },
      {
        enabled: true,
        name: "instagram",
        url: "https://www.instagram.com/carlosmonti/",
        icon: Math.random() < 0.5 ? <ImInstagram /> : <FaInstagramSquare />,
      },
      {
        enabled: true,
        name: "github",
        url: "https://github.com/testacode",
        icon: Math.random() < 0.5 ? <FaGithubSquare /> : <ImGithub />,
      },
      {
        enabled: true,
        name: "gitlab",
        url: "https://gitlab.com/carlosmonti",
        icon: Math.random() < 0.5 ? <RiGitlabFill /> : <IoLogoGitlab />,
      },
      {
        enabled: false,
        name: "skype",
        url: "skype:carlos.monti83?call",
        icon: <ImSkype />,
      },
    ],
  },
  resume: {
    skillmessage: "Skill I've earned through years",
    education: [
      {
        school: "Escuela Multimedial Da Vinci",
        degree: "Desarrollo Multimedia",
        graduated: "Not graduated (3 years)",
        description:
          "Learned basic procedural coding, repetition structures, graphic design, image and sound composition.",
      },
      {
        school: "Escuelas de las Americas Nº 5",
        degree: "Economics Science Bachelor",
        graduated: "March 2002",
      },
    ],
    work: [
      {
        company: "Despegar.com",
        title: "Senior II Front End Web Developer",
        years: "July 2023 - Present",
        technology: "Typescript, ReactJS, NextJs",
        description:
          "Worked on After Sales department (Flights, Hotels, etc) until December of 2024. Then recluted to a smaller team to an experimental development area.",
      },
      {
        company: "Blockchain.com",
        title: "Senior II Front End Web Developer",
        years: "January 2022 - July 2022",
        technology: "Typescript, ReactJS, Webpack, Redux, Redux-Saga",
        description: "Started working on the non-custodial wallet.",
      },
      {
        company: "Elementum",
        title: "Senior II Front End Web Developer",
        years: "August 2017 - January 2022",
        technology:
          "ReactJS, Webpack, Redux, Redux-Saga, Lodash, Jest/Enzyme, ESLint for readable code.",
        description:
          "Created a React App from scratch with proper unit testing, worked transversally through several apps performing code reviews, repositories maintainment.",
      },
      {
        company: "Deloitte (Globant)",
        title: "Senior Front End Web Developer",
        years: "February 2016 - July 2017",
        technology: "Angular (1.6), Lodash/Underscore, Karma/Jasmine",
        description:
          'Development for a punctual project called "Rmss" (Resource Management Staff Setup). Tool for managing resources, adding skills for resources, etc.',
        contractor: "* Globant Contractor",
      },
      {
        company: "Thomas Cook (Globant)",
        title: "Senior Front End Web Developer",
        years: "December 2015 - January 2016",
        technology: "Angular (1.3), Lodash/Underscore, Karma/Jasmine",
        description:
          "Development for the global page of Thomas Cook (thomascook.com). Lets the user to book flights, hotels, etc. all over Europe",
        contractor: "* Globant Contractor",
      },
      {
        company: "Walt Disney Parks and Resorts (Globant)",
        title: "Senior Front End Web Developer",
        years: "May 2011 - December 2015",
        technology:
          "PHP, Zend Framework, PhpUnit, Vanilla Javascript, jQuery, jBehave, Angular (1.3), Less, Karma/Jasmine, Bower, Behat",
        description:
          "Development of the new Disney Personal Experience Portal - My Disney Experience (2.0)",
        contractor: "* Globant Contractor",
      },
    ],
    skills: [
      {
        name: "Git",
        level: "60%",
      },
      {
        name: "ReactJs",
        level: "90%",
      },
      {
        name: "Webpack",
        level: "90%",
      },
      {
        name: "CSS",
        level: "90%",
      },
      {
        name: "HTML5",
        level: "100%",
      },
      {
        name: "Agile Methodology",
        level: "90%",
      },
      {
        name: "Unit Testing",
        level: "90%",
      },
    ],
  },
  testimonials: {
    testimonials: [
      {
        text: "Carlos has proven to be a great developer and definitely a hard worker. He is always willing to give a hand whenever he can. He is a detail oriented professional, and a great person to work with.",
        user: "F. Jauregui",
      },
      {
        text: "Carlos is a really dedicated professional, with excellent interpersonal skills, committed and goal-oriented. He is efficient, solution oriented and really easy to work with- even if I managed him remotely (Montreal/Buenos Aires)-. It was a real pleasure to work with Carlos and personally recommend this talented professional , which is a real asset for any company…I hope to work with him again in a near future.",
        user: "S. Kecili",
      },
      {
        text: "I've had the pleasure of sharing a team with Carlos during the two years I've worked for Disney in Globant. Charlie is an asset for any team, both in spirit and deed. He has amazing energy and charm, and is able to lift any team's morale just by being there, and being Charlie. He also happens to be a naturally gifted front end developer, with a great eye for style, and an encyclopedic knowledge of CSS and HTML. He's been the team's point of reference for both technologies for as long as I've worked with him. Working with Carlos will be one of the things I miss the most about the Disney project.",
        user: "J. Lorenzana",
      },
    ],
  },
};
