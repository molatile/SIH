import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ArrowRight, Loader2, Languages as LanguagesIcon } from 'lucide-react';
import languagesData from '../data/languages.json';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key');

export default function LanguageTranslator() {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState(languagesData[0].name);
  const [translatedText, setTranslatedText] = useState('');
  const [scriptSample, setScriptSample] = useState(languagesData[0].scriptSample);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        systemInstruction: `You are a helpful translation assistant. Translate the following text into ${targetLang}. Provide ONLY the translated text in the native script of ${targetLang}, without any explanations or quotes.`
      });

      const response = await model.generateContent(sourceText);
      const text = response.response.text();
      
      setTranslatedText(text);
      
      // Update script sample based on selected language
      const langInfo = languagesData.find(l => l.name === targetLang);
      if (langInfo) {
        setScriptSample(langInfo.scriptSample);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate. Please try again or check API keys.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo/10 shadow-lg p-6 md:p-8 max-w-5xl mx-auto w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-gold to-indigo"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo/5 rounded-full text-indigo">
          <LanguagesIcon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-yatra text-indigo">AI Cultural Translator</h2>
          <p className="text-indigo/60 text-sm">Translate any text into India's diverse languages using AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* Source Box */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-indigo/70 uppercase tracking-wide">Enter Text</label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type something to translate..."
            className="w-full h-40 p-4 bg-ivory/30 border border-indigo/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent resize-none text-indigo placeholder:text-indigo/30 text-lg"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center gap-4 pt-10">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-ivory border border-indigo/20 rounded-full px-4 py-2 text-indigo font-medium focus:outline-none focus:ring-2 focus:ring-saffron appearance-none text-center cursor-pointer shadow-sm hover:border-saffron/50 transition-colors"
          >
            {languagesData.map(lang => (
              <option key={lang.id} value={lang.name}>{lang.name}</option>
            ))}
          </select>

          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isLoading}
            className="btn-primary rounded-full w-14 h-14 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:rotate-12 transition-transform"
            aria-label="Translate"
          >
            {isLoading ? <Loader2 className="animate-spin text-ivory" size={24} /> : <ArrowRight size={24} />}
          </button>
        </div>

        {/* Target Box */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-indigo/70 uppercase tracking-wide">Translation</label>
            {translatedText && (
              <span className="text-xs px-2 py-1 bg-saffron/10 text-saffron rounded-full border border-saffron/20">
                {targetLang} Script: {scriptSample}
              </span>
            )}
          </div>
          <div className="w-full h-40 p-4 bg-indigo/5 border border-indigo/10 rounded-2xl overflow-y-auto relative">
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : translatedText ? (
              <p className="text-xl text-indigo leading-relaxed" style={{ fontSize: '1.5rem' }}>
                {translatedText}
              </p>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-indigo/30 text-center italic">Translation will appear here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
