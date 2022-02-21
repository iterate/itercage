import React, {useState, useEffect} from 'react';
import {database} from "./firebase";
import Loading from "./components/Loading";
import logo from "./logo.png";

export default () => {
  const [toplist, setToplist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    database.collection('top').onSnapshot(snapshot => {
      const toplist = snapshot.docs.map(doc => doc.data()).sort((a, b) => b.count - a.count);
      let editedList = (toplist && Object.values(toplist)) || [];
      editedList[0] += "🥇";
      editedList[1] += "🥈";
      editedList[2] += "🥉"; 
      setToplist(editedList);

      setLoading(false);
    })
  }, []);

  const toplistElements = toplist.map((person, index) => (
    <li key={index} className="attendees-list-item">
      <span className="name">{person.name}</span>
      <span className="timestamp">{person.count}</span>
    </li>
  ));

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <img src={logo} className="logo" alt="logo" />

      <p className="subtitle">Hvem spiller mest?</p>

      <ul className="attendees-list" style={{marginTop: '20px'}}>
        {toplistElements}
      </ul>
    </>
  );
}
