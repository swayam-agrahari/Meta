"use client"
import React, { useEffect } from 'react';
import Lander from './lander';
import { useRouter } from 'next/navigation';


export default function Home() {

  const navigate = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate.push('/login');
      return;
    }
  }
  )
  return (
    <Lander />
  );
}
