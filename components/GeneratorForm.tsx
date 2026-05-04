
import React, { useState, useEffect, useRef } from 'react';
import { Module, FormData } from '../types';
import { KELAS_OPTIONS, MATA_PELAJARAN_OPTIONS, ALOKASI_WAKTU_OPTIONS, TEACHER_DATA } from '../constants';
import Spinner from './Spinner';

interface GeneratorFormProps {
  module: Module;
  onSubmit: (formData: FormData) => void;
  onBack: () => void;
  onShowAIAssistant: (data: Partial<FormData>, type: 'cp' | 'topic') => void;
  isLoading: boolean;
  generationProgress: number;
}

const LOG_STEPS: Record<string, { progress: number; message: string }[]> = {
    admin: [
        { progress: 5, message: "Menginisialisasi Model AI..." },
        { progress: 15, message: "Menganalisis Capaian Pembelajaran (CP) & Fase..." },
        { progress: 30, message: "Menyusun Alur Tujuan Pembelajaran (ATP)..." },
        { progress: 45, message: "Meng-generate Prota & Promes..." },
        { progress: 60, message: "Merancang Modul Ajar..." },
        { progress: 75, message: "Menyusun KKTP..." },
        { progress: 90, message: "Finalisasi format dokumen..." },
        { progress: 100, message: "Selesai!" }
    ],
    soal: [
        { progress: 5, message: "Menginisialisasi Model AI..." },
        { progress: 15, message: "Menganalisis Topik..." },
        { progress: 30, message: "Menyusun Kisi-kisi Soal & TKA..." },
        { progress: 50, message: "Meng-generate Naskah Soal (PG, Essay, TKA)..." },
        { progress: 70, message: "Membuat Kunci Jawaban..." },
        { progress: 85, message: "Melakukan Analisis Kualitatif..." },
        { progress: 95, message: "Finalisasi format dokumen..." },
        { progress: 100, message: "Selesai!" }
    ],
    tryout: [
        { progress: 5, message: "Menginisialisasi Model AI..." },
        { progress: 15, message: "Menganalisis Kurikulum Terpadu (Kelas 10-12)..." },
        { progress: 30, message: "Merumuskan Kisi-kisi Try Out/UAS..." },
        { progress: 50, message: "Meng-generate Soal Standar (PG & Essay)..." },
        { progress: 70, message: "Meng-generate Soal TKA (Akademik)..." },
        { progress: 85, message: "Finalisasi Kunci Jawaban & Rubrik..." },
        { progress: 100, message: "Selesai!" }
    ]
};

