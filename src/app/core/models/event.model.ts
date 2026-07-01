export interface EventTranslation {
  title: string;
  description: string;
  location: string;
}

export interface KendoEvent {
  id: string;
  slug: string;
  date: string;
  translations: Record<string, EventTranslation>;
}
