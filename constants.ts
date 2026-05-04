
export const KELAS_OPTIONS: Record<string, string[]> = {
    'SMA': ['10', '11', '12']
};

export interface TeacherMapping {
  subject: string;
  teachers: { name: string; classes: string[] }[];
}

export const TEACHER_DATA: TeacherMapping[] = [
  {
    subject: "PENDIDIKAN AGAMA ISLAM",
    teachers: [
      { name: "Nurlaila, S.Ag", classes: ["10", "12"] },
      { name: "Sadam Hamzah, SHI", classes: ["10"] },
      { name: "Muhammad Suhail, S.Pd", classes: ["11"] }
    ]
  },
  {
    subject: "Pendidikan Pancasila",
    teachers: [
      { name: "Rendi Ramadhan, S.Pd", classes: ["10", "11"] },
      { name: "Antoni Firdaus, M.Pd", classes: ["12"] }
    ]
  },
  {
    subject: "Bahasa Indonesia",
    teachers: [
        { name: "H. Asep Saepudin, M.Pd", classes: ["10"] },
        { name: "Hj. Barrirotul Choiriyah, SEI", classes: ["10", "11"] },
        { name: "Edi Sanjaya, S.Pd", classes: ["11"] },
        { name: "Fadilah Abidana, M.Pd", classes: ["12"] }
    ]
  },
  {
      subject: "Bahasa Inggris",
      teachers: [
          { name: "Muslich Anwar, M.Pd", classes: ["10", "12"] },
          { name: "Zaini Fikri, S.Pd,I", classes: ["10"] },
          { name: "Lulu Zahrotunnisa, S.Pd", classes: ["10"] },
          { name: "Fadilah Abidana, M.Pd", classes: ["11"] },
          { name: "Ahmad Firdaus, S.Ag", classes: ["11"] },
          { name: "Mursyid Anwar, M.Pd", classes: ["12"] }
      ]
  },
  {
      subject: "Matematika",
      teachers: [
          { name: "Mali, S.Pd", classes: ["10", "11"] },
          { name: "Nurachman, M.Pd", classes: ["12"] }
      ]
  },
  {
      subject: "Matematika Tingkat Lanjut",
      teachers: [
          { name: "Putri Dina Oktavia, S.Pd", classes: ["11"] },
          { name: "Rizki Karomah, S.Pd", classes: ["12"] }
      ]
  },
  {
      subject: "Sejarah",
      teachers: [
          { name: "Subhan, S.Pd", classes: ["10"] },
          { name: "M. Hidayatu Rusdy, SH", classes: ["11"] },
          { name: "Saleha Mufida, M.Han", classes: ["12"] }
      ]
  },
  {
      subject: "Fisika",
      teachers: [
          { name: "Rizki Karomah, S.Si", classes: ["10", "11", "12"] }
      ]
  },
  {
      subject: "Kimia",
      teachers: [
          { name: "Ir. Rahmawati, M.Pd", classes: ["10", "11", "12"] }
      ]
  },
  {
      subject: "Biologi",
      teachers: [
          { name: "Padlin, M.Pd", classes: ["10", "11", "12"] }
      ]
  },
  {
      subject: "Ekonomi",
      teachers: [
          { name: "Doni Subiyanto, SE", classes: ["10", "12"] },
          { name: "Khairil Fahmi", classes: ["10"] },
          { name: "Hj. Barrirotul Choiriyah, S", classes: ["11"] }
      ]
  },
  {
      subject: "Geografi",
      teachers: [
          { name: "Hj. Barrirotul Choiriyah, S", classes: ["10"] },
          { name: "Doni Subiyanto, SE", classes: ["10", "11"] },
          { name: "Adam Hafidz, S.M", classes: ["12"] }
      ]
  },
  {
      subject: "Sosiologi",
      teachers: [
          { name: "Liyas Syarifudin, M.Pd", classes: ["10", "11", "12"] }
      ]
  },
  {
      subject: "Antropologi",
      teachers: [
          { name: "Muhammad Hidayatu Rus", classes: ["11"] },
          { name: "Saleha Mufida, M.Han", classes: ["12"] }
      ]
  },
  {
      subject: "Penjaskes",
      teachers: [
          { name: "Toni, S.Go", classes: ["10"] },
          { name: "Wintarsa, S.Pd.I", classes: ["11", "12"] }
      ]
  },
  {
      subject: "Informatika",
      teachers: [
          { name: "Adam Hafidz, SM", classes: ["10"] },
          { name: "Fadhilah, S.Pd", classes: ["10"] },
          { name: "Muhammad Rahul Sayyid", classes: ["11"] },
          { name: "Ahmad Jaenilma, S.Kom", classes: ["12"] }
      ]
  },
  {
      subject: "Life Skill",
      teachers: [
          { name: "Adam Hafidz, SM", classes: ["10"] },
          { name: "Fadhilah, S.Pd", classes: ["10", "12"] },
          { name: "Hafidz Hidayat, S.Pd", classes: ["11"] }
      ]
  },
  {
      subject: "Bahasa Sunda",
      teachers: [
          { name: "Siti Nurzulfiyah, S.Pd", classes: ["10", "11", "12"] }
      ]
  },
  {
      subject: "Al Qur'an",
      teachers: [
          { name: "Ahmad Fahrudin", classes: ["10"] },
          { name: "Namin, S.Pd.I", classes: ["11", "12"] }
      ]
  },
  {
      subject: "Tahfidz",
      teachers: [
          { name: "Khairil Fahmi, S.Pd", classes: ["10"] },
          { name: "Fadhilah, S.Pd", classes: ["12"] }
      ]
  },
  {
      subject: "Hadits",
      teachers: [
          { name: "Syahroni", classes: ["10", "12"] }
      ]
  },
  {
      subject: "Fiqih",
      teachers: [
          { name: "Muhammad Suhail, S.Pd", classes: ["10", "11"] },
          { name: "Khairil Fahmi, S.Pd", classes: ["12"] }
      ]
  },
  {
      subject: "Bahasa Arab",
      teachers: [
          { name: "Muhammad Rahul Sayyid", classes: ["10"] },
          { name: "M. Alief Nugraha Afta", classes: ["11", "12"] }
      ]
  }
];

