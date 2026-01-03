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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '', content: '', category: 'General', ecoTasks: [], completedEcoTasks: [], points: 0
  });
  const [activeNote, setActiveNote] = useState(null); // NEW: track open note

  useEffect(() => {
    localStorage.setItem('econotes_data', JSON.stringify(notes));
  }, [notes]);

  // --- AI Logic ---
  const getAiSuggestions = async () => {
    if (!newNote.content || newNote.content.length < 5) return;
    setIsAnalyzing(true);
    
    // Simulate AI logic
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
      id: Date.now()
    };
    setNotes([noteToAdd, ...notes]);
    setNewNote({ title: '', content: '', category: 'General', ecoTasks: [], completedEcoTasks: [], points: 0 });
    setAiSuggestions(null);
    setIsCreating(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null); // close modal if deleted
  };

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
              className={`w-full pl
