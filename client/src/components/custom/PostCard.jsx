import React from 'react'
// import articleImg from '../../assets/article-card-placeholder.png'
// import articleImg from '../../assets/article-placeholder.jpg'
// import articleImg from '../../assets/article-placeholder-2.jpg'
import Avatar from '../global/Avatar'
import Button from '../global/Button'

const PostCard = ({image, category, title, description, author, date}) => {
  return (
    <div className='my-4 flex flex-col mx-4'>
        <img src={image} alt={title} className="w-full h-auto max-h-[240px] object-cover" />

        <Button className='px-3 py-1 w-fit mt-4 mb-2 font-medium text-b2' variant={'article-genre'}>
            {category}
        </Button>

        <h4 className='text-h4 font-semibold text-brown-600'>
            {title}
        </h4>

        <p className='text-b2 font-medium text-brown-400 mt-2 mb-4'>
            {description}
        </p>

        <div className='flex'>
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