'use client';

import React, { useState } from 'react';
import { CognitoUserPool, CognitoUser, ICognitoUserData } from 'amazon-cognito-identity-js';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Confirm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const router = useRouter();

  const poolData = {
    UserPoolId: 'ap-northeast-2_MOp2LBaMU',
    ClientId: '4hhqgfj55n7spi2rmm4svb7d3n'
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userPool = new CognitoUserPool(poolData);

    const userData: ICognitoUserData = {
      Username: username.toLowerCase(),
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    try {
      await new Promise<void>((resolve, reject) => {
        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      alert('Confirmation successful. You can now login.');
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'ExpiredCodeException') {
          alert('Confirmation code has expired. Please request a new one.');
        } else {
          alert(`Confirmation failed: ${err.message}`);
        }
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Confirm Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username or Email:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="code">Confirmation Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Confirm), { ssr: false });