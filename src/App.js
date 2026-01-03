import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Leaf,
  Sun,
  Moon,
  Search,
  Zap,
  Award,
  Loader2,
  X,
} from "lucide-react";

// ---------------- CONSTANTS ----------------
const CATEGORIES = ["General", "Personal", "Work", "Eco", "Health"];

const DEFAULT_AI_SUGGESTION = {
  ecoAction: "Minimize digital footprint by deleting old emails",
  tip: "Small actions add up 🌱",
};

// ---------------- APP ----------------
const App = () => {
  // -------- STATE --------
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("econotes_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "General",
    ecoTasks: [],
  });

  // -------- EFFECTS --------
  useEffect(() => {
    localStorage.setItem("econotes_data", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("econotes_theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("econotes_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // -------- AI SIMULATION --------
  const getAiSuggestions = () => {
    if (!newNote.content || newNote.content.length < 5) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const text = newNote.content.toLowerCase();
      let suggestion = { ...DEFAULT_AI_SUGGESTION };

      if (text.includes("food") || text.includes("eat")) {
        suggestion.ecoAction = "Try one plant-based meal today";
      } else if (text.includes("shop") || text.includes("buy")) {
        suggestion.ecoAction = "Choose plastic-free packaging";
      }

      setAiSuggestions(suggestion);
      setIsAnalyzing(false);
    }, 1200);
  };

  // -------- ACTIONS --------
  const addNote = () => {
    if (!newNote.title && !newNote.content) return;

    setNotes([
      {
        ...newNote,
        id: Date.now(),
        completedEcoTasks: [],
        points: 0,
      },
      ...notes,
    ]);

    setNewNote({
      title: "",
      content: "",
      category: "General",
      ecoTasks: [],
    });

    setAiSuggestions(null);
    setIsCreating(false);
  };

  const deleteNote = (id) =>
    setNotes(notes.filter((note) => note.id !== id));

  const toggleEcoTask = (noteId, task) => {
    setNotes(
      notes.map((note) => {
        if (note.id !== noteId) return note;

        const done = note.completedEcoTasks.includes(task);
        const updated = done
          ? note.completedEcoTasks.filter((t) => t !== task)
          : [...note.completedEcoTasks, task];

        return {
          ...note,
          completedEcoTasks: updated,
          points: updated.length * 10,
        };
      })
    );
  };

  // -------- DERIVED DATA --------
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, selectedCategory]);

  const totalPoints = useMemo(
    () => notes.reduce((sum, n) => sum + (n.points || 0), 0),
    [notes]
  );

  // -------- UI --------
