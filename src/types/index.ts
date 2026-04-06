export interface HistoricalEvent {
  id: number;
  title: string;
  year: number;
  lat: number;
  lng: number;
  place: string;
  description: string;
  people: string[];
  type: string;
  highlight: boolean;
  images: string[];
  videos: string[];
  links: string[];
}

export interface PersonData {
  person: string;
  title: string;
  born: number;
  died: number;
  portrait: string;
  summary: string;
  events: HistoricalEvent[];
}
