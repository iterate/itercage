import { useEffect, useState } from 'react';
import { database } from '../firebase';

const useRegisteredUsers = () => {
  const [registeredUsers, setRegisteredUsers] = useState({ attendees: [], nonAttendees: [], loading: true });

  useEffect(() => {
    database.collection('registered-users').onSnapshot((snapshot) => {
      const registeredUsers = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          timestamp: data.timestamp.toDate(),
        };
      });

      const attendees =
        (registeredUsers &&
          Object.values(registeredUsers)
            .filter((registeredUser) => registeredUser.isAttending)
            .sort((a, b) => a.timestamp - b.timestamp)) ||
        [];
      const nonAttendees =
        (registeredUsers &&
          Object.values(registeredUsers)
            .filter((registeredUser) => !registeredUser.isAttending)
            .sort((a, b) => a.timestamp - b.timestamp)) ||
        [];

      setRegisteredUsers({
        attendees,
        nonAttendees,
        loading: false,
      });
    });
  }, []);

  return registeredUsers;
};

export default useRegisteredUsers;
