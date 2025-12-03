import React from "react";
import { Briefcase, Terminal } from "lucide-react";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center font-mono border-b border-gray-700 pb-2">
        <Briefcase className="mr-3" /> AKTİF PROJE MODÜLLERİ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 1, title: "SCADA Su Arıtma", type: "PLC + HMI", desc: "Siemens S7-1200 ile tam otomatik su arıtma tesisi kontrolü ve WinCC arayüzü." },
          { id: 2, title: "React Dashboard", type: "Web App", desc: "Endüstriyel verilerin gerçek zamanlı izlendiği, MQTT tabanlı web paneli." },
          { id: 3, title: "Servo Motor Kontrol", type: "Motion", desc: "Çok eksenli servo motorların senkronizasyonu ve pozisyonlama yazılımı." },
          { id: 4, title: "Veri Toplama (IoT)", type: "IoT + Cloud", desc: "Saha sensörlerinden toplanan verilerin Azure bulut sistemine aktarımı." },
          { id: 5, title: "Depo Otomasyonu", type: "Lojistik", desc: "Otomatik yönlendirmeli araçlar (AGV) için trafik yönetim algoritması." },
          { id: 6, title: "Enerji İzleme", type: "Analiz", desc: "Fabrika genelindeki enerji tüketiminin analizi ve raporlanması." }
        ].map((p) => (
          <div key={p.id} className="group bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col">
            <div className="h-32 bg-gray-700/30 flex items-center justify-center border-b border-gray-700 group-hover:bg-gray-700/50 transition-colors relative">
              <Terminal className="w-12 h-12 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <span className="absolute top-2 right-2 text-[10px] font-mono bg-black/50 px-2 py-1 rounded text-gray-400 border border-gray-600">ID: {p.id.toString().padStart(3, '0')}</span>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 font-mono">{p.title}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow leading-relaxed">
                {p.desc}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                <span className="text-xs font-bold text-cyan-600 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-900/30">{p.type}</span>
                <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                  Detaylar <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
