"use client"
import Auth from '@/utils/AuthHOC/Auth'
import React from 'react'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div className='h-screen w-full '>
      Dashboard
    </div>
  )
}

export default Auth(Dashboard)