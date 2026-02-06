
import React, { useState } from 'react';
import { ProposalInput, AppStatus } from './types';
import { generateProposal } from './services/geminiService';
import InputForm from './components/InputForm';
import ProposalViewer from './components/ProposalViewer';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [proposal, setProposal] = useState<string>('');
  const [lastProjectName, setLastProjectName] = useState<string>('Proyecto_CLAP');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: ProposalInput) => {
    setStatus(AppStatus.GENERATING);
    setError(null);
    setLastProjectName(data.projectName || 'Proyecto_CLAP');
    try {
      const result = await generateProposal(data);
      setProposal(result);
      setStatus(AppStatus.COMPLETED);
      
      setTimeout(() => {
        document.getElementById('proposal-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* CLAP Header / Navbar */}
      <header className="bg-[#002437] text-white py-4 px-8 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#4A90E2] w-8 h-8 rounded flex items-center justify-center font-bold text-white shadow-inner">C</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">CLAP <span className="font-normal opacity-80">| LMS Admin</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-[#3B82F6] font-bold mt-1">Proposal Generator Pro</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-[#3B82F6] transition-colors border-b-2 border-transparent hover:border-[#3B82F6] pb-1">Proyectos</a>
            <a href="#" className="hover:text-[#3B82F6] transition-colors border-b-2 border-transparent hover:border-[#3B82F6] pb-1">Plantillas</a>
            <a href="#" className="text-[#3B82F6] border-b-2 border-[#3B82F6] pb-1">Generador</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Intro Section */}
        <section className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-sm">
          <h2 className="text-2xl font-bold text-[#002437] mb-2 tracking-tight">Diseñador Instruccional Senior</h2>
          <p className="text-[#374151] text-sm leading-relaxed">
            Bienvenido al sistema de generación de propuestas técnica para Objetos Virtuales de Aprendizaje (OVA). 
            Complete los campos para estructurar una propuesta alineada a los estándares corporativos de CLAP.
          </p>
        </section>

        {/* Form Section */}
        <section>
          <InputForm onSubmit={handleGenerate} isLoading={status === AppStatus.GENERATING} />
        </section>

        {/* Error State */}
        {status === AppStatus.ERROR && (
          <div className="bg-[#FEE2E2] border-l-4 border-[#EF4444] p-4 rounded-r-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs text-[#EF4444] font-bold uppercase tracking-wider">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <section id="proposal-result">
          {status === AppStatus.COMPLETED && (
            <ProposalViewer proposal={proposal} projectName={lastProjectName} />
          )}
        </section>

        {/* Footer Metrics Sim (CLAP Style) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          {[
            { label: 'Proyectos Activos', value: '12', color: 'text-[#3B82F6]' },
            { label: 'Propuestas Hoy', value: '5', color: 'text-[#10B981]' },
            { label: 'Tiempo Ahorrado', value: '8h', color: 'text-[#6366F1]' },
            { label: 'Calidad IA', value: '98%', color: 'text-[#F59E0B]' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-sm">
              <p className="text-[10px] font-bold text-[#A8A8A8] uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Admin Quick Action */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-[#002437] text-white w-12 h-12 rounded-full shadow-xl hover:bg-[#3B82F6] transition-all flex items-center justify-center">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      </div>
    </div>
  );
};

export default App;
