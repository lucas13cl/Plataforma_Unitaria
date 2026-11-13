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
  Users
} from 'lucide-react';

// Em deploy de serviço único (Render), a API fica na mesma origem (/api).
// Em deploy separado, defina VITE_API_URL com a URL pública do backend.
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ donations: [], ngos: [], inventory: [] });
  const [aiResult, setAiResult] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Form states
  const [donorName, setDonorName] = useState('');
  const [itemType, setItemType] = useState('Cestas Básicas');
  const [quantity, setQuantity] = useState('');
  const [selectedNgo, setSelectedNgo] = useState('ONG Esperança Passarinho');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/data`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.log('Backend offline, usando dados mockados locais para demonstração visual.');
      setData({
        donations: [
          { id: 1, donor: 'Supermercado Bompreço', item: 'Cestas Básicas', quantity: 150, ngo: 'ONG Esperança Passarinho', date: '2026-06-06', status: 'Confirmado' },
          { id: 2, donor: 'Loja Confiança Móveis', item: 'Colchões Solteiro', quantity: 40, ngo: 'Associação Dois Carneiros Unidos', date: '2026-06-05', status: 'Entregue' }
        ],
        ngos: [
          { id: 1, name: 'ONG Esperança Passarinho', address: 'Av. Principal de Passarinho, 420 - Recife/PE', contact: '(81) 98877-6655', needs: 'Água, Colchões, Alimentos', lat: -7.9850, lng: -34.9120 },
          { id: 2, name: 'Associação Dois Carneiros Unidos', address: 'Rua da Paz, 128 - Jaboatão/Recife', contact: '(81) 99988-1122', needs: 'Fraldas, Cestas Básicas, Limpeza', lat: -8.0830, lng: -34.9550 },
          { id: 3, name: 'Centro Comunitário Ibura', address: 'Ladeira do Tamandaré, 45 - Recife/PE', contact: '(81) 97711-3344', needs: 'Roupas infantis, Telhas', lat: -8.1200, lng: -34.9350 }
        ],
        inventory: [
          { item: 'Cestas Básicas', total: 320, distributed: 180, available: 140 },
          { item: 'Colchões Solteiro', total: 95, distributed: 60, available: 35 },
          { item: 'Água Mineral (20L)', total: 540, distributed: 310, available: 230 }
        ]
      });
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !quantity) return;

    const newDonation = { donor: donorName, item: itemType, quantity: Number(quantity), ngo: selectedNgo };
    
    try {
      await fetch(`${API_BASE}/api/donations`, {
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
      const res = await fetch(`${API_BASE}/api/ai/optimize`, { method: 'POST' });
      const json = await res.json();
      setAiResult(json);
    } catch (err) {
      setAiResult({
        analysisTimestamp: new Date(),
        summary: 'Análise realizada com sucesso (Modo Offline).',
        allocations: [
          {
            ngo: 'ONG Esperança Passarinho',
            urgencyScore: 9.4, urgencyLabel: 'Crítica', factors: ['necessidade de água/hidratação (+2)', 'escassez de estoque (+1.5)'],
            suggestedItems: [
              { item: 'Água Mineral (20L)', recommendedUnits: 120, justification: 'Necessidade urgente de hidratação e consumo.' },
              { item: 'Colchões Solteiro', recommendedUnits: 25, justification: 'Perda de dormitórios.' }
            ]
          },
          {
            ngo: 'Associação Dois Carneiros Unidos',
            urgencyScore: 8.8, urgencyLabel: 'Crítica', factors: ['necessidade de alimentos (+1.5)', 'estoque moderado (+0.8)'],
            suggestedItems: [
              { item: 'Cestas Básicas', recommendedUnits: 90, justification: 'Esgotamento de mantimentos básicos.' }
            ]
          }
        ]
      });
    }
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Pular para o conteúdo</a>
      {/* Top Header */}
      <header className="bg-blue-900 text-white shadow-md border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800 p-2.5 rounded-xl border border-blue-700 shadow-inner">
              <HeartHandshake className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
                Recife Solidário <span className="bg-cyan-500 text-slate-900 text-xs px-2 py-0.5 rounded-full font-semibold">Crise & Logística</span>
              </h1>
              <p className="text-xs text-blue-200">Assistência humanitária integrada para Passarinho, Dois Carneiros e Região</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 rounded-lg text-xs text-amber-200 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Plantão de Emergência Ativo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav aria-label="Seções da plataforma" className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div role="tablist" aria-label="Navegação principal" className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-4 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: Activity },
            { id: 'donors', label: 'Doadores & Ofertas', icon: PlusCircle },
            { id: 'inventory', label: 'Estoque Centralizado', icon: Package },
            { id: 'map', label: 'Mapa & ONGs Próximas', icon: MapPin },
            { id: 'ai', label: 'Otimização com IA', icon: Cpu },
            { id: 'roadmap', label: 'Roadmap & Futuro', icon: Truck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
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
      <main id="conteudo" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
                <HeartHandshake className="w-96 h-96 text-white" />
              </div>
              <div className="max-w-2xl relative z-10">
                <span className="bg-cyan-400 text-blue-950 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Operação Especial Recife</span>
                <h2 className="text-3xl font-extrabold mt-3 mb-2">Conectando Doadores, Vítimas e ONGs com Agilidade</h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Plataforma unificada para controle logístico em tempo real nas comunidades mais afetadas pelas enchentes (Passarinho, Dois Carneiros e arredores). Cadastre doações, verifique estoques e utilize inteligência artificial para distribución otimizada.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('donors')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow transition text-sm flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Cadastrar Doação Agora
                  </button>
                  <button onClick={() => setActiveTab('ai')} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Simular Distribuição IA
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doações Registradas</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{data.donations.length + 42}</h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> +12 hoje
                  </span>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ONGs Parceiras</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{data.ngos.length}</h3>
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Pontos ativos
                  </span>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Áreas de Foco</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">Passarinho & Dois Carneiros</h3>
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Alta prioridade
                  </span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eficiência Logística</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">94.2%</h3>
                  <span className="text-xs text-cyan-600 font-medium flex items-center gap-1 mt-1">
                    <Cpu className="w-3.5 h-3.5" /> Otimizado por IA
                  </span>
                </div>
                <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Donations Table & NGO Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Últimas Doações Cadastradas</span>
                  <span className="text-xs font-normal text-slate-500">Atualizado em tempo real</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                        <th className="py-3 px-3">Doador</th>
                        <th className="py-3 px-3">Item</th>
                        <th className="py-3 px-3">Qtd</th>
                        <th className="py-3 px-3">ONG Destino</th>
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
                              {d.status || 'Confirmado'}
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
                    <span>Demandas Mais Urgentes</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Itens com maior escassez nas bases de Passarinho e Dois Carneiros:</p>
                  
                  <div className="space-y-3">
                    {[
                      { item: 'Água Mineral (20L ou fardos)', urgency: 'Crítico', color: 'bg-red-50 text-red-700 border-red-200' },
                      { item: 'Colchões de Solteiro / Casal', urgency: 'Muito Alto', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                      { item: 'Cestas Básicas de Alimentos', urgency: 'Alto', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { item: 'Kits de Limpeza e Desinfecção', urgency: 'Alto', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
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
                    <PlusCircle className="w-4 h-4" /> Contribuir com Estes Itens
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
              <p className="text-xs text-slate-500 mb-5">Preencha os dados do item e selecione a ONG de entrega.</p>

              {formSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-sm flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Doação cadastrada e estoque atualizado com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="donorName" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Seu Nome ou Empresa</label>
                  <input 
                    id="donorName" type="text" 
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Ex: Supermercado Recife / João Silva" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="itemType" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Tipo de Item</label>
                  <select 
                    id="itemType" value={itemType}
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
                  <label htmlFor="quantity" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Quantidade</label>
                  <input 
                    id="quantity" type="number" 
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Ex: 50" 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="selectedNgo" className="block text-xs font-semibold text-slate-700 uppercase mb-1">ONG / Ponto de Destino</label>
                  <select 
                    id="selectedNgo" value={selectedNgo}
                    onChange={(e) => setSelectedNgo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {data.ngos.map((ngo, idx) => (
                      <option key={idx} value={ngo.name}>{ngo.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-md flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Confirmar Oferta de Doação
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Histórico de Ofertas Cadastradas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Doador</th>
                      <th className="py-3 px-3">Item</th>
                      <th className="py-3 px-3">Quantidade</th>
                      <th className="py-3 px-3">Destino</th>
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
                <h3 className="text-xl font-bold text-slate-800">Estoque Centralizado & Inventário Global</h3>
                <p className="text-xs text-slate-500 mt-1">Consolidado em tempo real de todas as ONGs parceiras em Passarinho, Dois Carneiros e Ibura.</p>
              </div>
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold border border-blue-200">
                Total de SKUs Monitorados: {data.inventory.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.inventory.map((inv, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-base">{inv.item}</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">Disponível</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-xs text-slate-500 uppercase">Total Arrecadado</span>
                      <span className="text-lg font-bold text-slate-800">{inv.total}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-xs text-slate-500 uppercase">Distribuído</span>
                      <span className="text-lg font-bold text-emerald-600">{inv.distributed}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="block text-xs text-slate-500 uppercase">Disponível</span>
                      <span className="text-lg font-bold text-blue-600">{inv.available}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (inv.distributed / inv.total) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">Taxa de distribuição: {Math.round((inv.distributed / inv.total) * 100)}%</div>
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
                <span>Pontos de Arrecadação & ONGs Próximas (Recife e Região)</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">Encontre a base de recebimento mais próxima para entregar sua doação presencialmente.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.ngos.map((ngo, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-blue-400 transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 text-base">{ngo.name}</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Ativo</span>
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
                <span className="bg-cyan-400 text-blue-950 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Módulo de IA Avançada</span>
                <h3 className="text-2xl font-bold mt-3 mb-2">Otimização Inteligente de Recursos Pós-Enchentes</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Nosso algoritmo analisa o estoque global, o volume de doações recebidas e a criticidade das carências cadastradas pelas ONGs de Passarinho e Dois Carneiros, sugerindo o balanceamento ideal de distribuição sem desperdícios.
                </p>
                <button 
                  onClick={runAiOptimization}
                  disabled={loadingAi}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Cpu className={`w-5 h-5 ${loadingAi ? 'animate-spin' : ''}`} />
                  {loadingAi ? 'Processando Algoritmo de IA...' : 'Executar Análise de Otimização'}
                </button>
              </div>
            </div>

            {aiResult && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Resultado da Alocação Otimizada por IA</h4>
                    <p className="text-xs text-slate-500">Gerado em: {new Date(aiResult.analysisTimestamp).toLocaleString()}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Recomendação Concluída</span>
                </div>

                <div className="space-y-4">
                  {aiResult.allocations.map((alloc, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <h5 className="font-bold text-slate-900 text-base">{alloc.ngo}</h5>
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                          Prioridade: {alloc.urgencyScore} / 10 ({alloc.urgencyLabel || '—'})
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
                <span>Próximos Passos & Roadmap de Expansão</span>
              </h3>
              <p className="text-xs text-slate-500">Planejamento estratégico para evolução da plataforma em futuras operações humanitárias.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-slate-900 text-base">Rotas de Entrega Porta a Porta</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Implementação de rondas mensais (1 a 2 vezes por mês) utilizando veículos utilitários para entrega direta a famílias sem condições de locomoção até os pontos de coleta.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-slate-900 text-base">Integração WhatsApp Bot</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conexão via n8n e Evolution API para permitir que líderes comunitários solicitem mantimentos diretamente pelo WhatsApp com respostas automatizadas em tempo real.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="bg-cyan-100 text-cyan-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                <h4 className="font-bold text-slate-900 text-base">Painel de Transparência Pública</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dashboard público aberto para prestação de contas à sociedade civil e empresas doadoras, garantindo auditoria e confiança total nas doações entregues.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Plataforma de Assistência Humanitária Recife • Hackathon Antena na Lama — APONTI Academy • Dados do protótipo fictícios • Fontes do kit: Apac (apac.pe.gov.br) • Cemaden (cemaden.gov.br) • Dados Abertos Prefeitura do Recife • OpenStreetMap
        </div>
      </footer>
    </div>
  );
}
