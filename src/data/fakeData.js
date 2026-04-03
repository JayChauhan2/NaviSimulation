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
  name: 'Me', // Teenage Girl
  avatar: getAvatar('Me')
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
  status: 'Jake, Mia, Chloe, Alex, You',
  isGroup: true
};

export const chatList = [groupChatInfo, ...contacts];

export const initialMessages = [
  {
    id: 'm1',
    senderId: 'me',
    text: 'Hey guys! When are we meeting up to start the science project?? It\'s literally due next week 😭',
    timestamp: '4:30 PM'
  },
  {
    id: 'm2',
    senderId: 'c2', // Jake
    text: 'bro idk whenever just lmk',
    timestamp: '4:35 PM'
  },
  {
    id: 'm3',
    senderId: 'c3', // Mia
    text: 'I can do tomorrow right after school! Does that work for everyone?',
    timestamp: '4:37 PM'
  },
  {
    id: 'm4',
    senderId: 'c4', // Alex
    text: 'nah cant do tmrw got practice.',
    timestamp: '4:40 PM'
  },
  {
    id: 'm5',
    senderId: 'me', // User
    text: 'Okay what about Thursday then? We really need to get the poster board done.',
    timestamp: '4:42 PM'
  },
  {
    id: 'm6',
    senderId: 'c1', // Chloe
    text: 'Thursday works perfectly for me! I can bring the markers and stuff.',
    timestamp: '4:44 PM'
  },
  {
    id: 'm7',
    senderId: 'c2', // Jake
    text: 'bet. ill be there, im lowkey struggling in science so i need this grade lol',
    timestamp: '4:45 PM'
  }
];

export const dadMessages = [

];
