import type { ResumeData } from '@/types/resume';

export const resumeData: ResumeData = {
  personal: {
    name: 'Carlos Monti',
    title: 'Senior Front End Developer',
    tagline: 'Building polished web experiences with a passion for clean code and continuous learning',
    bio: 'Frontend developer with 10+ years of experience crafting web applications. Currently focused on TypeScript, React, and Next.js, building scalable solutions for large-scale products.',
    address: {
      city: 'Buenos Aires',
      country: 'Argentina',
    },
    email: '',
    resumePdfUrl: '/carlos-monti-cv.pdf',
    resumeDocxUrl: '/carlos-monti-cv-2025.docx',
    social: [
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/carlosmonti/',
        icon: 'linkedin',
        enabled: true,
      },
      {
        name: 'GitHub',
        url: 'https://github.com/testacode',
        icon: 'github',
        enabled: true,
      },
      {
        name: 'GitLab',
        url: 'https://gitlab.com/carlosmonti',
        icon: 'gitlab',
        enabled: true,
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/carlosmonti/',
        icon: 'instagram',
        enabled: true,
      },
    ],
  },
  experience: [
    {
      id: 'despegar-2023',
      company: 'Despegar.com',
      title: 'Senior II Front End Web Developer',
      startDate: '2023-07',
      endDate: null,
      technologies: ['TypeScript', 'React', 'Next.js'],
      description:
        'Built and maintained post-booking experiences for flights, hotels, and travel packages. Currently working on SOFIA, an AI chatbot project in the E2E (End-to-End) experience team.',
    },
    {
      id: 'blockchain-2022',
      company: 'Blockchain.com',
      title: 'Senior II Front End Web Developer',
      startDate: '2022-01',
      endDate: '2022-07',
      technologies: ['TypeScript', 'React', 'Webpack', 'Redux', 'Redux-Saga'],
      description:
        'Developed features for the non-custodial crypto wallet, implementing staking and rewards functionality with React, Redux, and TypeScript.',
    },
    {
      id: 'elementum-2017',
      company: 'Elementum',
      title: 'Senior II Front End Web Developer',
      startDate: '2017-08',
      endDate: '2022-01',
      technologies: ['React', 'Webpack', 'Redux', 'Redux-Saga', 'Jest', 'Enzyme', 'ESLint'],
      description:
        'Built a React application from scratch with comprehensive testing. Led cross-team code reviews and established repository standards across multiple projects.',
    },
    {
      id: 'deloitte-2016',
      company: 'Deloitte',
      title: 'Senior Front End Web Developer',
      startDate: '2016-02',
      endDate: '2017-07',
      technologies: ['Angular 1.6', 'Lodash', 'Karma', 'Jasmine'],
      description:
        'Developed RMSS (Resource Management Staff Setup), an internal tool for tracking team resources and skill allocation across the organization.',
      isContractor: true,
      contractorCompany: 'Globant',
    },
    {
      id: 'thomascook-2015',
      company: 'Thomas Cook',
      title: 'Senior Front End Web Developer',
      startDate: '2015-12',
      endDate: '2016-01',
      technologies: ['Angular 1.3', 'Lodash', 'Karma', 'Jasmine'],
      description:
        "Contributed to Thomas Cook's global booking platform, enabling users to book flights, hotels, and vacation packages across Europe.",
      isContractor: true,
      contractorCompany: 'Globant',
    },
    {
      id: 'disney-2011',
      company: 'Walt Disney Parks and Resorts',
      title: 'Senior Front End Web Developer',
      startDate: '2011-05',
      endDate: '2015-12',
      technologies: ['PHP', 'Zend Framework', 'JavaScript', 'jQuery', 'Angular 1.3', 'Less', 'Behat'],
      description:
        "Built features for My Disney Experience 2.0, Disney's guest-facing portal for park reservations, dining, and itinerary management.",
      isContractor: true,
      contractorCompany: 'Globant',
    },
  ],
  education: [
    {
      school: 'Escuela Multimedial Da Vinci',
      degree: 'Desarrollo Multimedia',
      graduationDate: 'Not graduated (3 years)',
      description:
        'Learned basic procedural coding, repetition structures, graphic design, image and sound composition.',
    },
    {
      school: 'Escuelas de las Americas Nº 5',
      degree: 'Economics Science Bachelor',
      graduationDate: 'March 2002',
    },
  ],
};
