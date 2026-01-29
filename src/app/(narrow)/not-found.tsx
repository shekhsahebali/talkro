'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function PageNotFount() {
    const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='text-lg font-semibold'>Page Not Found</p>
      <Button className='mt-4' variant='outline' onClick={() => router.back()}>Go Back</Button>
    </div>
  )
}

export default PageNotFount