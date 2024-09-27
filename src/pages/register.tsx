import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Confirm that we are on the client
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const poolData = {
      UserPoolId: 'ap-northeast-2_MOp2LBaMU',
      ClientId: '4hhqgfj55n7spi2rmm4svb7d3n'
    };

    const userPool = new CognitoUserPool(poolData);

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      alert('Registration successful. Please check your email for confirmation code.');
      if (result && isClient) {
        window.location.href = "/confirm"; // Redirect after successful registration
      }
    });
  };

  // Conditional rendering based on isClient
  if (!isClient) {
    return null; // Or a loading spinner/message
  }

  return (
    <div>
      <h1>BOOKSTORE FOR YOU</h1>
      <h2>Register!</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
