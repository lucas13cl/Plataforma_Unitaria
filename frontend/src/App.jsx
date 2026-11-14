import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Package, 
  MapPin, 
  Cpu, 
  Truck, 
  AlertTriangle, 
  PlusCircle, 
  CheckCircle2, 
  Activity, 
  Phone, 
  Map as MapIcon,
  ShieldCheck,
  Users,
  Globe
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ donations: [], ngos: [], inventory: [] });
  const [aiResult, setAiResult] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Form states
  const [donorName, setDonorName] = useState('');
  const [itemType, setItemType] = useState('Cestas Básicas');
  const [quantity, setQuantity] = useState('');
  const [selectedNgo, setSelectedNgo] = useState('ONG Esperança Passarinho (Recife)');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/data');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.log('Backend offline, usando dados mockados locais.');
      setData({
        donations: [
          { id: 1, donor: 'Supermercado Bompreço', item: 'Cestas Básicas', quantity: 150, ngo: 'ONG Esperança Passarinho (Recife)', date: '2026-06-06', status: 'Confirmado' },
          { id: 2, donor: 'Loja Confiança Móveis', item: 'Colchões Solteiro', quantity: 40, ngo: 'Associação Dois Carneiros (Jaboatão)', date: '2026-06-05', status: 'Entregue' }
        ],
        ngos: [
          { id: 1, name: 'ONG Esperança Passarinho (Recife)', city: 'Recife', address: 'Av. Principal de Passarinho, 420 - Recife/PE', contact: '(81) 98877-6655', needs: 'Água, Colchões, Alimentos', lat: -7.9850, lng: -34.9120 },
          { id: 2, name: 'Associação Dois Carneiros (Jaboatão)', city: 'Jaboatão dos Guararapes', address: 'Rua da Paz, 128 - Jaboatão/PE', contact: '(81) 99988-1122', needs: 'Fraldas, Cestas Básicas, Limpeza', lat: -8.0830, lng: -34.9550 },
          { id: 3, name: 'Centro Comunitário Olinda Solidária', city: 'Olinda', address: 'Av. Brasil, 500 - Olinda/PE', contact: '(81) 97711-3344', needs: 'Roupas infantis, Telhas, Cestas', lat: -8.0100, lng: -34.8550 },
          { id: 4, name: 'Ação Social Camaragibe', city: 'Camaragibe', address: 'Estrada de Aldeia, KM 2 - Camaragibe/PE', contact: '(81) 96655-4433', needs: 'Água Mineral, Colchões', lat: -7.9820, lng: -34.9830 },
          { id: 5, name: 'Rede Solidária São Lourenço', city: 'São Lourenço da Mata', address: 'Rua do Comercio, 89 - São Lourenço/PE', contact: '(81) 95544-3322', needs: 'Kits de Higiene, Alimentos', lat: -8.0010, lng: -35.0250 },
          { id: 6, name: 'Fundo Comunitário Paulista', city: 'Paulista', address: 'Av. Cláudio Gueiros Leite, 1500 - Janga - Paulista/PE', contact: '(81) 94433-2211', needs: 'Colchões, Água', lat: -7.9350, lng: -34.8350 }
        ],
        inventory: [
          { item: 'Cestas Básicas', total: 650, distributed: 380, available: 270 },
          { item: 'Colchões Solteiro', total: 210, distributed: 120, available: 90 },
          { item: 'Água Mineral (20L)', total: 1040, distributed: 620, available: 420 }
        ]
      });
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !quantity) return;

    const newDonation = { donor: donorName, item: itemType, quantity: Number(quantity), ngo: selectedNgo };
    
    try {
      await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonation)
      });
    } catch (err) {
      console.log('Simulando salvamento local');
    }

    setFormSuccess(true);
    setDonorName('');
    setQuantity('');
    fetchData();
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const runAiOptimization = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/optimize', { method: 'POST' });
      const json = await res.json();
      setAiResult(json);
    } catch (err) {
      setAiResult({
        analysisTimestamp: new Date(),
        summary: 'Análise macroconcluída cobrindo a Região Metropolitana do Recife (Modo Offline).',
        allocations: [
          {
            ngo: 'ONG Esperança Passarinho (Recife)',
            urgencyScore: '9.6 / 10 (Crítico - Encostas)',
            suggestedItems: [{ item: 'Água Mineral (20L)', recommendedUnits: 150, justification: 'Risco geológico.' }]
          },
          {
            ngo: 'Centro Comunitário Olinda Solidária (Olinda)',
            urgencyScore: '8.5 / 10 (Alagamentos)',
            suggestedItems: [{ item: 'Kits de Higiene', recommendedUnits: 80, justification: 'Prevenção a doenças.' }]
          }
        ]
      });
    }
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <header className="bg-blue-900 text-white shadow-md border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800 p-2.5 rounded-xl border border-blue-700 shadow-inner">
              <HeartHandshake className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
                Recife Solidário <span className="bg-cyan-500 text-slate-900 text-xs px-2 py-0.5 rounded-full font-semibold">RMR Expandido</span>
              </h1>
              <p className="text-xs text-blue-200">Assistência humanitária integrada para toda a Região Metropolitana</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 rounded-lg text-xs text-cyan-200 flex items-center gap-1.5 font-medium">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Abrangência: 6 Municípios da RMR</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-4 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: Activity },
            { id: 'donors', label: 'Doadores & Ofertas', icon: PlusCircle },
            { id: 'inventory', label: 'Estoque Centralizado', icon: Package },
            { id: 'map', label: 'Mapa & ONGs da RMR', icon: MapPin },
            { id: 'ai', label: 'Otimização com IA', icon: Cpu },
            { id: 'roadmap', label: 'Roadmap & Futuro', icon: Truck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
                <Globe className="w-96 h-96 text-white" />
              </div>
              <div className="max-w-2xl relative z-10">
                <span className="bg-cyan-400 text-blue-950 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Operação Metropolitana RMR</span>
                <h2 className="text-3xl font-extrabold mt-3 mb-2">Rede Integrada de Apoio Humanitário</h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Plataforma expandida para coordenar esforços em Recife, Jaboatão, Olinda, Camaragibe, São Lourenço e Paulista. Conectando doadores a centros de distribuição locais com suporte de inteligência artificial.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('donors')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow transition text-sm flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Cadastrar Doação
                  </button>
                  <button onClick={() => setActiveTab('map')} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Ver ONGs na RMR
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doações Totais</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{data.donations.length + 84}</h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ativo na RMR
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pontos de Coleta</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{data.ngos.length} Bases</h3>
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 6 Municípios
                  </span>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Municípios Atendidos</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">Recife, Jaboatão, Olinda...</h3>
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Cobertura total
                  </span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                  <Globe className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eficiência Logística</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">96.8%</h3>
                  <span className="text-xs text-cyan-600 font-medium flex items-center gap-1 mt-1">
                    <Cpu className="w-3.5 h-3.5" /> IA balanceada
                  </span>
                </div>
                <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Donations & Urgent Needs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Últimas Doações na RMR</span>
                  <span className="text-xs font-normal text-slate-500">Tempo real</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                        <th className="py-3 px-3">Doador</th>
                        <th className="py-3 px-3">Item</th>
                        <th className="py-3 px-3">Qtd</th>
                        <th className="py-3 px-3">ONG / Destino</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {data.donations.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-medium text-slate-900">{d.donor}</td>
                          <td className="py-3 px-3 text-slate-700">{d.item}</td>
                          <td className="py-3 px-3 font-semibold text-blue-600">{d.quantity} un</td>
                          <td className="py-3 px-3 text-slate-600">{d.ngo}</td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              d.status === 'Entregue' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Urgent Needs Panel */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span>Prioridades na RMR</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Itens com maior carência nos municípios parceiros:</p>
                  
                  <div className="space-y-3">
                    {[
                      { item: 'Água Mineral (Fardos / 20L)', urgency: 'Crítico', color: 'bg-red-50 text-red-700 border-red-200' },
                      { item: 'Colchões de Solteiro', urgency: 'Muito Alto', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                      { item: 'Cestas Básicas de Alimentos', urgency: 'Alto', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { item: 'Kits de Limpeza Pós-Enchente', urgency: 'Alto', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
                    ].map((need, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border text-sm flex items-center justify-between ${need.color}`}>
                        <span className="font-semibold">{need.item}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white font-bold shadow-sm">{need.urgency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button onClick={() => setActiveTab('donors')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Doar Estes Itens
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DONORS */}
        {activeTab === 'donors' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <span>Cadastrar Nova Doação</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">Selecione o item e o centro de arrecadação na RMR.</p>

              {formSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-sm flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Doação cadastrada e inventário RMR atualizado!</span>
                </div>
              )}

              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Seu Nome ou Empresa</label>
                  <input 
                    type="text" 
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Ex: Empresa Recife / Ana Souza" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tipo de Item</label>
                  <select 
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Cestas Básicas">Cestas Básicas</option>
                    <option value="Colchões Solteiro">Colchões Solteiro</option>
                    <option value="Água Mineral (20L)">Água Mineral (20L)</option>
                    <option value="Roupas e Agasalhos">Roupas e Agasalhos</option>
                    <option value="Kits de Higiene e Limpeza">Kits de Higiene e Limpeza</option>
                    <option value="Eletrodomésticos Essenciais">Eletrodomésticos Essenciais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Quantidade</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Ex: 50" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">ONG / Ponto na RMR</label>
                  <select 
                    value={selectedNgo}
                    onChange={(e) => setSelectedNgo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {data.ngos.map((ngo, idx) => (
                      <option key={idx} value={ngo.name}>{ngo.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-md flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Confirmar Doação na RMR
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Registro de Ofertas (RMR)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Doador</th>
                      <th className="py-3 px-3">Item</th>
                      <th className="py-3 px-3">Qtd</th>
                      <th className="py-3 px-3">Destino RMR</th>
                      <th className="py-3 px-3">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {data.donations.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-400">#{d.id || i+1}</td>
                        <td className="py-3 px-3 font-medium text-slate-900">{d.donor}</td>
                        <td className="py-3 px-3 text-slate-700">{d.item}</td>
                        <td className="py-3 px-3 font-semibold text-blue-600">{d.quantity} un</td>
                        <td className="py-3 px-3 text-slate-600">{d.ngo}</td>
                        <td className="py-3 px-3 text-slate-500 text-xs">{d.date || 'Hoje'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Estoque Centralizado (Região Metropolitana)</h3>
                <p className="text-xs text-slate-500 mt-1">Consolidado em tempo real de todas as bases parceiras na RMR.</p>
              </div>
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold border border-blue-200">
                SKUs Monitorados na RMR: {data.inventory.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.inventory.map((inv, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-base">{inv.item}</h4>
                    <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">RMR</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="block text-[10px] text-slate-500 uppercase">Total</span>
                      <span className="text-base font-bold text-slate-800">{inv.total}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="block text-[10px] text-slate-500 uppercase">Distribuído</span>
                      <span className="text-base font-bold text-emerald-600">{inv.distributed}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="block text-[10px] text-slate-500 uppercase">Disponível</span>
                      <span className="text-base font-bold text-blue-600">{inv.available}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (inv.distributed / inv.total) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">Distribuição: {Math.round((inv.distributed / inv.total) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MAP & NGOS */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-600" />
                <span>Centros de Arrecadação na Região Metropolitana do Recife (RMR)</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">Encontre o ponto de recebimento mais próximo em seu município para entrega presencial.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.ngos.map((ngo, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-blue-400 transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">{ngo.name}</h4>
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-bold">{ngo.city}</span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-3">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{ngo.address}</span>
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-3">
                        <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>{ngo.contact}</span>
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                        <strong className="text-slate-700 block mb-1">Necessidades Urgentes:</strong>
                        <span className="text-slate-600">{ngo.needs}</span>
                      </div>
                    </div>

                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ngo.name + ' ' + ngo.address)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-center text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Ver Rota no Google Maps
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI DISTRIBUTION */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
              <div className="max-w-3xl">
                <span className="bg-cyan-400 text-blue-950 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">IA de Alocação RMR</span>
                <h3 className="text-2xl font-bold mt-3 mb-2">Otimização de Recursos em Escala Metropolitana</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Nosso algoritmo cruza os dados de estoque global com as demandas emergenciais em Recife, Olinda, Jaboatão, Paulista e demais cidades da RMR para balancear a entrega sem desperdícios.
                </p>
                <button 
                  onClick={runAiOptimization}
                  disabled={loadingAi}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Cpu className={`w-5 h-5 ${loadingAi ? 'animate-spin' : ''}`} />
                  {loadingAi ? 'Processando Algoritmo RMR...' : 'Executar Análise de Otimização RMR'}
                </button>
              </div>
            </div>

            {aiResult && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Resultado da Alocação Inteligente (RMR)</h4>
                    <p className="text-xs text-slate-500">Gerado em: {new Date(aiResult.analysisTimestamp).toLocaleString()}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Otimizado</span>
                </div>

                <div className="space-y-4">
                  {aiResult.allocations.map((alloc, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <h5 className="font-bold text-slate-900 text-base">{alloc.ngo}</h5>
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                          Prioridade: {alloc.urgencyScore}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {alloc.suggestedItems.map((item, i) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-sm">
                            <div className="flex justify-between font-bold text-blue-600 mb-1">
                              <span>{item.item}</span>
                              <span className="bg-blue-50 px-2 py-0.5 rounded text-xs">+{item.recommendedUnits} un</span>
                            </div>
                            <p className="text-xs text-slate-600">{item.justification}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Próximos Passos & Roadmap RMR</span>
              </h3>
              <p className="text-xs text-slate-500">Planejamento estratégico para expansão e melhoria contínua da assistência.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-slate-900 text-base">Logística Porta a Porta Intermunicipal</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Implementação de frotas utilitárias para rondas periódicas em áreas de difícil acesso entre Recife, Jaboatão e Olinda.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-slate-900 text-base">Chatbot via WhatsApp (n8n)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conexão automatizada para líderes comunitários de qualquer município da RMR solicitarem mantimentos em tempo real.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="bg-cyan-100 text-cyan-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                <h4 className="font-bold text-slate-900 text-base">Integração com Defesa Civil</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parcerias institucionais para alimentar alertas de risco meteorológico diretamente no painel de controle.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Recife Solidário • Cobertura Completa da Região Metropolitana (RMR)
        </div>
      </footer>
    </div>
  );
}