export type SocialLink = {
  name: string;
  url: string;
  icon: 'linkedin' | 'github' | 'gitlab' | 'instagram' | 'email';
  enabled: boolean;
};

export type Address = {
  city: string;
  country: string;
};

export type WorkExperience = {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  technologies: string[];
  description: string;
  isContractor?: boolean;
  contractorCompany?: string;
};

export type Education = {
  school: string;
  degree: string;
  graduationDate: string;
  description?: string;
};

export type PersonalInfo = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  address: Address;
  email: string;
  resumePdfUrl: string;
  resumeDocxUrl: string;
  social: SocialLink[];
};

export type ResumeData = {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
};
