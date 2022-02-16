export interface Collection {
  id: string;
  name: string;
  participants: Participant[];
  links: Link[];
}

export interface CreateLinkPayload {
  title: string;
  url: string;
  faviconUrl: string;
  description: string;
  collectionId: string;
}

export interface Link extends Omit<CreateLinkPayload, 'collectionId'> {
  id: string;
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
