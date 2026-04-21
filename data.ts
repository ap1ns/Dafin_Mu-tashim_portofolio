import { Skill, Education, Experience } from './types';

export const EDUCATION_DATA: Education[] = [
  {
    institution: 'Universitas Terbuka',
    degree: 'S1 Sistem Informasi',
    period: '2025 - Present',
    description:
      'Focusing on information systems, data processing, and digital technologies through a flexible remote learning environment.',
  },
  {
    institution: 'SMK Handayani Banjaran',
    degree: 'Teknik Komputer dan Jaringan',
    period: '2021-2024',
    description:
      'Studying computer networking, hardware, basic programming, and IT infrastructure fundamentals.',
  },
];

export const SKILLS_DATA: Skill[] = [
  {
    id: 'Excel',
    name: 'Excel',
    icon: '<i class="fi fi-sr-dashboard-monitor"></i>',
    imageUrl: 'icons/excel.png', // User will add their own image
    color: 'bg-blue-100',
    projects: [
      {
        id: 'p1',
        title: 'Automated Sales & Revenue Dashboard',
        description:
          'Developed an interactive dashboard using advanced Excel functions to visualize daily sales performance, track revenue trends, and monitor top-selling products. This tool simplifies complex data into actionable insights for better business decision-making.',
        tools: ['Excel'],
        imageUrl: 'img/sales.png',
        aspectRatio: '16:9',
        videoUrl: '',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        link: '/FILE/Dasboard.xlsx',
      },
      {
        id: 'p1b',
        title: 'Comprehensive Sales & Transaction Reporting',
        description:
          'Created a structured reporting framework to manage high-volume sales records and inventory flow. Focused on data integrity and detailed documentation to ensure all transactions are accounted for and reflect real-time stock levels, supporting efficient warehouse operations and accurate record-keeping.',
        tools: ['Excel'],
        imageUrl: 'img/laporan.png',
        videoUrl: '',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        link: '/FILE/stok_barang_keluar_masuk.xlsx',
      },
      {
        id: 'p1c',
        title: 'Dynamic Employee Attendance System',
        description:
          'Designed a systematic attendance tracker that automates data entry and simplifies reporting. This project highlights my ability to organize structured data and use logical formulas to improve administrative efficiency and accuracy.',
        tools: ['Excel'],
        imageUrl: 'img/absensi.png',
        videoUrl: '',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        link: '/FILE/Absensi.xlsx',
      },
    ],
  },
  {
    id: 'word',
    name: 'Word',
    icon: '<i class="fi fi-sr-dashboard-monitor"></i>',
    imageUrl: 'icons/word.png', // User will add their own image
    color: 'bg-blue-100',
    projects: [
      {
        id: 'p1',
        title: 'Comprehensive Industrial Internship Report',
        description:
          'Authored a detailed professional report documenting a six-month internship at PT Mitrabhakti Inti Perdana. The project involved synthesizing field data, documenting operational workflows, and presenting technical observations in a structured format. This report reflects my ability to produce professional business documentation and communicate technical processes effectively.',
        tools: ['Data Analysis', 'Excel', 'SQL'],
        imageUrl: 'word/word.png',
        aspectRatio: '16:9',
        videoUrl: '',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        link: '/FILE/LaporanPKL.docx',
      },
    ],
  },
  {
    id: 'Powerpoint',
    name: 'PowerPoint',
    icon: '<i class="fi fi-sr-dashboard-monitor"></i>',
    imageUrl: 'icons/pp.png', // User will add their own image
    color: 'bg-blue-100',
    projects: [
      // {
      //   id: 'p1',
      //   title: 'Sales Performance Dashboard',
      //   description: 'A comprehensive Power BI dashboard visualizing year-over-year sales growth and regional performance.',
      //   tools: ['Data Analysis', 'Excel', 'SQL'],
      //   imageUrl: 'https://picsum.photos/seed/sales/800/450',
      //   aspectRatio: '16:9',
      //   videoUrl: '',
      //   logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
      //     link: '/linkproject/photoshop/ph1/index.html'
      // }
    ],
  },
  {
    id: 'photoshop',
    name: 'Photo editing',
    icon: '<i class="fi fi-brands-photoshop"></i>',
    imageUrl: 'icons/Photoshop.png', // User will add their own image
    color: 'bg-blue-200',
    projects: [
      // {
      //   id: 'p3',
      //   title: 'Portrait Series Collection',
      //   description: 'Professional portrait photography with advanced retouching and skin tone correction.',
      //   tools: ['Adobe Photoshop', 'Lightroom', 'Retouching'],
      //   imageUrl: 'https://picsum.photos/seed/portrait1/600/1000',
      //   aspectRatio: '9:16',
      //   logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
      //   link: ''
      // },
      {
        id: 'p4',
        title: 'Visual Identity & Branding: Class Generation Logo',
        description:
          'Conceptualized and designed a unique visual identity for my school graduation class. This project involved creating a cohesive logo that represented the group spirit, focusing on typography, color theory, and scalable design',
        tools: ['Adobe Photoshop'],
        imageUrl: 'photoshop/ph1.png',
        aspectRatio: '16:9',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        downloadUrl: 'photoshop/ph1.png',
        downloadName: 'logo-design.txt',
      },
      {
        id: 'p41',
        title: 'Editorial Photo Retouching',
        description: 'Digital Engagement: Institutional Twibbon Design',
        tools: ['Adobe Photoshop'],
        imageUrl: 'photoshop/ph2.jpg',
        aspectRatio: '16:9',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        downloadUrl: 'photoshop/ph1.jpg',
        downloadName: 'twibbon-design.txt',
      },
      {
        id: 'p424',
        title: 'Marketing & Promotional Poster Design',
        description:
          'Created a compelling advertising poster during my school period to promote local events or products. This project sharpened my skills in layout composition, visual hierarchy, and persuasive design to effectively capture audience attention.',
        tools: ['Adobe Photoshop'],
        imageUrl: 'photoshop/ph3.png',
        aspectRatio: '16:9',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        downloadUrl: 'photoshop/ph1.png',
        downloadName: 'poster-design.txt',
      },
      {
        id: 'p42',
        title: 'Creative Cinematic Poster Production',
        description:
          "Produced a high-quality cinematic poster for a school film project. I managed the entire creative process, from photo manipulation to advanced color grading, ensuring the final design reflected the film's mood and narrative.",
        tools: ['Adobe Photoshop', 'Lightroom'],
        imageUrl: 'photoshop/ph4.png',
        aspectRatio: '16:9',
        logo: '<i class="fi fi-sr-arrow-circle-right text-black dark:text-white hover:text-white dark:hover:text-black"></i>',
        downloadUrl: 'photoshop/ph1.png',
        downloadName: 'cinematic-poster-design.txt',
      },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    icon: '<i class="fi fi-sr-code"></i>',
    imageUrl: 'icons/python.png', // User will add their own image
    color: 'bg-blue-100',
    projects: [],
  },
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    id: 'exp3',
    title: 'Administrative Data Entry',
    company: 'Vanos Store Official',
    period: '2024',
    description:
      "Handled daily sales administration tasks, including processing shipping labels and managing sales data using the company's internal web-based system.",
    highlights: [
      'Processed and printed shipping labels for daily orders',
      'Entered and managed sales transaction data into the company database',
      'Handled high-volume data entry, processing up to 1,000+ transactions per day',
      'Ensured data accuracy and consistency under fast-paced operational workflows',
    ],
    skills: ['Data Entry', 'Mictrosoft Excel', 'Sales Administration', 'Time Management'],
    type: 'full-time',
  },
  {
    id: 'exp4',
    title: 'Data Collection',
    company: 'PT. Mitrabhakti Inti Perdana',
    period: 'June 2023 - Dec 2023',
    description:
      'Assisted in survey-based data collection and data processing activities, including field surveys and report preparation for management.',
    highlights: [
      'Participated in field and out-of-town survey activities',
      'Collected, recorded, and organized survey data from multiple locations',
      'Processed and cleaned raw survey data using spreadsheets',
      'Prepared structured survey reports and data summaries',
      'Submitted finalized reports directly to the company manager',
    ],
    skills: [
      'Data Collection',
      'Survey Research',
      'Data Processing',
      'Microsoft Excel',
      'Reporting & Documentation',
    ],
    type: 'internship',
  },
];
