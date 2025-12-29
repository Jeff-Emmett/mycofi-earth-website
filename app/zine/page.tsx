"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, MicOff, Sparkles, BookOpen, Printer, ArrowLeft, RotateCcw, X } from "lucide-react";

const DRAFT_STORAGE_KEY = "zineDraft";

// Helper to get correct path based on subdomain
function useZinePath() {
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    setIsSubdomain(window.location.hostname.startsWith("zine."));
  }, []);

  return (path: string) => {
    if (isSubdomain) {
      // On subdomain, /zine/create becomes /create
      return path.replace(/^\/zine/, "") || "/";
    }
    return path;
  };
}

const STYLES = [
  { value: "punk-zine", label: "Punk Zine", description: "Xerox texture, high contrast, DIY collage" },
  { value: "mycelial", label: "Mycelial", description: "Organic networks, spore patterns, earth tones" },
  { value: "minimal", label: "Minimal", description: "Clean lines, white space, modern" },
  { value: "collage", label: "Collage", description: "Layered imagery, mixed media" },
  { value: "retro", label: "Retro", description: "1970s aesthetic, earth tones" },
];

const TONES = [
  { value: "rebellious", label: "Rebellious", description: "Defiant, punk attitude" },
  { value: "regenerative", label: "Regenerative", description: "Hopeful, nature-inspired, healing" },
  { value: "playful", label: "Playful", description: "Whimsical, fun, light-hearted" },
  { value: "informative", label: "Informative", description: "Educational, factual" },
  { value: "poetic", label: "Poetic", description: "Lyrical, metaphorical" },
];

interface ZineDraft {
  topic: string;
  style: string;
  tone: string;
  savedAt: string;
}

export default function ZinePage() {
  const router = useRouter();
  const getPath = useZinePath();
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("mycelial");
  const [tone, setTone] = useState("regenerative");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedDraft, setSavedDraft] = useState<ZineDraft | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const draft: ZineDraft = JSON.parse(saved);
        // Only show draft if it has a topic
        if (draft.topic?.trim()) {
          setSavedDraft(draft);
          setShowDraftBanner(true);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Auto-save draft when form changes
  useEffect(() => {
    if (topic.trim()) {
      const draft: ZineDraft = {
        topic,
        style,
        tone,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [topic, style, tone]);

  const restoreDraft = () => {
    if (savedDraft) {
      setTopic(savedDraft.topic);
      setStyle(savedDraft.style);
      setTone(savedDraft.tone);
      setShowDraftBanner(false);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
    setSavedDraft(null);
    setShowDraftBanner(false);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTopic((prev) => (prev ? prev + " " + transcript : transcript));
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);

    // Store the input in sessionStorage and navigate to create page
    sessionStorage.setItem("zineInput", JSON.stringify({ topic, style, tone }));
    router.push(getPath("/zine/create"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-white">
      {/* Back to MycoFi */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-black punk-text text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          MycoFi
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight punk-text mb-4">
          MYCO<span className="text-green-600">ZINE</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
          Transform your ideas into printable 8-page mini-zines with AI
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>AI-Generated</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen className="w-4 h-4" />
          <span>8 Pages</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Printer className="w-4 h-4" />
          <span>Print Ready</span>
        </div>
      </div>

      {/* Saved Draft Banner */}
      {showDraftBanner && savedDraft && (
        <div className="w-full max-w-2xl mb-6 punk-border bg-green-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <RotateCcw className="w-4 h-4 text-green-600" />
                <span className="font-bold punk-text text-sm">Saved Draft Found</span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                &ldquo;{savedDraft.topic.length > 60 ? savedDraft.topic.slice(0, 60) + "..." : savedDraft.topic}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Saved {new Date(savedDraft.savedAt).toLocaleDateString()} at{" "}
                {new Date(savedDraft.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={restoreDraft}
                className="px-3 py-1.5 bg-green-600 text-white text-sm punk-text hover:bg-green-700 transition-colors"
              >
                Restore
              </button>
              <button
                onClick={clearDraft}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                title="Discard draft"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
        {/* Topic Input */}
        <div className="punk-border bg-white p-1">
          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What's your zine about? Describe your concept..."
              className="w-full h-32 p-4 pr-12 text-lg resize-none border-0 focus:outline-none focus:ring-0 punk-text"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 top-3 p-2 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Style & Tone Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Style Select */}
          <div className="punk-border bg-white p-4">
            <label className="block text-sm font-bold punk-text mb-2">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2 border-2 border-black bg-white punk-text focus:outline-none"
              disabled={isLoading}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              {STYLES.find((s) => s.value === style)?.description}
            </p>
          </div>

          {/* Tone Select */}
          <div className="punk-border bg-white p-4">
            <label className="block text-sm font-bold punk-text mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2 border-2 border-black bg-white punk-text focus:outline-none"
              disabled={isLoading}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              {TONES.find((t) => t.value === tone)?.description}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="w-full py-4 px-6 bg-black text-white text-lg font-bold punk-text
                     hover:bg-green-600 hover:text-white transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     punk-border hover:shadow-[6px_6px_0_black]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">&#9881;</span>
              Generating...
            </span>
          ) : (
            "Generate Outline →"
          )}
        </button>
      </form>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>
          Folds into a single 8.5&quot; x 11&quot; sheet •{" "}
          <a href="#how-it-works" className="underline hover:text-gray-600">
            How to fold
          </a>
        </p>
        <p className="mt-2">
          Powered by <Link href="/" className="underline hover:text-gray-600">MycoFi</Link>
        </p>
      </footer>
    </div>
  );
}
