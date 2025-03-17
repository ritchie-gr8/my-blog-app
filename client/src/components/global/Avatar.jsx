import React from 'react'

const Avatar = ({img, size = '24'}) => {
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