import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Tag, Bell, Leaf, CheckCircle2, Sun, Moon, 
  Search, Zap, Award, Calendar, Sparkles, Wand2, Loader2, X 
} from 'lucide-react';

// --- Constants ---
const CATEGORIES = ['General', 'Personal', 'Work', 'Eco', 'Health'];
const ECO_TASKS = [
  "Use a reusable water bottle",
  "Turn off unused lights",
  "Compost food scraps",
  "Walk or bike instead of driving",
  "Avoid single-use plastics",
  "Shop with reusable bags",
  "Unplug electronics not in use"
];

const App = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('econotes_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '', content: '', category: 'General', reminder: '', ecoTasks: []
  });

  useEffect(() => {
    localStorage.setItem('econotes_data', JSON.stringify(notes));
  }, [notes]);

  // --- AI Logic ---
  const getAiSuggestions = async () => {
    if (!newNote.content || newNote.content.length < 5) return;
    setIsAnalyzing(true);
    
    // Simulate AI logic for the web version
    setTimeout(() => {
      const content = newNote.content.toLowerCase();
      let suggestion = {
        ecoAction: "Minimize digital footprint by deleting old emails",
        tip: "Great start! Adding a small green habit makes a difference."
      };
      
      if (content.includes("eat") || content.includes("food")) {
        suggestion.ecoAction = "Try a plant-based meal today";
      } else if (content.includes("buy") || content.includes("shop")) {
        suggestion.ecoAction = "Check for plastic-free packaging options";
      }
      
      setAiSuggestions(suggestion);
      setIsAnalyzing(false);
    }, 1500);
  };

  const addNote = () => {
    if (!newNote.title && !newNote.content) return;
    const noteToAdd = {
      ...newNote,
      id: Date.now(),
      completedEcoTasks: [],
      points: 0
    };
    setNotes([noteToAdd, ...notes]);
    setNewNote({ title: '', content: '', category: 'General', reminder: '', ecoTasks: [] });
    setAiSuggestions(null);
    setIsCreating(false);
  };

  const deleteNote = (id) => setNotes(notes.filter(n => n.id !== id));

  const toggleEcoTask = (noteId, task) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        const isDone = note.completedEcoTasks.includes(task);
        const newCompleted = isDone 
          ? note.completedEcoTasks.filter(t => t !== task)
          : [...note.completedEcoTasks, task];
        return { ...note, completedEcoTasks: newCompleted, points: newCompleted.length * 10 };
      }
      return note;
    }));
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [notes, searchQuery, selectedCategory]);

  const totalPoints = notes.reduce((acc, note) => acc + (note.points || 0), 0);

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-30 backdrop-blur-md bg-opacity-80 p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-xl text-white"><Leaf size={20} /></div>
            <h1 className="text-xl font-bold">EcoNotes</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
              <Award size={16} /><span>{totalPoints} pts</span>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Search notes..."
              className={`w-full pl-10 pr-4 py-3 rounded-2xl outline-none border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm transition-all ${selectedCategory === cat ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(note => (
            <div key={note.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-emerald-500">{note.category}</span>
                <button onClick={() => deleteNote(note.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
              <h3 className="font-bold text-lg">{note.title || 'Untitled'}</h3>
              <p className="text-sm text-slate-500 mb-4">{note.content}</p>
              {note.ecoTasks.length > 0 && (
                <div className="border-t dark:border-slate-700 pt-3 flex flex-wrap gap-2">
                  {note.ecoTasks.map(t => (
                    <button key={t} onClick={() => toggleEcoTask(note.id, t)} className={`text-[10px] px-2 py-1 rounded-md border ${note.completedEcoTasks.includes(t) ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>{t}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCreating(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Modal Placeholder - Simplification of the full code for easier copying */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Note</h2>
              <button onClick={() => setIsCreating(false)}><X /></button>
            </div>
            <input placeholder="Title" className="w-full mb-4 bg-transparent outline-none font-bold text-xl" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
            <textarea placeholder="Write something..." className="w-full h-32 mb-4 bg-transparent outline-none resize-none" value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} />
            
            <div className="bg-emerald-50 dark:bg-slate-900/50 p-4 rounded-xl mb-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-emerald-600">AI ASSISTANT</span>
                 <button onClick={getAiSuggestions} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
                   {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Analyze
                 </button>
               </div>
               {aiSuggestions && (
                 <button onClick={() => setNewNote({...newNote, ecoTasks: [...newNote.ecoTasks, aiSuggestions.ecoAction]})} className="text-xs text-left italic hover:underline">{aiSuggestions.ecoAction} (+Add)</button>
               )}
            </div>

            <button onClick={addNote} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold">Save Note</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
