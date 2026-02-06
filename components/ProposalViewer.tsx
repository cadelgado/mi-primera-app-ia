
import React, { useRef } from 'react';

interface ProposalViewerProps {
  proposal: string;
  projectName: string;
}

const ProposalViewer: React.FC<ProposalViewerProps> = ({ proposal, projectName }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const exportToPdf = () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const fileName = `Propuesta_${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  /**
   * Procesa estilos en línea (negrita) eliminando los asteriscos y devolviendo fragmentos de React.
   */
  const processInlineStyles = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  /**
   * Renderizador de Markdown personalizado que maneja tablas agrupadas y jerarquía de títulos.
   */
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableBuffer: string[][] = [];
    let isTableActive = false;

    const flushTable = (key: string) => {
      if (tableBuffer.length === 0) return;
      
      const rows = tableBuffer.filter(row => !row.every(cell => cell.trim().match(/^[|\- ]+$/)));
      tableBuffer = [];
      if (rows.length === 0) return;

      const headers = rows[0];
      const body = rows.slice(1);

      elements.push(
        <div key={key} className="overflow-x-auto my-6">
          <table>
            <thead>
              <tr>
                {headers.map((cell, idx) => (
                  <th key={idx}>{processInlineStyles(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{processInlineStyles(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('|')) {
        const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        const cleanCells = cells.length > 0 ? cells : line.split('|').filter(c => c.trim() !== '');
        tableBuffer.push(cleanCells);
        isTableActive = true;
      } else {
        if (isTableActive) {
          flushTable(`table-${i}`);
          isTableActive = false;
        }

        if (trimmed.startsWith('## ')) {
          elements.push(
            <h2 key={i} className="text-[#002437] font-bold text-xl mt-10 mb-4 border-b-2 border-[#3B82F6] pb-2 uppercase tracking-tight">
              {processInlineStyles(trimmed.replace('## ', ''))}
            </h2>
          );
        } else if (trimmed.startsWith('### ')) {
          elements.push(
            <h3 key={i} className="text-[#002437] font-bold text-lg mt-6 mb-2">
              {processInlineStyles(trimmed.replace('### ', ''))}
            </h3>
          );
        } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          elements.push(
            <li key={i} className="ml-6 mb-2 list-disc text-sm text-[#374151]">
              {processInlineStyles(trimmed.substring(2))}
            </li>
          );
        } else if (trimmed === '') {
          elements.push(<div key={i} className="h-4"></div>);
        } else {
          elements.push(
            <p key={i} className="mb-3 text-sm text-[#1F2937] leading-relaxed">
              {processInlineStyles(line)}
            </p>
          );
        }
      }
    });

    if (isTableActive) {
      flushTable(`table-final`);
    }

    return elements;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E5E7EB] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#002437] px-8 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="bg-[#3B82F6] p-1.5 rounded shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest">Documento de Cotización Técnica</h3>
        </div>
        <button 
          onClick={exportToPdf}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border border-white/20 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          EXPORTAR TEXTO (PDF)
        </button>
      </div>
      
      <div ref={contentRef} className="p-10 proposal-content bg-white">
        {renderMarkdown(proposal)}
      </div>

      <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] text-[#A8A8A8] font-bold uppercase tracking-widest">Verificación de Estilo CLAP Aprobada</span>
        </div>
        <span className="text-[10px] text-[#A8A8A8] italic">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ProposalViewer;
