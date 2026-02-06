
import { GoogleGenAI } from "@google/genai";
import { ProposalInput } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateProposal = async (input: ProposalInput): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY});
  
  const attachmentParts = (input.attachments || []).map(att => ({
    inlineData: {
      data: att.data,
      mimeType: att.mimeType
    }
  }));

  const textPrompt = `
  GENERA UNA PROPUESTA COMERCIAL CON ${input.numOptions} OPCIÓN(ES).
  
  DATOS DEL PROYECTO:
  - Nombre: ${input.projectName}
  - Cliente: ${input.client}
  - Duración: ${input.duration || "Sugerir duración estándar (ej. 30 min)"}
  - Contexto: ${input.description}
  
  ELEMENTOS SELECCIONADOS POR EL USUARIO: 
  ${input.selectedElements.length > 0 ? input.selectedElements.join(", ") : "NINGUNO. SELECCIÓN AUTOMÁTICA REQUERIDA."}

  RESTRICCIONES PARA LA TABLA ECONÓMICA Y ALCANCE:
  1. Si no hay elementos seleccionados, elige de la LISTA OFICIAL en SYSTEM_INSTRUCTION aquellos que mejor se adapten al proyecto de '${input.projectName}' para '${input.client}'.
  2. ADVERTENCIA: NO inventes nombres. Si necesitas un video animado, usa exactamente "Video Mothion Grafics" o "Video Cartoon". Si necesitas un curso en Rise, usa "Rise Learning extenso" o "Rise microlearning". 
  3. No cambies mayúsculas, tildes ni palabras de los nombres oficiales.
  4. La Narrativa pedagógica debe justificar por qué estos elementos específicos son la mejor solución para la necesidad descrita.

  VALIDACIÓN FINAL:
  Asegúrate de que cada fila de la tabla económica tenga un nombre de concepto que exista en la LISTA OFICIAL de la base técnica. Si un elemento solicitado por el cliente (en la descripción) no existe en la lista oficial, elige el más cercano y menciónalo en la Narrativa pedagógica como una adaptación al estándar CLAP.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { 
        parts: [
          ...attachmentParts,
          { text: textPrompt }
        ] 
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // Reducido para mayor fidelidad a los nombres oficiales
        topP: 0.8,
      },
    });

    return response.text || "Error en la generación.";
  } catch (error) {
    console.error("Error generating proposal:", error);
    throw new Error("No se pudo generar la propuesta. Verifique los parámetros técnicos o la conexión.");
  }
};
