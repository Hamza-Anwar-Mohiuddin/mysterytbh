"use client"
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react'

const page = () => {
    const params = useParams<{ username: string }>();
  return (
    <div>username: {params.username}</div>
  )
}

export default page