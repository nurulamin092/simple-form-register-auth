import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase.init';

const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false)
  const handleEmailBluer = (event) => {
    setEmail(event.target.value);
  }
  const handlePasswordBluer = (event) => {
    setPassword(event.target.value);
  }
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('email is send');
      })
  }
  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }
  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent!');
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      })
  }
  const handleRegisterForm = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          emailVerification();
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        })
    }
  }
  return (
    <div>
      <div className='registered w-50 mx-auto my-5'>
        <Form validated={validated} onSubmit={handleRegisterForm}>
          <h1>Please {registered ? 'Login' : 'Register'}!!</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBluer} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBluer} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already registered?" />
          </Form.Group>
          <Button onClick={handleForgetPassword} variant='link'>
            Forget password??
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
