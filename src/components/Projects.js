import React from "react";
import { Briefcase, ArrowRight, Layers } from "lucide-react";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Seçilmiş Projeler</h2>
        <p className="text-slate-500">Endüstriyel otomasyon ve yazılım alanındaki son çalışmalarım.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { id: 1, title: "SCADA Su Arıtma", type: "PLC + HMI", desc: "Siemens S7-1200 ile tam otomatik su arıtma tesisi kontrolü ve WinCC arayüzü." },
          { id: 2, title: "React Dashboard", type: "Web App", desc: "Endüstriyel verilerin gerçek zamanlı izlendiği, MQTT tabanlı web paneli." },
          { id: 3, title: "Servo Motor Kontrol", type: "Motion", desc: "Çok eksenli servo motorların senkronizasyonu ve pozisyonlama yazılımı." },
          { id: 4, title: "Veri Toplama (IoT)", type: "IoT + Cloud", desc: "Saha sensörlerinden toplanan verilerin Azure bulut sistemine aktarımı." },
          { id: 5, title: "Depo Otomasyonu", type: "Lojistik", desc: "Otomatik yönlendirmeli araçlar (AGV) için trafik yönetim algoritması." },
          { id: 6, title: "Enerji İzleme", type: "Analiz", desc: "Fabrika genelindeki enerji tüketiminin analizi ve raporlanması." }
        ].map((p) => (
          <div key={p.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
              <Layers className="w-12 h-12 text-slate-300 group-hover:text-blue-400 transition-colors transform group-hover:scale-110 duration-300" />
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                 <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wide">{p.type}</span>
              </div>

              <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">
                {p.desc}
              </p>

              <button className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 flex items-center gap-2 transition-colors mt-auto">
                Detayları İncele <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