const islamicAndLanguageSubjects = [
    'Grammar', 'Nahwu', 'Sharaf', 'Ulumul Quran', 'Ushul Fiqh', 'Tarbiyah', 'Insya', 'Mushtolahul Hadits', 'Tarikh Islam'
];

// Consolidate all subjects that should be treated as Arabic context into one list.
const allArabicRelatedSubjects = [
    'Bahasa Arab', 'Nahwu', 'Sharaf', 'Shorof', 'Tarbiyah', 'Insya', 'Hadits',
    'Mushtolahul Hadits', 'Fiqih', 'Tarikh Islam', 'Balaghah', 'Imla',
    'Khot', 'Khot Imla', 'Muthola\'ah', 'Muthalaah', 'Tamrin Lughoh', 
    'Tamrin Lughah', 'Tafsir', 'Ulumul Qur\'an', 'Ushul Fiqh', "Al Qur'an", "Tahfidz", "PENDIDIKAN AGAMA ISLAM"
];

const fullArabicSubjects = [...new Set(allArabicRelatedSubjects.map(s => s.toUpperCase().replace(/'|\\/g, '')))];

export const ARABIC_SUBJECTS = [
    ...new Set([
        'PENDIDIKAN AGAMA ISLAM',
        ...fullArabicSubjects
    ])
];

// Subjects considered as exact sciences for question count logic
export const EKSAK_SUBJECTS = ['MATEMATIKA', 'MATEMATIKA TINGKAT LANJUT', 'IPA', 'FISIKA', 'KIMIA', 'BIOLOGI', 'INFORMATIKA', 'KODING DAN KECERDASAN ARTIFISIAL (KKA)'];

const teacherSubjects = TEACHER_DATA.map(t => t.subject);
const additionalSubjects = ['Koding dan Kecerdasan Artifisial (KKA)', 'Seni Budaya', 'Prakarya', ...islamicAndLanguageSubjects];
const allSmaSubjects = [...new Set([...teacherSubjects, ...additionalSubjects])].sort();

export const MATA_PELAJARAN_OPTIONS: Record<string, string[]> = {
    'SMA': allSmaSubjects
};

export const ALOKASI_WAKTU_OPTIONS: Record<string, string[]> = {
    'SMA': ['2 JP/minggu (90 menit/minggu)', '3 JP/minggu (135 menit/minggu)', '4 JP/minggu (180 menit/minggu)']
};

export const PESANTREN_SOAL_LETTERS = ['Alif', 'Ba', 'Jim', 'Dal', 'Ha', 'Waw', 'Zay'];
export const PESANTREN_SOAL_LETTERS_LATIN = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const MODULE_COLORS = {
    blue: { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverBorder: 'hover:border-blue-500' },
    green: { bg: 'bg-green-500', border: 'border-green-200', text: 'text-green-600', hoverBg: 'hover:bg-green-50', hoverBorder: 'hover:border-green-500' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-600', hoverBg: 'hover:bg-orange-50', hoverBorder: 'hover:border-orange-500' },
    pink: { bg: 'bg-pink-500', border: 'border-pink-200', text: 'text-pink-600', hoverBg: 'hover:bg-pink-50', hoverBorder: 'hover:border-pink-500' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-200', text: 'text-purple-600', hoverBg: 'hover:bg-purple-50', hoverBorder: 'hover:border-purple-500' },
    indigo: { bg: 'bg-indigo-500', border: 'border-indigo-200', text: 'text-indigo-600', hoverBg: 'hover:bg-indigo-50', hoverBorder: 'hover:border-indigo-500' },
    cyan: { bg: 'bg-cyan-500', border: 'border-cyan-200', text: 'text-cyan-600', hoverBg: 'hover:bg-cyan-50', hoverBorder: 'hover:border-cyan-500' },
    gray: { bg: 'bg-gray-500', border: 'border-gray-200', text: 'text-gray-600', hoverBg: 'hover:bg-gray-50', hoverBorder: 'hover:border-gray-500' }
};

export const APP_MODULES = [
  {
    id: 'admin',
    title: 'Generator Admin Guru',
    description: 'ATP, Prota, Promes, Modul Ajar, KKTP, & Jurnal Harian.',
    color: 'blue',
  },
  {
    id: 'soal',
    title: 'Generator Bank Soal',
    description: 'Bank soal adaptif, kisi-kisi, & rubrik penilaian.',
    color: 'green',
  },
  {
    id: 'tryout',
    title: 'Generator Soal TO & UAS',
    description: 'Latihan ujian komprehensif Kelas 10, 11, 12 & Bank Soal TKA.',
    color: 'orange',
  },
  {
    id: 'groundedSearch',
    title: 'Pencarian Cerdas',
    description: 'Dapatkan jawaban akurat dari web & peta terkini.',
    color: 'pink',
  },
  {
    id: 'academic',
    title: 'Terminal Edukasi',
    description: 'Kamus KBBI, Wikipedia, & Riset Akademik Mandiri.',
    color: 'purple',
  },
  {
    id: 'ebook',
    title: 'Perpustakaan Digital',
    description: 'Akses ribuan buku digital resmi dari Kemendikbud.',
    color: 'orange',
    url: 'https://buku.kemendikdasmen.go.id/',
    isOfficial: true
  },
  {
    id: 'quran',
    title: "Al Quran Digital",
    description: "Tafsir, Terjemahan & Murottal 30 Juz.",
    color: 'emerald',
  },
  {
    id: 'doa',
    title: "Koleksi Doa",
    description: "Kumpulan doa harian & dzikir mustajab.",
    color: 'teal',
  },
  {
    id: 'hadith',
    title: "Maktabah Hadits",
    description: "Koleksi hadits shahih dari 9 perawi.",
    color: 'amber',
  },
  {
    id: 'prayer',
    title: "Jadwal Sholat",
    description: "Waktu sholat akurat sesuai lokasi kota.",
    color: 'indigo',
  },
  {
    id: 'hadits',
    title: "Hadits Digital (Official)",
    description: "Akses koleksi hadits lengkap dari Hadits.id.",
    color: 'cyan',
    url: 'https://www.hadits.id/',
    isOfficial: true
  },
  {
    id: 'perpusnas',
    title: 'Perpus Nasional',
    description: 'Jelajahi koleksi buku baru dari Perpusnas RI.',
    color: 'gray',
    url: 'https://www.perpusnas.go.id/buku-baru',
    isOfficial: true
  }
];
