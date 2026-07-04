export type ScreenId = 'arrival' | 'artists' | 'details' | 'hub';

export interface HubCard {
  id: string;
  title: string;
  iconName: 'Ticket' | 'Footprints' | 'Brain' | 'Sparkles' | 'Trophy' | 'Compass';
  description: string;
  ctaText: string;
  accentColor: string; // Tailwinds colors: e.g. text-neon-pink, border-neon-pink/30
  glowClass: string; // glow-pink, etc
  url: string;
}

export interface FloatingWord {
  id: string;
  text: string;
  x: number; // percentage
  y: number; // percentage
  scale: number;
  delay: number;
  color: string;
}