const GeneratorForm: React.FC<GeneratorFormProps> = ({ module, onSubmit, onBack, onShowAIAssistant, isLoading, generationProgress }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const defaultData: FormData = {
      jenjang: 'SMA',
      kelas: '', semester: '1', mata_pelajaran: '', 
      sekolah: 'SMA ISLAM AL-GHOZALI',
      tahun_ajaran: '2025-2026', nama_guru: '', fase: '',
      cp_elements: '', alokasi_waktu: '', jumlah_modul_ajar: 1,
      topik_materi: '', sertakan_kisi_kisi: true, sertakan_soal_tka: false,
      jumlah_soal_tka: 10, sertakan_soal_tka_uraian: false, jumlah_soal_tka_uraian: 5,
      kelompok_tka: 'saintek',
      jenis_soal: ['Pilihan Ganda', 'Uraian'], jumlah_pg: 30, jumlah_uraian: 4,
      jumlah_isian_singkat: 0, 
      soal_pesantren_sections: [],
      tingkat_kesulitan: 'Sedang', bahasa: 'Bahasa Indonesia',
      yayasan: '',
      alamat_sekolah: '',
      logo_sekolah: '',
      judul_asesmen: module === 'tryout' ? 'TRY OUT UJIAN AKHIR SEKOLAH' : 'PENILAIAN SUMATIF AKHIR SEMESTER GANJIL',
      tanggal_ujian: '',
      jam_ke: '', waktu_ujian: '90 Menit', use_thinking_mode: false,
    };
    try {
        const savedData = localStorage.getItem('guruAppData');
        if (savedData) return { ...defaultData, ...JSON.parse(savedData) };
    } catch (error) {}
    return defaultData;
  });
  
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [customMataPelajaran, setCustomMataPelajaran] = useState<Record<string, string[]>>({});
  const [newSubject, setNewSubject] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const processedMilestones = useRef<Set<number>>(new Set());
  const [availableTeachers, setAvailableTeachers] = useState<string[]>([]);

  useEffect(() => {
    try {
        const savedCustomSubjects = localStorage.getItem('customMataPelajaran');
        if (savedCustomSubjects) setCustomMataPelajaran(JSON.parse(savedCustomSubjects));
    } catch (error) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('customMataPelajaran', JSON.stringify(customMataPelajaran));
  }, [customMataPelajaran]);

  useEffect(() => {
    const { sekolah, nama_guru, yayasan, alamat_sekolah, jenjang, kelas, mata_pelajaran, tahun_ajaran, bahasa, semester } = formData;
    localStorage.setItem('guruAppData', JSON.stringify({ sekolah, nama_guru, yayasan, alamat_sekolah, jenjang, kelas, mata_pelajaran, tahun_ajaran, bahasa, semester }));
  }, [formData]);

  useEffect(() => {
    if (formData.jenjang) {
      setKelasOptions(KELAS_OPTIONS[formData.jenjang] || []);
      const baseSubjects = MATA_PELAJARAN_OPTIONS[formData.jenjang] || [];
      const customSubjectsForJenjang = customMataPelajaran[formData.jenjang] || [];
      const combinedSubjects = [...new Set([...baseSubjects, ...customSubjectsForJenjang])].sort();
      setMataPelajaranOptions(combinedSubjects);
      setAlokasiWaktuOptions(ALOKASI_WAKTU_OPTIONS[formData.jenjang] || []);
      setShowCustomSubject(false);
    }
  }, [formData.jenjang, customMataPelajaran]);

  useEffect(() => {
    const { mata_pelajaran, kelas } = formData;
    if (mata_pelajaran) {
        const subjectData = TEACHER_DATA.find(t => t.subject === mata_pelajaran);
        if (subjectData) {
            let teachers = subjectData.teachers;
            if (kelas) {
                const classSpecificTeachers = teachers.filter(t => t.classes.includes(kelas));
                if (classSpecificTeachers.length > 0) {
                    teachers = classSpecificTeachers;
                }
            }
            const teacherNames = teachers.map(t => t.name);
            setAvailableTeachers(teacherNames);
            if (teacherNames.length === 1 && !formData.nama_guru) {
                 setFormData(prev => ({ ...prev, nama_guru: teacherNames[0] }));
            }
        } else {
            setAvailableTeachers([]);
        }
    } else {
        setAvailableTeachers([]);
    }
  }, [formData.mata_pelajaran, formData.kelas]);
  
  useEffect(() => {
    const { jenjang, kelas } = formData;
    let newFase = '';
    const kelasNum = parseInt(kelas, 10);
    if (jenjang === 'SMA') newFase = kelasNum === 10 ? 'Fase E' : 'Fase F';
    if (newFase !== formData.fase) setFormData(prev => ({ ...prev, fase: newFase }));
  }, [formData.jenjang, formData.kelas]);

  useEffect(() => {
    if (!isLoading) { setLogs([]); processedMilestones.current.clear(); return; }
    const steps = LOG_STEPS[module] || [];
    steps.forEach((step) => {
        if (generationProgress >= step.progress && !processedMilestones.current.has(step.progress)) {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] > ${step.message}`]);
            processedMilestones.current.add(step.progress);
        }
    });
  }, [isLoading, generationProgress, module]);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const [kelasOptions, setKelasOptions] = useState<string[]>([]);
  const [mataPelajaranOptions, setMataPelajaranOptions] = useState<string[]>([]);
  const [alokasiWaktuOptions, setAlokasiWaktuOptions] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
        setShowCustomSubject(true);
        setFormData(prev => ({ ...prev, mata_pelajaran: '', nama_guru: '' }));
    }
    else { 
        setShowCustomSubject(false); 
        setFormData(prev => ({ ...prev, mata_pelajaran: value, nama_guru: '' })); 
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => {
      const newJenisSoal = checked ? [...(prev.jenis_soal || []), name] : (prev.jenis_soal || []).filter(item => item !== name);
      return { ...prev, jenis_soal: newJenisSoal };
    });
  };

  const handleSaveNewSubject = () => {
    const trimmedSubject = newSubject.trim();
    if (trimmedSubject && formData.jenjang) {
        setCustomMataPelajaran(prev => ({ ...prev, [formData.jenjang]: [...(prev[formData.jenjang] || []), trimmedSubject] }));
        setFormData(prev => ({ ...prev, mata_pelajaran: trimmedSubject }));
        setShowCustomSubject(false);
        setNewSubject('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (module === 'soal') {
        const hasStandard = (formData.jenis_soal && formData.jenis_soal.length > 0);
        const hasTKA = formData.sertakan_soal_tka || formData.sertakan_soal_tka_uraian;
        if (!hasStandard && !hasTKA) { 
            alert("Pilih minimal satu jenis soal: Standar (PG/Uraian) atau TKA (PG/Essay)."); 
            return; 
        }
    } else if (module === 'tryout') {
        const selectedTypes = formData.jenis_soal || [];
        if (selectedTypes.length === 0) { 
            alert("Pilih minimal satu jenis soal."); 
            return; 
        }
    }
    onSubmit(formData);
  };

  const title = module === 'admin' ? 'Generator Administrasi Guru' : module === 'soal' ? 'Generator Bank Soal' : 'Generator Soal TO & UAS';
  const description = module === 'admin' 
    ? 'Lengkapi form untuk menghasilkan ATP, Prota, Promes, Modul Ajar, KKTP, dan Jurnal Harian.' 
    : module === 'soal' ? 'Lengkapi form untuk menghasilkan bank soal dan perangkat asesmen adaptif.'
    : 'Lengkapi form untuk menghasilkan soal Try Out/UAS Komprehensif (Kelas 10-12) & Soal TKA.';
    
  const formElementClasses = "w-full rounded bg-black/60 border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#e9d1a3] focus:border-[#e9d1a3] focus:ring-1 focus:ring-[#e9d1a3]/30 transition-all outline-none input-metal shadow-inner";
  const labelClasses = "block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 ml-1";

  return (
    <div className="bg-[#1a1c20] rounded-xl shadow-2xl p-8 fade-in border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="mb-10 text-center">
          <button onClick={onBack} className="text-gray-500 hover:text-[#e9d1a3] text-[10px] font-black mb-6 flex items-center justify-center group transition-colors uppercase tracking-[0.3em] mx-auto border border-white/5 bg-black/40 px-4 py-2 rounded shadow-inner">
            <svg className="w-3 h-3 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            ← BACK TO TERMINAL
          </button>
          <h2 className="text-3xl font-black text-[#e9d1a3] tracking-[0.15em] uppercase drop-shadow-md">{title}</h2>
          <div className="w-12 h-1 bg-[#e9d1a3]/30 mx-auto mt-4 mb-2 rounded-full shadow-[0_0_10px_rgba(233,209,163,0.3)]"></div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-3 max-w-xl mx-auto italic">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Jenjang</label>
              <select name="jenjang" value={formData.jenjang} onChange={handleChange} required className={formElementClasses}>
                <option value="SMA">SMA</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Kelas</label>
              <select name="kelas" value={formData.kelas} onChange={handleChange} required className={formElementClasses}>
                <option value="">Pilih Kelas</option>
                {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Mata Pelajaran</label>
              <select name="mata_pelajaran_select" value={showCustomSubject ? 'custom' : formData.mata_pelajaran} onChange={handleSubjectChange} required className={formElementClasses}>
                <option value="">Pilih Mapel</option>
                {mataPelajaranOptions.map(m => <option key={m} value={m}>{m}</option>)}
                <option value="custom">Tambah Baru...</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Bahasa</label>
              <select name="bahasa" value={formData.bahasa} onChange={handleChange} className={formElementClasses}>
                <option>Bahasa Indonesia</option>
                <option>Bahasa Inggris</option>
              </select>
            </div>
          </div>

          {showCustomSubject && (
            <div className="flex items-center space-x-2 fade-in bg-black/40 p-3 rounded border border-[#e9d1a3]/20 shadow-inner">
              <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className={formElementClasses} placeholder="Nama mapel baru..." />
              <button type="button" onClick={handleSaveNewSubject} className="px-6 py-3 bg-[#e9d1a3] text-[#1a1c20] rounded text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 active:translate-y-px transition-all">SIMPAN</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required className={formElementClasses}>
                <option value="1">Semester 1 (Ganjil)</option>
                <option value="2">Semester 2 (Genap)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Tahun Ajaran</label>
              <input type="text" name="tahun_ajaran" value={formData.tahun_ajaran} onChange={handleChange} required className={formElementClasses} placeholder="2025-2026" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Nama Sekolah</label>
              <input type="text" name="sekolah" value={formData.sekolah} onChange={handleChange} required className={formElementClasses} placeholder="Nama Sekolah" />
            </div>
            <div className="space-y-1 relative">
              <label className={labelClasses}>Nama Pengajar</label>
              <input list="teacher-list" type="text" name="nama_guru" value={formData.nama_guru} onChange={handleChange} required className={formElementClasses} placeholder="Nama Pengajar" autoComplete="off" />
              <datalist id="teacher-list">
                {availableTeachers.map((teacher, index) => <option key={index} value={teacher} />)}
              </datalist>
            </div>
          </div>

          {module === 'admin' && (
            <div className="bg-black/40 p-6 rounded-lg border border-white/5 shadow-inner space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className={labelClasses}>Fase</label>
                  <select name="fase" value={formData.fase} onChange={handleChange} required className={formElementClasses}>
                    <option value="">Pilih Fase</option>
                    <option value="Fase E">Fase E (10 SMA)</option>
                    <option value="Fase F">Fase F (11-12 SMA)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Alokasi Waktu</label>
                  <select name="alokasi_waktu" value={formData.alokasi_waktu} onChange={handleChange} required className={formElementClasses}>
                    <option value="">Pilih Alokasi</option>
                    {alokasiWaktuOptions.map(aw => <option key={aw} value={aw}>{aw}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Jumlah Modul Ajar</label>
                  <input type="number" name="jumlah_modul_ajar" value={formData.jumlah_modul_ajar} onChange={handleChange} required min="1" max="10" className={formElementClasses} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className={labelClasses}>Elemen Capaian Pembelajaran (CP)</label>
                  <button type="button" onClick={() => onShowAIAssistant(formData, 'cp')} className="text-[9px] font-black text-[#e9d1a3] uppercase tracking-widest border border-[#e9d1a3]/30 px-2 py-1 rounded bg-[#e9d1a3]/5 hover:bg-[#e9d1a3]/10 transition-colors">✨ Saran AI</button>
                </div>
                <textarea name="cp_elements" value={formData.cp_elements ?? ''} onChange={handleChange} required rows={4} className={`${formElementClasses} normal-case font-medium min-h-[120px]`} placeholder="Masukkan Elemen CP..." />
              </div>
            </div>
          )}

          {(module === 'soal' || module === 'tryout') && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className={labelClasses}>{module === 'tryout' ? 'Daftar Materi Kumulatif' : 'Topik / Materi Spesifik'}</label>
                  <button type="button" onClick={() => onShowAIAssistant(formData, 'topic')} className="text-[9px] font-black text-[#e9d1a3] uppercase tracking-widest border border-[#e9d1a3]/30 px-2 py-1 rounded bg-[#e9d1a3]/5 hover:bg-[#e9d1a3]/10 transition-colors">✨ Saran AI</button>
                </div>
                <textarea name="topik_materi" value={formData.topik_materi ?? ''} onChange={handleChange} required rows={3} className={`${formElementClasses} normal-case font-medium min-h-[100px]`} placeholder="Masukkan Materi Utama..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1e3a8a]/10 p-6 rounded-lg border border-blue-500/10 shadow-inner">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 border-b border-blue-500/10 pb-2">Standar Questions</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" name="Pilihan Ganda" checked={formData.jenis_soal?.includes('Pilihan Ganda')} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-white/20 bg-black text-[#e9d1a3] focus:ring-[#e9d1a3]"/> 
                        <span className="text-[11px] font-black text-gray-400 group-hover:text-blue-300 uppercase tracking-widest">PG</span>
                      </label>
                      {formData.jenis_soal?.includes('Pilihan Ganda') && <input type="number" name="jumlah_pg" value={formData.jumlah_pg} onChange={handleChange} className="w-20 rounded bg-black/60 border border-blue-500/20 px-3 py-2 text-xs font-black text-blue-400 text-center" min="1" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" name="Uraian" checked={formData.jenis_soal?.includes('Uraian')} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-white/20 bg-black text-[#e9d1a3] focus:ring-[#e9d1a3]"/> 
                        <span className="text-[11px] font-black text-gray-400 group-hover:text-blue-300 uppercase tracking-widest">Essay</span>
                      </label>
                      {formData.jenis_soal?.includes('Uraian') && <input type="number" name="jumlah_uraian" value={formData.jumlah_uraian} onChange={handleChange} className="w-20 rounded bg-black/60 border border-blue-500/20 px-3 py-2 text-xs font-black text-blue-400 text-center" min="1" />}
                    </div>
                  </div>
                </div>

                <div className="bg-[#e9d1a3]/5 p-6 rounded-lg border border-[#e9d1a3]/10 shadow-inner">
                  <h4 className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.2em] mb-4 border-b border-[#e9d1a3]/10 pb-2">Academic Potential (TKA)</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" name="sertakan_soal_tka" checked={!!formData.sertakan_soal_tka} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-black text-[#e9d1a3] focus:ring-[#e9d1a3]"/> 
                        <span className="text-[11px] font-black text-gray-500 group-hover:text-[#e9d1a3] uppercase tracking-widest">PG TKA</span>
                      </label>
                      {formData.sertakan_soal_tka && <input type="number" name="jumlah_soal_tka" value={formData.jumlah_soal_tka} onChange={handleChange} className="w-20 rounded bg-black/60 border border-[#e9d1a3]/20 px-3 py-2 text-xs font-black text-[#e9d1a3] text-center" min="1" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" name="sertakan_soal_tka_uraian" checked={!!formData.sertakan_soal_tka_uraian} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-black text-[#e9d1a3] focus:ring-[#e9d1a3]"/> 
                        <span className="text-[11px] font-black text-gray-500 group-hover:text-[#e9d1a3] uppercase tracking-widest">Essay TKA</span>
                      </label>
                      {formData.sertakan_soal_tka_uraian && <input type="number" name="jumlah_soal_tka_uraian" value={formData.jumlah_soal_tka_uraian} onChange={handleChange} className="w-20 rounded bg-black/60 border border-[#e9d1a3]/20 px-3 py-2 text-xs font-black text-[#e9d1a3] text-center" min="1" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-4">
            <div className="space-y-1">
              <label className={labelClasses}>Difficulty Level</label>
              <select name="tingkat_kesulitan" value={formData.tingkat_kesulitan} onChange={handleChange} className={formElementClasses}>
                <option>Mudah</option>
                <option>Sedang</option>
                <option>Sulit (HOTS)</option>
              </select>
            </div>
            <div className="bg-black/60 p-4 rounded border border-white/5 flex items-center justify-between shadow-inner">
              <div className="flex items-center">
                <span className="text-xl mr-3 grayscale brightness-125">🧠</span>
                <div>
                  <span className="block text-[10px] font-black text-[#e9d1a3] uppercase tracking-widest leading-none">INTELLIGENCE MODE (HOTS)</span>
                  <span className="block text-[8px] text-gray-600 mt-1 uppercase font-black tracking-widest">High-Order Thinking Analysis Enabled</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="use_thinking_mode" checked={!!formData.use_thinking_mode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e9d1a3] peer-checked:after:bg-[#1a1c20]"></div>
              </label>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4 pt-6 border-t border-white/5 fade-in">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.3em] animate-pulse">Processing Neural Nodes...</span>
                <span className="text-[10px] font-black text-[#e9d1a3]">{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-black/60 rounded h-1.5 overflow-hidden border border-white/5">
                <div className="bg-gold-gradient h-full transition-all duration-300" style={{ width: `${generationProgress}%` }}></div>
              </div>
              <div className="bg-black/90 rounded border border-white/5 p-4 h-32 overflow-y-auto font-mono text-[9px] text-green-500/70 shadow-inner custom-scrollbar relative">
                <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
                {logs.map((log, i) => <p key={i} className="mb-1 uppercase tracking-tighter"><span className="opacity-30">[{new Date().toLocaleTimeString()}]</span> {log}</p>)}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-white/5">
            <button type="submit" disabled={isLoading} className="w-full py-6 rounded-lg btn-gold relative overflow-hidden group">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <svg className="animate-spin h-5 w-5 text-[#1a1c20]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ANALYZING DATA...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <span>EXECUTE GENERATION</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              )}
            </button>
            <p className="text-center text-[8px] text-gray-700 mt-4 font-black uppercase tracking-[0.5em] opacity-50">Operational Authorization Required // Clearances Confirmed</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratorForm;
