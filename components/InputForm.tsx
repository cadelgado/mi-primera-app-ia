
import React, { useState, useRef } from 'react';
import { ProposalInput, Attachment } from '../types';

const FORMATION_ELEMENTS = [
  "Menú tradicional", "Menú Esquema de Aprendizaje", "Menú Bot Learning", "Menú 360 Ilustración", "Menú 360 Foto",
  "Story Learning contenido extenso", "Story Learning Microlearning", "Mobile learning", "Cards for learning",
  "Rise Learning extenso", "Rise microlearning", "Magazine Learning - e-book", "Infografía", "Audio Podcast",
  "Nanolearning", "Hablando con expertos", "PDFs", "Learning Tutorial", "Wetoons", "Recorrido 360° (articulate)",
  "Video avatar IA", "Video Mothion Grafics", "Video Cartoon", "Video hablando con expertos", "Video Podcats",
  "Video Flipbook", "Video Clips", "Video Infografico", "Video interactivo", "Video Isometrico", "Learning Actions",
  "Video WhiteBoard", "Video Screencast", "Video Tipografias Animadas", "Video con presentador real",
  "Video Clips tipo miniserie", "Video Webinar - Encuentros de aprendizaje", "Video Nanovideo", "Mini Juego",
  "Juego avanzado", "Play to learning", "Chat learning"
];

const DESIGN_TYPES = ["Recomendado por IA", "Ilustración 2D", "Ilustración 3D", "Fotografía", "Combinado foto / Ilustración 2D", "Combinado foto / Ilustración 3D"];
const VOICES = ["IA", "Profesional", "No aplica"];

