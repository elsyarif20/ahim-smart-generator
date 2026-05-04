import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';
import { getLibraryBooks } from '../services/libraryService';

interface LibraryReaderProps {
  onBack: () => void;
}

const LibraryReader: React.FC<LibraryReaderProps> = ({ onBack }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const data = await getLibraryBooks();
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, []);

  const handleRead = (book: Book) => {
    if (book.externalUrl) {
      window.open(book.externalUrl, '_blank');
    } else {
      alert("Maaf, tautan baca untuk buku ini belum tersedia.");
    }
  };

  const officialLinks = [
    { name: 'Buku Kemendikbud', url: 'https://buku.kemendikdasmen.go.id/' },
    { name: 'Perpusnas RI', url: 'https://www.perpusnas.go.id/' },
    { name: 'e-Resources', url: 'https://e-resources.perpusnas.go.id/' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
        
        <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
          <button 
            onClick={selectedBook ? () => setSelectedBook(null) : onBack}
            className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">{selectedBook ? 'Kembali' : 'Dashboard'}</span>
          </button>
          
          <div className="flex flex-col">
            <h2 className="text-[#e9d1a3] font-black text-lg uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(233,209,163,0.5)]">
              {selectedBook ? 'DETAIL LITERASI' : 'PERPUSTAKAAN DIGITAL'}
            </h2>
          </div>
        </div>

        {!selectedBook && (
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {officialLinks.map(link => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white/[0.07] border border-white/20 rounded text-[9px] font-black text-gray-100 uppercase tracking-widest hover:border-[#e9d1a3] hover:text-[#e9d1a3] hover:bg-[#e9d1a3]/5 transition-all shadow-lg"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="flex-grow bg-[#14161a] border-l border-r border-b border-white/10 rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin shadow-[0_0_15px_rgba(233,209,163,0.2)]"></div>
              <p className="mt-4 text-[#e9d1a3] font-black uppercase tracking-[0.4em] text-[10px] drop-shadow-md">Sinkronisasi Katalog...</p>
            </div>
          ) : !selectedBook ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {books.map(book => (
                <button key={book.id} onClick={() => setSelectedBook(book)} className="flex flex-col group text-left">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/10 mb-3 relative shadow-xl group-hover:border-[#e9d1a3]/50 transition-colors">
                    <img 
                      src={book.cover} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 border border-white/20 rounded text-[7px] font-black text-[#e9d1a3] uppercase tracking-widest shadow-lg">
                       {book.category}
                    </div>
                  </div>
                  <h3 className="text-gray-100 font-black text-[10px] uppercase line-clamp-1 group-hover:text-[#e9d1a3] transition-colors drop-shadow-sm">{book.title}</h3>
                  <p className="text-gray-400 font-black text-[8px] uppercase tracking-tighter">{book.author}</p>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 bg-white/[0.04] p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="shrink-0 flex flex-col items-center">
                <img 
                  src={selectedBook.cover} 
                  className="w-64 aspect-[2/3] object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20" 
                  referrerPolicy="no-referrer"
                />
                <p className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Digital Archive v3.1</p>
              </div>
              
              <div className="space-y-6 flex-grow">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-[#e9d1a3]/20 border border-[#e9d1a3]/30 rounded text-[8px] font-black text-[#e9d1a3] uppercase tracking-tighter mb-2 shadow-sm">
                    {selectedBook.category}
                  </span>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{selectedBook.title}</h1>
                  <p className="text-[#e9d1a3] font-black text-xs uppercase opacity-90 italic drop-shadow-sm">Karya: {selectedBook.author}</p>
                </div>
                
                <div className="h-px bg-white/10 w-full"></div>
                
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-[#e9d1a3] uppercase tracking-[0.3em] opacity-80">Sinopsis & Informasi</p>
                   <p className="text-gray-200 text-sm leading-relaxed font-medium drop-shadow-sm">{selectedBook.description}</p>
                </div>
                
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleRead(selectedBook)}
                    className="flex-grow bg-[#e9d1a3] text-black px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(233,209,163,0.3)] hover:shadow-[#e9d1a3]/50"
                  >
                    BACA SEKARANG (EXTERNAL)
                  </button>
                  <button className="px-8 py-4 border border-white/20 bg-white/5 rounded-xl text-[10px] font-black text-gray-200 uppercase tracking-widest hover:border-[#e9d1a3] hover:text-[#e9d1a3] transition-all shadow-xl">
                    SIMPAN KE FAVORIT
                  </button>
                </div>
                
                <div className="bg-black/60 p-4 rounded-lg border border-white/10 flex items-center space-x-4 shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">
                    Peringatan: Hak cipta sepenuhnya milik penulis & penerbit. Gunakan platform resmi untuk dukungan penuh terhadap literasi Indonesia.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LibraryReader;
