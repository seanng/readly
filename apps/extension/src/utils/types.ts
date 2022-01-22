export interface Participant {
  id: string;
  role: string;
  email: string;
}

export interface Link {
  id: string;
  url: string;
}

export interface Collection {
  name: string;
  participants: Participant[];
  links: Link[];
}
