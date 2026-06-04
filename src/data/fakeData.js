export const APP_START_TIME = Date.now();
const SIMULATED_START_TIME = new Date();
SIMULATED_START_TIME.setHours(16, 46, 0, 0); // Start at 4:46 PM

export const getSimulatedTimestamp = () => {
  const elapsed = Date.now() - APP_START_TIME;
  const simulatedNow = new Date(SIMULATED_START_TIME.getTime() + elapsed);
  return simulatedNow.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const getAvatar = (name) => `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&rounded=true&bold=true`;

export const currentUser = {
  id: 'me',
  name: 'Adya',
  avatar: getAvatar('Adya')
};

export const contacts = [
  {
    id: 'c1',
    name: 'Chloe',
    avatar: getAvatar('C'),
    status: 'doing homework...',
    isGroup: false
  },
  {
    id: 'c2',
    name: 'Jake',
    avatar: getAvatar('J'),
    status: 'gym',
    isGroup: false
  },
  {
    id: 'c3',
    name: 'Mia',
    avatar: getAvatar('M'),
    status: 'Snapchat me',
    isGroup: false
  },
  {
    id: 'c4',
    name: 'Alex',
    avatar: getAvatar('A'),
    status: 'sleep',
    isGroup: false
  },
  {
    id: 'c5',
    name: 'Dad ❤️',
    avatar: 'https://ui-avatars.com/api/?name=D&background=3b5998&color=fff&rounded=true&bold=true',
    status: 'At work',
    isGroup: false
  }
];

export const dadContact = contacts.find(c => c.id === 'c5');

export const groupChatInfo = {
  id: 'g1',
  name: 'Science Project 🔬',
  avatar: getAvatar('SP'),
  status: 'Jake, Mia, Chloe, Alex, Adya',
  isGroup: true
};

export const chatList = [groupChatInfo, ...contacts];

export const initialMessages = [
  {
    id: 'm1',
    senderId: 'c3', // Mia
    text: 'I can bring the poster board tomorrow.',
    timestamp: '4:44 PM'
  },
  {
    id: 'm2',
    senderId: 'me', // User
    text: 'Nice. I can write the volcano explanation part.',
    timestamp: '4:45 PM'
  },
  {
    id: 'm3',
    senderId: 'c1', // Chloe
    text: 'That works. Jake, can you check the science facts?',
    timestamp: '4:46 PM'
  },
  {
    id: 'm4',
    senderId: 'c2', // Jake
    text: 'why is Adya doing the explanation? she always messes up science stuff',
    timestamp: '4:46 PM'
  }
];

export const dadMessages = [

];
