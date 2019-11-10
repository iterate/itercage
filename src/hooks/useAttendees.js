import {useEffect, useState} from 'react';
import {database} from "../firebase";

const useAttendees = () => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    database.collection('attendees').onSnapshot(snapshot => {
      const attendees = snapshot.docs.filter(doc => doc.data().timestamp).map(doc => {
        const data = doc.data();

        return {
          ...data,
          timestamp: data.timestamp.toDate()
        }
      }).sort((a, b) => a.timestamp - b.timestamp);
      setAttendees((attendees && Object.values(attendees)) || []);
    })
  }, []);

  return attendees
};

export default useAttendees;
