import { Message } from '@/model/user.model';
import React from 'react'
import dayjs from 'dayjs';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
  };
const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {

          onMessageDelete(message._id);
    
        } catch (error) {
          console.log(error);
          
          };
        } 
 
  return (
    <>
        <div
  className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg overflow-hidden shadow-xl max-w-sm"
>
  <div className="p-4">
    <h2 className="text-lg font-semibold mb-2 text-white">{message.content}</h2>
    <p className="text-sm mb-4 text-white">
    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
    
    </p>
    <div className="flex justify-end space-x-4">
      <button onClick={handleDeleteConfirm}
        className="duration-300 bg-black/0 hover:bg-black/25 text-white font-bold py-2 px-4 rounded"
      >
        Decline
      </button>
    </div>
  </div>
</div>

    </>

  )
}

export default MessageCard