import React from 'react';

const texts = [
  "Well, Baby-O, it's not exactly mai-thais and yatzee out here but... let's do it!",
  'I never disrobe before gunplay.',
  "Sorry boss, but there's only two men I trust. One of them's me. The other's not you.",
  "That's funny, my name's Roger. Two Rogers don't make a right!",
  "I did a bare 360 triple backflip in front of twenty-two thousand people. It's kind of funny, it's on YouTube, check it out. But when my dad got sick, I did something way crazier than that.",
  "Well, I think we'd like God on our side at the moment, don't you?",
  'Put the bunny back in the box.',
  "Well, I'm one of those fortunate people who like my job, sir. Got my first chemistry set when I was seven, blew my eyebrows off, we never saw the cat again, been into it ever since.",
  "Look, I'm just a biochemist. Most of the time, I work in a little glass jar and lead a very uneventful life.",
  "I just stole fifty cars in one night! I'm a little tired, little wired, and I think I deserve a little appreciation!",
  'Bangers and mash! Bubbles and squeak! Smoked eel pie! Haggis!',
  'Somehow they managed to get every creep and freak in the universe on this one plane.',
  "Listen, I think we got started off on the wrong foot. I'm Stan Goodspeed, FBI. Uh - Let's talk music. Do you like the Elton John song, 'Rocket Man'?",
  'Some things are true whether you believe in them or not.',
  "He may have my soul, but he doesn't have my spirit.",
  'I love pressure. I eat it for breakfast.',
  "This thing... There's no conscience, just hunger. The Rider's gonna come out. And when he does, he'll destroy whoever's got it coming.",
  "I want to take his face... off. Eyes, nose, skin, teeth. It's coming off.",
  'I could eat a peach for hours.',
  'Dr Walsh! I was enjoying some of your groovy painkillers!',
];

export default () => {
  return (
    <div className="hang-on">
      <img className="spinner" src="/favicon.ico" alt="" />
      <p className="cage-chat">{texts[Math.floor(Math.random() * texts.length)]}</p>
    </div>
  );
};
