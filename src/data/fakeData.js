// Generate default placeholder avatars using ui-avatars

const getAvatar = (name) => `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&rounded=true&bold=true`;

export const currentUser = {
  id: 'me',
  name: 'Me',
  avatar: getAvatar('M')
};

export const contacts = [
  {
    id: 'c1',
    name: 'Alex',
    avatar: getAvatar('Alex'),
    status: 'Sleeping...'
  },
  {
    id: 'c2',
    name: 'Bro',
    avatar: getAvatar('Bro'),
    status: 'Urgent calls only'
  },
  {
    id: 'c3',
    name: 'Chris',
    avatar: getAvatar('Chris'),
    status: 'Battery about to die fr'
  },
  {
    id: 'c4',
    name: 'Dani',
    avatar: getAvatar('Dani'),
    status: 'Gaming'
  },
  {
    id: 'c5',
    name: 'Eli',
    avatar: getAvatar('Eli'),
    status: 'Available'
  },
];

export const groupChatInfo = {
  id: 'g1',
  name: 'The Squad 💀',
  avatar: getAvatar('S'),
  members: ['me', 'c1', 'c2', 'c3']
};

export const initialMessages = [
  {
    id: 'm1',
    senderId: 'c1',
    text: 'yo are we still linking up today??',
    timestamp: '10:00 AM'
  },
  {
    id: 'm2',
    senderId: 'c2',
    text: 'yeah bro im already omw',
    timestamp: '10:05 AM'
  },
  {
    id: 'm3',
    senderId: 'c3',
    text: 'wait drop the pin idek where we going tbh',
    timestamp: '10:12 AM'
  },
  {
    id: 'm4',
    senderId: 'me',
    text: 'bro literally look at the gc description 💀',
    timestamp: '10:15 AM'
  },
  {
    id: 'm5',
    senderId: 'c1',
    text: 'nah fr bro is lost 😭',
    timestamp: '10:16 AM'
  }
];
