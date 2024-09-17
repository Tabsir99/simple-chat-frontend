'use client'
import ChatHeader from '@/components/chats/chatHeader';
import MessageInput from '@/components/chats/messageInput';
import { useState, useEffect, useRef } from 'react';

export default function ChatRoom() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how are you doing?", type: "outgoing", time: "2:34 PM" },
    { id: 2, text: "I'm good, thanks for asking. What about you?", type: "incoming", time: "2:35 PM" },
    { id: 3, text: "All good here! Just working on the project.", type: "outgoing", time: "2:37 PM" }
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [newMessageId, setNewMessageId] = useState<null | number>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        type: 'outgoing',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      setNewMessageId(newMessage.id);
      setInputValue('');
      setIsTyping(false);
      
      // Reset newMessageId after animation
      setTimeout(() => setNewMessageId(null), 300);
    }
  };

  useEffect(() => {
    if (inputValue) setIsTyping(true);
    else setIsTyping(false);
  }, [inputValue]);

  return (
    <section className="bg-[#292f36] w-full h-screen flex flex-col border-l-2 border-gray-700">
      {/* Chat Header */}
      <ChatHeader />

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                ${message.type === 'outgoing' ? 'bg-blue-600' : 'bg-[#343c46]'} 
                text-white p-3 rounded-lg max-w-sm shadow-md
                ${newMessageId === message.id ? 'animate-fadeIn' : ''}
              `}
            >
              <p>{message.text}</p>
              <span className="text-xs text-gray-300 float-right mt-1">{message.time}</span>
            </div>
          </div>
        ))}

        {/* Typing Indicator
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#3d4248] text-white p-3 rounded-lg max-w-sm animate-pulse">
              <p>Typing...</p>
            </div>
          </div>
        )} */}

        {/* Scroll to bottom ref */}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput sendMessage={sendMessage} inputValue={inputValue} setInputValue={setInputValue} />
    </section>
  );
}