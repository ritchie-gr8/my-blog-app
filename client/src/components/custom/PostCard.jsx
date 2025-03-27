import React from 'react'
import Avatar from '../global/Avatar'
import Button from '../global/Button'

const PostCard = ({image, category, title, description, author, date}) => {

  return (
    <div className='my-4 flex flex-col mx-4 h-full'>
         <img src={image ?? `https://placehold.co/360x360`} alt={title} className="w-full h-[212px] xl:h-[240px] 2xl:h-[360px] object-cover" /> 
        <Button className='px-3 py-1 w-fit mt-4 mb-2 font-medium text-b2' variant={'article-genre'}>
            {category}
        </Button>

        <h4 className='text-h4 font-semibold text-brown-600'>
            {title}
        </h4>

        <p className='text-b2 font-medium text-brown-400 mt-2 mb-4'>
            {description}
        </p>

        <div className='flex items-center'>
            <div className='flex items-center border-r border-r-brown-300 w-fit'>
                <Avatar />
                <span className='ml-2 mr-4 text-b2 text-brown-500 font-medium'>{author}</span>
            </div>
            <span className='ml-4 font-medium text-b2 text-brown-400'>{date}</span>
        </div>
    </div>
  )
}

export default PostCard