"use client"
import DashboardLayout from '@/Layout/Layout'
import Auth from '@/utils/AuthHOC/Auth'
import React from 'react'

type Props = {}

const Dashboard = (props: Props) => {
  return (
    <DashboardLayout>
      <div>
        Dashboard
      </div>
    </DashboardLayout>
  )
}

export default Auth(Dashboard)