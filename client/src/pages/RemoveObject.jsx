import { Scissors, Sparkles, Download } from 'lucide-react';
import React, { useState } from 'react'
import Markdown from 'react-markdown';
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState(null);
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [fileKey, setFileKey] = useState(0);
  
  const {getToken} = useAuth()
     
  const onSubmitHandler = async(e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if(object.split(' ').length > 1) {
        setLoading(false)
        return toast.error('Please enter only 1 object name')
      }
    
      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)

      const {data} = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success) {
        setContent(data.content)
        // Reset the file input after successful upload
        setInput(null)
        setFileKey(prev => prev + 1)
      } else {
        toast.error(data.message)
      }
    }
    catch(error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `object-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left column */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input 
          key={fileKey}
          onChange={(e) =>setInput(e.target.files[0])} 
          type='file' 
          accept='image/*' 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' 
          required 
        />
        
        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>

        <textarea 
          onChange={(e) =>setObject(e.target.value)} 
          value={object} 
          rows={4} 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='e.g., watch or spoon, Only single object name' 
          required 
        />

        <button disabled={loading} className='flex w-full justify-center items-center gap-2 bg-[#226BFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Scissors className='w-5' />
          }
          Remove object
        </button>
      </form>

      {/* right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Scissors className='w-5 h-5 text-[#4A7AFF]' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
          {content && (
            <button 
              onClick={handleDownload}
              className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-lg transition-colors'
            >
              <Download className='w-4 h-4' />
              Download
            </button>
          )}
        </div>

        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='w-9 h-9' />
                <p>Upload an image and click "Remove Object" to get started</p>
              </div>
            </div>
          ) : (
            <img src={content} alt="image" className='w-full h-full mt-3' />
          )
        }
      </div>
    </div>
  )
}

export default RemoveObject