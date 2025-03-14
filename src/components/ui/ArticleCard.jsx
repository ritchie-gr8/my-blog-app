import React from 'react'
import articleImg from '../../assets/article-card-placeholder.png'
import Avatar from '../global/Avatar'

const ArticleCard = () => {
  return (
    <div className='my-4 flex flex-col mx-4'>
        <img src={articleImg} alt='article image' className="w-full h-auto" />
        
        <div className='bg-brand-light-green text-brand-green px-3 py-1 rounded-full w-fit mt-4 mb-2 font-medium text-b2'>
            Cat
        </div>

        <h4 className='text-h4 font-semibold text-brown-600'>
            The Fascinating World of Cats: Why We Love Our Furry Friends
        </h4>

        <p className='text-b2 font-medium text-brown-400 mt-2 mb-4'>
            Cats, with their mix of independence and affection, have charmed humans for centuries. Discover what makes these playful.
        </p>

        <div className='flex'>
            <div className='flex items-center border-r border-r-brown-300 w-fit'>
                <Avatar />
                <span className='ml-2 mr-4 text-b2 text-brown-500 font-medium'>Thompson P.</span>
            </div>
            <span className='ml-4 font-medium text-b2 text-brown-400'>11 September 2024</span>
        </div>
    </div>
  )
}

export default ArticleCard