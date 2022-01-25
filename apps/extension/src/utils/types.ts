export interface Collection {
  id: string;
  name: string;
  participants: Participant[];
  links: Link[];
}

export interface Link {
  id: string;
  url: string;
  title: string;
  readerInfo: ReaderInfo;
}

export interface Participant {
  id: string;
  role: string;
  email: string;
}

export type ReaderInfo = Record<
  string,
  {
    hasReadIt: boolean;
  }
>;
