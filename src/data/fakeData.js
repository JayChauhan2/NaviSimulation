export const APP_START_TIME = Date.now();
const SIMULATED_START_TIME = new Date();
SIMULATED_START_TIME.setHours(16, 46, 0, 0); // Start at 4:46 PM

export const getSimulatedTimestamp = () => {
  const elapsed = Date.now() - APP_START_TIME;
  const simulatedNow = new Date(SIMULATED_START_TIME.getTime() + elapsed);
  return simulatedNow.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const getAvatar = (name, color) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&rounded=true&bold=true`;

export const currentUser = {
  id: 'me',
  name: 'Adya',
  avatar: getAvatar('Adya', 'FF9500')
};

export const contacts = [
  {
    id: 'c1',
    name: 'Chloe',
    avatar: getAvatar('C', '2F80ED'),
    status: 'doing homework...',
    isGroup: false
  },
  {
    id: 'c2',
    name: 'Jake',
    avatar: getAvatar('J', '7B61FF'),
    status: 'gym',
    isGroup: false
  },
  {
    id: 'c3',
    name: 'Mia',
    avatar: getAvatar('M', 'E5484D'),
    status: 'Snapchat me',
    isGroup: false
  },
  {
    id: 'c4',
    name: 'Alex',
    avatar: getAvatar('A', '65A30D'),
    status: 'sleep',
    isGroup: false
  },
  {
    id: 'c5',
    name: 'Dad ❤️',
    avatar: getAvatar('D', '3b5998'),
    status: 'At work',
    isGroup: false
  }
];

export const dadContact = contacts.find(c => c.id === 'c5');

export const groupChatInfo = {
  id: 'g1',
  name: 'Science Project 🔬',
  avatar: getAvatar('SP', '00a884'),
  status: 'Jake, Mia, Chloe, Alex, Adya',
  isGroup: true
};

export const chatList = [groupChatInfo, ...contacts];

export const initialMessages = [
  {
    id: 'm1',
    senderId: 'c3', // Mia
    text: 'i can bring the poster board tomorrow',
    timestamp: '4:44 PM'
  },
  {
    id: 'm2',
    senderId: 'me', // User
    text: 'nice, i can write the volcano explanation part!',
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
