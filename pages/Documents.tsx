
import React, { useState } from 'react';
import { Section, Card } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { FileText, Plus, X, Trash2, Eye, FileDigit, Shield, ShieldCheck, Lock } from 'lucide-react';

export const Documents: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', data: '', type: 'image' as 'pdf' | 'image' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          data: reader.result as string,
          type: file.type.includes('pdf') ? 'pdf' : 'image',
          name: formData.name || file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.data && formData.name) {
      addDocument(formData);
      setFormData({ name: '', data: '', type: 'image' });
      setShowAdd(false);
    }
  };

  // ONBOARDING FOR NO DOCUMENTS
  if (documents.length === 0 && !showAdd) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-zinc-300 to-zinc-500 rounded-full blur-3xl opacity-20"></div>
          <div className="relative w-40 h-40 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl flex items-center justify-center border border-gray-100 dark:border-white/5">
            <Lock className="w-16 h-16 text-zinc-700 dark:text-zinc-300 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-3 px-6">
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">Digital Vault</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-xs mx-auto text-sm">
            Keep your essential financial documents, receipts, and identity papers in a secure, private archive.
          </p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-full h-16 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all group max-w-xs"
        >
          <Plus className="w-6 h-6" />
          <span className="font-black text-lg">Secure Document</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      <header className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">Vault</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {documents.map(doc => (
          <Card key={doc.id} className="relative group p-4 border-none shadow-sm flex flex-col items-center space-y-3 bg-white dark:bg-zinc-900">
            <div className="w-full aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden">
              {doc.type === 'image' ? (
                <img src={doc.data} className="w-full h-full object-cover" alt={doc.name} />
              ) : (
                <FileDigit className="w-10 h-10 text-zinc-400" />
              )}
            </div>
            <div className="text-center w-full">
              <p className="text-xs font-black truncate px-2 text-zinc-900 dark:text-zinc-100">{doc.name}</p>
              <p className="text-[9px] text-zinc-400 font-bold uppercase">{new Date(doc.date).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2 w-full pt-2">
              <button 
                onClick={() => setViewingDoc(doc.data)}
                className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => deleteDocument(doc.id)}
                className="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl active:scale-90 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Viewer Overlay */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
           <button 
             onClick={() => setViewingDoc(null)}
             className="absolute top-8 right-8 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
           >
             <X className="w-6 h-6" />
           </button>
           <div className="w-full max-w-2xl h-full flex items-center justify-center">
              {viewingDoc.startsWith('data:application/pdf') ? (
                <iframe src={viewingDoc} className="w-full h-full rounded-2xl" title="PDF Viewer" />
              ) : (
                <img src={viewingDoc} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="Preview" />
              )}
           </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[3.5rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20 border-none">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Archive Document</h2>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center transition-transform hover:rotate-90 active:scale-90"><X className="w-5 h-5 text-zinc-900 dark:text-zinc-100" /></button>
             </div>
             <form onSubmit={handleAdd} className="space-y-6 pb-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Document Title</label>
                  <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-2xl py-4 px-5 outline-none font-bold text-sm text-zinc-900 dark:text-zinc-100" placeholder="e.g. Passport Copy" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Select File (PDF/JPEG)</label>
                   <input type="file" className="hidden" id="doc-upload" accept="image/*,application/pdf" onChange={handleFileUpload} />
                   <label htmlFor="doc-upload" className="flex flex-col items-center justify-center w-full py-10 bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-[2rem] cursor-pointer hover:bg-gray-100 transition-colors">
                      {formData.data ? <ShieldCheck className="w-10 h-10 text-emerald-500" /> : <Plus className="w-10 h-10 text-zinc-300" />}
                      <span className="mt-2 text-xs font-black text-zinc-400 uppercase tracking-widest">{formData.data ? 'Securely Loaded' : 'Choose File'}</span>
                   </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-6 rounded-[2.5rem] shadow-xl active:scale-95 transition-all">Save to Vault</button>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};
