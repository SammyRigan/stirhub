/* eslint-disable @typescript-eslint/naming-convention */
export interface UserProfile {
  _id: string;
  date: string;
  userId: string;
  firstname: string;
  lastname: string;
  name: string;
  username: string;
  email: string;
  telephone: string;
  address: PlaceLocation;
  gpsAddress: string;
  birthday: string;
  gender: string;
  briefBio: string;
  studyField: string;
  title: string;
  iType: string;
  knownFor: string;
  profileImgUrl?: string;
  bannerUrl: string;
  partner?: boolean;
  workHistory: WorkInfo[];
  educationHistory: EdInfo[];
  publicationCount: number;
  researchCount: number;
  abroad?: boolean;
  followers?: string[];
  following?: string[];
  liked?: string[]; // INSTITUTIONS LIKED
  observedBy: string[];
  likedBy: string[];
  observing: string[];
  industry?: string;
  businessType?: string;
  interests: string[];
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  invites: number;
  invitesSent: number;
  invitesSignedUp: number;
  website?: string;
}


export interface PlaceLocation {
  lat?: number;
  lng?: number;
  address: string;
  staticMapUrl?: string;
}

export interface EdInfo {
  school: string;
  startDate: string;
  endDate: string;
  offered: string;
  degree: string;
  contact?: {
    email: string;
    telephone: string;
  };
  location?: string;
  current: boolean;
}

export interface WorkInfo {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  date: string;
  iconUrl: string;
  imageUrl: string;
}

export interface IEvent {
  _id: string;
  date: string;
  profileId: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  attendees: Attendees[];
  physicalDetails: {
    name: string;
    mapLink: string;
  };
  virtualDetails: {
    platform: string;
    link: string;
  };
  type: string;
}

export interface Attendees {
  fullName: string;
  title: string;
  company: string;
  email: string;
  telephone: string;
}

export interface Media {
  _id: string;
  date: string;
  mediaUrl: string;
  fileName: string;
  fileType: string;
}

export interface Partner {
  _id: string;
  name: string;
  bio: string;
  email: string;
  telephone: string;
  role: string;
  date: string;
  imageUrl: string;
  link: string;
}

export interface Post {
  _id: string;
  authorId: string;
  date: string;
  title: string;
  excerpt: string;
  featureImgUrl: string;
  content: string;
  published: boolean;
  categoryId?: string;
  tags?: string[];
}

export interface PostSection {
  type: string;
  text?: string;
  mediaUrl?: string;
}

export interface Practitioner {
  id: string;
  date: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  address: PlaceLocation;
  gpsAddress: string;
  birthday: string;
  gender: string;
  bio: string;
  studyField: string;
  title: string;
}

export interface Project {
  _id: string;
  date: string;
  title: string;
  brief: string;
  partners: Person[];
  deliverables: string[];
  categoryId: string;
  imageUrl: string;
  excerpt: string;
  status: string;
  // startDate: string;
  // endDate: string;
}

export interface Publication {
  id: string;
  date: string;
  title: string;
  brief: string;
  imageUrl: string;
  fileUrl: string;
  author: Person;
  contributors: Person[];
  sponsors: Sponsor[];
  categoryId: string;
  teamIds: string[];
}

export interface Person {
  userId?: string;
  fullName?: string;
  email?: string;
  telephone?: string;
  title?: string;
  imageUrl: string;
  role?: string;
}

export interface Sponsor {
  userProId?: string;
  instId?: string;
  imgUrl?: string;
  name?: string;
  email?: string;
  telephone?: string;
  title?: string;
  role?: string;
}

export interface Research {
  _id: string;
  date: string;
  title: string;
  brief: string;
  imageUrl: string;
  fileUrl: string;
  lead: Person;
  team: Person[];
  teamIds: string[];
  sponsors: Sponsor[];
  sponsorIds: string[];
  categoryId: string;
  addedBy: string;
}

export interface Thread {
  id: string;
  date: string;
  participantIds: string[];
  lastMsgDate: string;
  messageCount: number;
  unreadCount: number;
  lastMessage: {
    image: boolean;
    message: string;
    userId: string;
    video: boolean;
    file?: boolean;
  };
  archived: string[];
}

export interface Chat {
  id: string;
  date: string;
  text: string;
  imgUrls: string[];
  videoUrl: string;
  fileUrl?: string;
  senderId: string;
  receiverId: string;
}

export interface TimePost {
  id: string;
  date: string;
  comments: number;
  imgUrls: string[];
  videoUrl?: string;
  institution?: boolean;
  likes: number;
  profileId: string;
  repliedTo: string;
  shares: number;
  text: string;
  pollId?: string;
  announcement?: boolean;
  color?: string;
}

export interface PostPoll {
  id: string;
  date: string;
  profileId: string;
  question: string;
  dueDate: string;
  duration: number[];
  options: {
    index: number;
    value: string;
    amount: number;
  }[];
  responses: {
    profileId: string;
    optionIndex: number;
  }[];
  closed: boolean;
}

export interface iReport {
  id: string;
  date: string;
  collection: string;
  docId: string;
  reporterId: string;
}

export interface IAnnouncement {
  id: string;
  date: string;
  text: string;
  color: string;
  profileId: string;
}
