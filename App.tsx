
import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Target, 
  Sun, 
  Moon, 
  Linkedin,
  Info,
  Layers
} from 'lucide-react';
import FormulaBlock from './components/FormulaBlock';
import { VCMState, VCMResults, SensitivityData, CurrencyUnit } from './types';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const [state, setState] = useState<VCMState>({
    ricaviY5: 50,
    ricaviUnita: CurrencyUnit.MILLIONS,
    multiplo: 6,
    discountRate: 45,
    anni: 5,
    investimento: 10,
    investUnita: CurrencyUnit.MILLIONS,
    settore: 'SaaS'
  });

  const results = useMemo((): VCMResults => {
    const ricaviTotal = state.ricaviY5 * state.ricaviUnita;
    const investTotal = state.investimento * state.investUnita;
    const dr = state.discountRate / 100;
    const exitValue = ricaviTotal * state.multiplo;
    const powerFactor = Math.pow(1 + dr, state.anni);
    const valuationToday = exitValue / powerFactor;
    const preMoneyVal = valuationToday - investTotal;
    const vcOwnership = investTotal / valuationToday;
    const roiAtteso = (exitValue * vcOwnership) / investTotal;
    const profitto = (exitValue * vcOwnership) - investTotal;
    return { exitValue, valuationToday, preMoneyVal, vcOwnership, roiAtteso, profitto, powerFactor };
  }, [state]);

  const sensitivityData = useMemo((): SensitivityData[] => {
    const ricaviTotal = state.ricaviY5 * state.ricaviUnita;
    const exitValue = ricaviTotal * state.multiplo;
    return [0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map(dr => ({
      dr: `${(dr * 100).toFixed(0)}%`,
      valuation: (exitValue / Math.pow(1 + dr, state.anni)) / 1000000
    }));
  }, [state]);

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (absValue >= 1000) return `€${(value / 1000).toFixed(1)}k`;
    return `€${value.toFixed(0)}`;
  };

  const handleInputChange = (field: keyof VCMState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              VCM Dashboard Final
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Analisi Venture Capital Method</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center text-xs text-slate-400 gap-1 border-r border-slate-200 dark:border-slate-700 pr-4">
              Built by <a href="https://www.linkedin.com/in/matteomoccia/" target="_blank" className="text-blue-500 hover:underline flex items-center gap-1 font-medium">Matteo Moccia <Linkedin size={12}/></a>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform shadow-sm">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Layers className="text-blue-500" size={20} />
                <h2 className="text-lg font-bold">Parametri Simulazione</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center justify-between">Ricavi Previsti (Anno 5) <Info size={14} className="text-slate-400" /></label>
                  <div className="flex gap-2">
                    <input type="number" value={state.ricaviY5} onChange={(e) => handleInputChange('ricaviY5', parseFloat(e.target.value))} className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    <select value={state.ricaviUnita} onChange={(e) => handleInputChange('ricaviUnita', parseInt(e.target.value))} className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2.5 outline-none font-medium">
                      <option value={CurrencyUnit.MILLIONS}>€M</option>
                      <option value={CurrencyUnit.THOUSANDS}>€k</option>
                      <option value={CurrencyUnit.ONES}>€</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Settore & Multiplo</label>
                  <div className="flex flex-wrap gap-2">
                    {[{ name: 'SaaS', val: 6 }, { name: 'DeepTech', val: 8 }, { name: 'Fintech', val: 5 }].map(s => (
                      <button key={s.name} onClick={() => { handleInputChange('multiplo', s.val); handleInputChange('settore', s.name); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${state.settore === s.name ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800'}`}>{s.name} ({s.val}x)</button>
                    ))}
                  </div>
                  <input type="number" value={state.multiplo} step="0.1" onChange={(e) => handleInputChange('multiplo', parseFloat(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center justify-between">Discount Rate <span className="text-blue-500">{state.discountRate}%</span></label>
                  <input type="range" min="20" max="70" value={state.discountRate} onChange={(e) => handleInputChange('discountRate', parseInt(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Investimento VC</label>
                  <div className="flex gap-2">
                    <input type="number" value={state.investimento} onChange={(e) => handleInputChange('investimento', parseFloat(e.target.value))} className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                    <select value={state.investUnita} onChange={(e) => handleInputChange('investUnita', parseInt(e.target.value))} className="w-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2.5 outline-none font-medium">
                      <option value={CurrencyUnit.MILLIONS}>€M</option>
                      <option value={CurrencyUnit.THOUSANDS}>€k</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <a href="https://www.linkedin.com/in/matteomoccia/" target="_blank" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-md">
                  Connettiamoci <Linkedin size={18} />
                </a>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
                <TrendingUp size={120} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-[10px] font-bold uppercase mb-1">Exit Value (Year {state.anni})</div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(results.exitValue)}</div>
                <FormulaBlock label="Formula Exit" formula="Exit Value = Ricavi Y5 × Multiplo" calculation={`= ${formatCurrency(state.ricaviY5 * state.ricaviUnita)} × ${state.multiplo}x = ${formatCurrency(results.exitValue)}`} />
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-[10px] font-bold uppercase mb-1">Valuation Oggi (Post)</div>
                <div className="text-3xl font-bold mb-1">{formatCurrency(results.valuationToday)}</div>
                <FormulaBlock label="Formula Valutazione" formula="Valuation = Exit / (1 + DR)^Anni" calculation={`= ${formatCurrency(results.exitValue)} / (1,${state.discountRate})^${state.anni} = ${formatCurrency(results.valuationToday)}`} extraFormula="Pre-money = Valuation - Investimento" extraCalculation={`= ${formatCurrency(results.valuationToday)} - ${formatCurrency(state.investimento * state.investUnita)} = ${formatCurrency(results.preMoneyVal)}`} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-l-4 border-emerald-500 shadow-xl border-y border-r border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase text-emerald-500 mb-1">VC Ownership</div>
                <div className="text-3xl font-bold text-emerald-500 mb-4">{(results.vcOwnership * 100).toFixed(1)}%</div>
                <FormulaBlock label="Formula Ownership" formula="Ownership = Investimento / Valuation" calculation={`= ${formatCurrency(state.investimento * state.investUnita)} / ${formatCurrency(results.valuationToday)} = ${(results.vcOwnership * 100).toFixed(1)}%`} />
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="text-[10px] font-bold uppercase mb-1">ROI Atteso</div>
                <div className="text-3xl font-bold mb-1">{results.roiAtteso.toFixed(1)}x</div>
                <FormulaBlock label="Formula ROI" formula="ROI = (Exit × Ownership) / Investimento" calculation={`= (${formatCurrency(results.exitValue)} × ${(results.vcOwnership * 100).toFixed(1)}%) / ${formatCurrency(state.investimento * state.investUnita)} = ${results.roiAtteso.toFixed(1)}x`} />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold mb-6">Analisi di Sensibilità</h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                    <XAxis dataKey="dr" />
                    <YAxis tickFormatter={(v) => `€${v}M`} />
                    <ChartTooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff' }} />
                    <Area type="monotone" dataKey="valuation" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500">Built with ❤️ for the VC ecosystem by <a href="https://www.linkedin.com/in/matteomoccia/" className="text-blue-500 font-semibold">Matteo Moccia</a></p>
      </footer>
    </div>
  );
};

export default App;
