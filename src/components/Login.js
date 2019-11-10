import React, {useState} from 'react';
import {useAuth} from "../hooks/useAuth";
import {DangerAlert} from "./Alerts";

export default () => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await auth.signin(email, password)
    } catch(e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <form className="form-signin" onSubmit={onSubmit}>
      <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
      {errorMessage && <DangerAlert message={errorMessage} />}
      <label htmlFor="inputEmail" className="sr-only">Email address</label>
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" id="inputEmail" className="form-control" placeholder="Email address"
             autoFocus="" autoComplete="off" />
      <label htmlFor="inputPassword" className="sr-only">Password</label>
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="inputPassword" className="form-control" placeholder="Password"
             autoComplete="off" />
      <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>
  )
}