interface InputFormProps {
  onSubmit: (data: ProposalInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('Minutos');
  const [selectionMode, setSelectionMode] = useState<'ia' | 'manual'>('ia');
  
  const [formData, setFormData] = useState<ProposalInput>({
    projectName: '',
    client: '',
    type: 'Curso e-learning',
    selectedElements: [],
    designType: 'Recomendado por IA',
    canvas: ['Horizontal'],
    devices: 'Multidispositivo',
    voiceType: 'IA',
    numOptions: 1,
    description: '',
    duration: '',
    attachments: [],
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleElement = (el: string) => {
    setFormData(prev => ({
      ...prev,
      selectedElements: prev.selectedElements.includes(el)
        ? prev.selectedElements.filter(item => item !== el)
        : [...prev.selectedElements, el]
    }));
  };

  const handleModeChange = (mode: 'ia' | 'manual') => {
    setSelectionMode(mode);
    setFormData(prev => ({ ...prev, selectedElements: [] }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      newAttachments.push({ name: file.name, mimeType: file.type, data: fileData });
    }
    setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAttachments] }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDuration = durationValue ? `${durationValue} ${durationUnit}` : '';
    onSubmit({ ...formData, duration: finalDuration });
  };

  const inputClasses = "mt-1 block w-full px-4 py-2 bg-white text-[#1F2937] text-sm rounded-md border border-[#E5E7EB] shadow-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all";
  const labelClasses = "text-[11px] font-bold text-[#374151] uppercase tracking-wider";

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E7EB]">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Información del Proyecto */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
            <h2 className="text-sm font-bold text-[#002437] uppercase tracking-widest">1. Información del Proyecto</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Nombre del Proyecto</label>
              <input required name="projectName" value={formData.projectName} onChange={handleChange} className={inputClasses} placeholder="Ej: Programa Mentores SUMMA" />
            </div>
            <div>
              <label className={labelClasses}>Cliente</label>
              <input required name="client" value={formData.client} onChange={handleChange} className={inputClasses} placeholder="Ej: Grupo Argos" />
            </div>
          </div>
        </section>

        {/* 2. Elementos de Formación */}
        <section className="space-y-4">
          <label className={labelClasses}>2. Elementos de Formación (Catálogo CLAP)</label>
          <p className="text-[10px] text-[#6B7280] italic -mt-2">Indique cómo desea definir los componentes de la propuesta.</p>
          
          <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-max mb-4">
            <button
              type="button"
              onClick={() => handleModeChange('ia')}
              className={`px-6 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                selectionMode === 'ia' 
                ? 'bg-[#002437] text-white shadow-sm' 
                : 'text-[#4B5563] hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              PROPONER IA
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('manual')}
              className={`px-6 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                selectionMode === 'manual' 
                ? 'bg-[#002437] text-white shadow-sm' 
                : 'text-[#4B5563] hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              ESCOGER ELEMENTOS DE FORMACIÓN
            </button>
          </div>

          {selectionMode === 'manual' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 h-48 overflow-y-auto p-4 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] scrollbar-thin animate-in fade-in duration-300">
              {FORMATION_ELEMENTS.map(el => (
                <button
                  key={el}
                  type="button"
                  onClick={() => toggleElement(el)}
                  className={`text-[10px] p-2 rounded text-left transition-all border leading-tight h-10 flex items-center ${
                    formData.selectedElements.includes(el) 
                      ? 'bg-[#002437] text-white border-[#002437]' 
                      : 'bg-white text-[#4A5568] border-[#E5E7EB] hover:border-[#3B82F6]'
                  }`}
                >
                  {el}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-[#E5E7EB] rounded-md bg-[#F9FAFB] flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <svg className="w-8 h-8 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <p className="text-sm font-bold text-[#002437]">Inteligencia Artificial Activa</p>
              <p className="text-[11px] text-[#6B7280] max-w-sm mt-1">La IA sugerirá automáticamente la mezcla óptima de elementos basada en su contexto y los estándares del formato de cotización oficial.</p>
            </div>
          )}
        </section>

        {/* 3. Parámetros Técnicos */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold text-[#002437] uppercase tracking-widest border-b border-[#F3F4F6] pb-2">3. Parámetros Técnicos</h2>
          
          <div className="bg-[#F3F7FF] p-5 rounded-md border border-[#D1E0FF] shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <label className={labelClasses}>Duración del Contenido (Validación Automática)</label>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="number" 
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  className={`${inputClasses} font-mono`} 
                  placeholder="Cantidad (Ej: 30)"
                />
              </div>
              <div className="w-48">
                <select 
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className={`${inputClasses} font-bold`}
                >
                  <option>Minutos</option>
                  <option>Módulos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClasses}>Tipo de Diseño</label>
              <select name="designType" value={formData.designType} onChange={handleChange} className={inputClasses}>
                {DESIGN_TYPES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Dispositivos</label>
              <select name="devices" value={formData.devices} onChange={handleChange} className={inputClasses}>
                <option>PC</option>
                <option>Mobile</option>
                <option>Multidispositivo</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Locución Sugerida</label>
              <select name="voiceType" value={formData.voiceType} onChange={handleChange} className={inputClasses}>
                {VOICES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* 4. Configuración de Propuesta */}
        <section className="space-y-4">
          <div className="flex items-center justify-between bg-white p-5 rounded-md border border-[#E5E7EB] shadow-sm">
            <div className="max-w-xs">
              <label className={labelClasses}>Opciones de Propuesta</label>
              <p className="text-[10px] text-[#6B7280] mt-1">Alternativas de alcance para el cliente.</p>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData(prev => ({...prev, numOptions: n}))}
                  className={`w-12 h-12 rounded-lg font-bold transition-all border-2 flex items-center justify-center ${
                    formData.numOptions === n 
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-md scale-105' 
                      : 'bg-white text-[#002437] border-[#E5E7EB] hover:border-[#3B82F6]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Necesidad y Adjuntos */}
        <section className="space-y-4">
          <div>
            <label className={labelClasses}>Necesidad, Audiencia y Contexto</label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              className={`${inputClasses} resize-none`} 
              placeholder="Describa el problema corporativo, a quién va dirigido y qué se espera lograr..." 
            />
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
               <label className={labelClasses}>Adjuntos del Cliente (Brief / RFP)</label>
               {formData.attachments && formData.attachments.length > 0 && (
                 <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase animate-bounce">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                   Cargado correctamente
                 </span>
               )}
            </div>
            <div className="mt-1 flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="px-5 py-2.5 border-2 border-dashed border-[#CBD5E1] rounded-lg text-xs font-bold text-[#3B82F6] hover:bg-[#F8FAFC] hover:border-[#3B82F6] transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                CARGAR RFP
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.doc,.docx,.txt" />
            </div>
            
            {/* Visualización de archivos cargados con feedback mejorado */}
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.attachments.map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#F1F5F9] p-3 rounded-md border border-[#E2E8F0] group animate-in slide-in-from-left-2 duration-300">
                    <div className="flex items-center gap-2 overflow-hidden">
                       <div className="bg-[#3B82F6]/10 p-1.5 rounded">
                         <svg className="w-4 h-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[11px] text-[#334155] font-bold truncate max-w-[140px]">{f.name}</span>
                         <span className="text-[9px] text-green-600 font-semibold flex items-center gap-1">
                           <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                           Listo para procesar
                         </span>
                       </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({...prev, attachments: prev.attachments?.filter((_, idx) => idx !== i)}))} 
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                      title="Eliminar archivo"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="pt-6 border-t border-[#F1F5F9]">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl flex items-center justify-center gap-3 ${
              isLoading 
                ? 'bg-[#94A3B8] cursor-not-allowed' 
                : 'bg-[#2563eb] hover:bg-[#1e40af]'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                GENERANDO PROPUESTA...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                CONSTRUIR PROPUESTA TÉCNICA
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
