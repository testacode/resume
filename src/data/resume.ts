import type { ResumeData } from '@/types/resume';

export const resumeData: ResumeData = {
  personal: {
    name: 'Carlos Monti',
    title: 'Senior Front End Developer',
    tagline: 'Passionate about learning while creating robust, well-finished products',
    bio: "I'm a father of Alma, and for 10+ years a web software developer. Currently working with TypeScript, React, and Next.js in a service-oriented architecture.",
    address: {
      city: 'Buenos Aires',
      country: 'Argentina',
    },
    email: '',
    resumePdfUrl: '/carlos-monti-cv.pdf',
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
        'Worked on After Sales department (Flights, Hotels, etc) until December 2024. Then recruited to a smaller team in an experimental development area.',
    },
    {
      id: 'blockchain-2022',
      company: 'Blockchain.com',
      title: 'Senior II Front End Web Developer',
      startDate: '2022-01',
      endDate: '2022-07',
      technologies: ['TypeScript', 'React', 'Webpack', 'Redux', 'Redux-Saga'],
      description: 'Started working on the non-custodial wallet.',
    },
    {
      id: 'elementum-2017',
      company: 'Elementum',
      title: 'Senior II Front End Web Developer',
      startDate: '2017-08',
      endDate: '2022-01',
      technologies: ['React', 'Webpack', 'Redux', 'Redux-Saga', 'Jest', 'Enzyme', 'ESLint'],
      description:
        'Created a React App from scratch with proper unit testing, worked transversally through several apps performing code reviews and repository maintenance.',
    },
    {
      id: 'deloitte-2016',
      company: 'Deloitte',
      title: 'Senior Front End Web Developer',
      startDate: '2016-02',
      endDate: '2017-07',
      technologies: ['Angular 1.6', 'Lodash', 'Karma', 'Jasmine'],
      description:
        'Development for a project called "RMSS" (Resource Management Staff Setup). Tool for managing resources and skills.',
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
        'Development for the global page of Thomas Cook. Lets users book flights, hotels, etc. across Europe.',
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
        'Development of the new Disney Personal Experience Portal - My Disney Experience (2.0).',
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
