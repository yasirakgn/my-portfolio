
// Basic In-Memory Rate Limiter (Token Bucket for cold starts)
// Not perfect for serverless scale but blocks single-instance abuse effectively.
const rateLimit = new Map();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 Minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 Requests per minute per IP
const CLEANUP_INTERVAL = 60 * 1000 * 5; // 5 Minutes
let lastCleanup = Date.now();

function checkRateLimit(ip) {
    const now = Date.now();

    // --- MEMORY LEAK PROTECTION (CLEANUP) ---
    if (now - lastCleanup > CLEANUP_INTERVAL) {
        for (const [key, data] of rateLimit.entries()) {
            if (now - data.startTime > RATE_LIMIT_WINDOW) {
                rateLimit.delete(key);
            }
        }
        lastCleanup = now;
    }

    const clientData = rateLimit.get(ip) || { count: 0, startTime: now };

    if (now - clientData.startTime > RATE_LIMIT_WINDOW) {
        // Reset window
        rateLimit.set(ip, { count: 1, startTime: now });
        return true;
    }

    if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    clientData.count++;
    rateLimit.set(ip, clientData);
    return true;
}

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    // 1. Rate Limiting Check
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: "Too Many Requests. Please try again later." });
    }

    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).send("Prompt verisi zorunlu.");

    // API Key Sunucu Tarafında Güvende
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).send("Sunucu konfigürasyonu eksik (GEMINI_API_KEY).");
    }

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
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            // Log sensitive error to server logs ONLY
            console.error("Gemini API Error:", errorText);
            throw new Error(`AI Provider Error`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";

        return res.status(200).json({ answer: text });

    } catch (err) {
        console.error(err); // Log full error internally
        return res.status(502).json({ error: "AI Servis Hatası: İşlem şu an gerçekleştirilemiyor." });
    }
}
