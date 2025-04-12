import React from 'react'

const Avatar = ({img, size = '24'}) => {
  if (img) return (
    <div className='rounded-full overflow-hidden' style={{
        height: `${size}px`,
        width: `${size}px`,
    }}>
      <img src={img} alt='user profile picture' className='object-cover w-full h-full' />
    </div>
  )

  return (
    <div className='rounded-full bg-red-400 inline-block'
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    />
    
  )
}

export default Avatar