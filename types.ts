
export interface Attachment {
  data: string;
  mimeType: string;
  name: string;
}

export interface ProposalInput {
  projectName: string;
  client: string;
  type: string; // Se mantiene para compatibilidad, pero se priorizan los elementos
  selectedElements: string[];
  designType: string;
  canvas: string[];
  devices: string;
  voiceType: string;
  numOptions: number;
  description: string;
  duration: string;
  customNarrative?: string;
  attachments?: Attachment[];
}

// Fixed: Removed redundant interface AppStatus which was causing merge errors with the enum declaration.
export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
