"use client"
import React, { useEffect } from 'react';
import Lander from './lander';
import { useRouter } from 'next/navigation';


export default function Home() {
  const token = localStorage.getItem('token');
  const navigate = useRouter();

  useEffect(() => {
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
