import React, { useState, useRef, useEffect } from "react";
import { Terminal, Bot, Sparkles, RotateCcw, AlertCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Buraya kendi API Key'inizi ekleyin veya process.env.REACT_APP_GEMINI_API_KEY kullanın
const apiKey = process.env.REACT_API_GEMINI_API_KEY;

export default function AiTerminal() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const outputRef = useRef(null);

  const predefinedPrompts = [
    "Start/Stop butonu ile basit bir motor mühürleme devresi için SCL kodu yaz.",
    "Siemens S7-1200 PLC ile bir trafik ışığı sistemi nasıl programlanır?",
    "Bir SCADA sistemi ile PLC arasındaki haberleşme protokolleri nelerdir?",
    "React uygulamasında useEffect hook'u ne işe yarar?"
  ];

  const callGemini = async (promptText) => {
    setIsLoading(true);
    setError(null);
    setResponse("");

    const systemInstruction = `
      Sen YAGSER_AI adında, uzman bir Endüstriyel Otomasyon Mühendisisin. 
      Uzmanlık alanların: PLC Programlama (Siemens SCL, Ladder), SCADA sistemleri, Endüstriyel IoT ve Web Geliştirme (React, Node.js).
      
      Görevin:
      1. Kullanıcının teknik sorularına kısa, net ve profesyonel cevaplar vermek.
      2. İstenildiğinde PLC kodu (SCL, Ladder mantığı) veya JavaScript kodu üretmek.
      3. Cevaplarını markdown formatında ver. Kod bloklarını dil belirterek kullan.
      4. Cevapların "mühendislik jargonu" ile profesyonel ama anlaşılır olsun.
    `;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptText }]
            }],
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          })
        }
      );

      if (!res.ok) throw new Error("API Bağlantı Hatası");

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";
      setResponse(text);
    } catch (err) {
      console.error(err);
      setError("Sistem Hatası: AI sunucusuna erişilemiyor. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    callGemini(query);
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [response, isLoading]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
        <h2 className="text-2xl font-bold text-purple-400 flex items-center font-mono">
          <Bot className="mr-3 w-8 h-8" /> YAGSER_AI TERMİNALİ
        </h2>
        <div className="flex items-center text-xs font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded border border-purple-500/50 animate-pulse">
          <Sparkles className="w-3 h-3 mr-2" /> POWERED BY GEMINI LLM
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center uppercase tracking-wider">
              <Terminal className="w-4 h-4 mr-2" /> Komut Girişi
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bir otomasyon senaryosu veya soru girin... (Örn: Start/Stop motor SCL kodu)"
                className="w-full h-40 bg-gray-900 border border-gray-600 text-white p-3 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors font-mono text-sm resize-none"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 transition-all
                  ${isLoading 
                    ? 'bg-gray-700 text-gray-400 cursor-wait' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50'}`}
              >
                {isLoading ? <RotateCcw className="animate-spin" /> : <Sparkles />}
                {isLoading ? "İŞLENİYOR..." : "OLUŞTUR"}
              </button>
            </form>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Hızlı Komutlar</h4>
            <div className="space-y-2">
              {predefinedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(prompt)}
                  className="w-full text-left text-xs text-gray-300 bg-gray-900/50 hover:bg-purple-900/30 hover:text-purple-300 p-2 rounded border border-gray-700 transition-colors truncate"
                >
                  {`> ${prompt}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 flex flex-col h-[600px] bg-black rounded-xl border-2 border-gray-700 shadow-2xl relative overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-gray-400">bash -- yagser_ai_core</div>
          </div>

          {/* Content */}
          <div ref={outputRef} className="flex-grow p-6 overflow-y-auto font-mono text-sm text-green-400 space-y-4">
            {!response && !isLoading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                <Bot size={64} className="mb-4" />
                <p>AI Core Beklemede...</p>
                <p className="text-xs">Komut bekleniyor.</p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-2">
                <p className="text-purple-400 animate-pulse">{`> Analyzing request...`}</p>
                <p className="text-purple-400 animate-pulse delay-75">{`> Accessing Knowledge Base...`}</p>
                <p className="text-purple-400 animate-pulse delay-150">{`> Generating Response...`}</p>
              </div>
            )}

            {error && (
              <div className="text-red-400 border border-red-900/50 bg-red-900/20 p-4 rounded">
                <p className="flex items-center gap-2 font-bold"><AlertCircle size={16} /> HATA</p>
                <p>{error}</p>
              </div>
            )}

            {response && (
              <div className="prose prose-invert prose-sm max-w-none">
                 <div className="text-gray-400 text-xs mb-2 border-b border-gray-800 pb-1">
                  YANIT:
                 </div>
                 <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="relative group">
                          <div className="absolute -top-3 right-2 text-[10px] uppercase text-gray-500 bg-gray-800 px-2 rounded border border-gray-700">
                            {match[1]}
                          </div>
                          <code className={`${className} block bg-gray-900 p-4 rounded-lg border border-gray-700 my-2 overflow-x-auto text-blue-300`} {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code className="bg-gray-800 text-yellow-300 px-1 py-0.5 rounded" {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                 >
                   {response}
                 </ReactMarkdown>
              </div>
            )}
            {/* Cursor Effect */}
            {response && <div className="text-green-500 typing-cursor"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}