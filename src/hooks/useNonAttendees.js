import {useEffect, useState} from 'react';
import {database} from "../firebase";

const useNonAttendees = () => {
  const [nonAttendees, setNonAttendees] = useState([]);

  useEffect(() => {
    database.collection('nonAttendees').onSnapshot(snapshot => {
      const nonAttendees = snapshot.docs.filter(doc => doc.data().timestamp).map(doc => {
        const data = doc.data();

        return {
          ...data,
          timestamp: data.timestamp.toDate()
        }
      }).sort((a, b) => a.timestamp - b.timestamp);
      setNonAttendees((nonAttendees && Object.values(nonAttendees)) || []);
    })
  }, []);

  return nonAttendees
};

export default useNonAttendees;
