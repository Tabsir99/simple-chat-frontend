'use client'

import { IMessage } from '@/types/chatTypes';
import React, { useState } from 'react';

// Existing REACTION_EMOJIS array
const REACTION_EMOJIS = [
  { emoji: "👍", label: "thumbs up" },
  { emoji: "❤️", label: "heart" },
  { emoji: "😊", label: "smile" },
  { emoji: "🎉", label: "celebration" },
  { emoji: "😂", label: "haha" },
  { emoji: "🤔", label: "thinking" },
  { emoji: "😠", label: "angry" },
];

// Mock message data
const mockMessage: IMessage = {
  messageId: "123",
  content: "Hello, world!",
  time: "2023-04-14T12:00:00Z",
  type: "incoming",
  reactions: [
    { emoji: "👍", users: ["user1", "user2"] },
    { emoji: "❤️", users: ["user3"] }
  ],
  senderName: "John Doe",
  profilePicture: "https://example.com/profile.jpg",
  readBy: [],
  status: "delivered"
};

// ReactionButton Component
export const ReactionButton: React.FC = () => {
  const [message, setMessage] = useState<IMessage>(mockMessage);
  const currentUser = { userId: 'me' };

  const toggleReaction = (selectedEmoji: string) => {
    setMessage((prevMessage) => {
      const updatedReactions = [...prevMessage.reactions];
      const existingReactionIndex = updatedReactions.findIndex(r => r.emoji === selectedEmoji);
      const userReactionIndex = updatedReactions.findIndex(r => r.users.includes(currentUser.userId));

      if (existingReactionIndex !== -1) {
        // Reaction exists
        if (updatedReactions[existingReactionIndex].users.includes(currentUser.userId)) {
          // User has already reacted with this emoji, remove the reaction
          updatedReactions[existingReactionIndex].users = updatedReactions[existingReactionIndex].users.filter(u => u !== currentUser.userId);
          if (updatedReactions[existingReactionIndex].users.length === 0) {
            // Remove the reaction entirely if no users left
            updatedReactions.splice(existingReactionIndex, 1);
          }
        } else {
          // User is adding this reaction
          if (userReactionIndex !== -1) {
            // Remove user's previous reaction
            updatedReactions[userReactionIndex].users = updatedReactions[userReactionIndex].users.filter(u => u !== currentUser.userId);
            if (updatedReactions[userReactionIndex].users.length === 0) {
              updatedReactions.splice(userReactionIndex, 1);
            }
          }
          // Add new reaction
          updatedReactions[existingReactionIndex].users.push(currentUser.userId);
        }
      } else {
        // Reaction doesn't exist, add new reaction
        if (userReactionIndex !== -1) {
          // Remove user's previous reaction
          updatedReactions[userReactionIndex].users = updatedReactions[userReactionIndex].users.filter(u => u !== currentUser.userId);
          if (updatedReactions[userReactionIndex].users.length === 0) {
            updatedReactions.splice(userReactionIndex, 1);
          }
        }
        // Add new reaction
        updatedReactions.push({ emoji: selectedEmoji, users: [currentUser.userId] });
      }

      return { ...prevMessage, reactions: updatedReactions };
    });
  };

  return (
    <div
      className={
        "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -z-10 group-hover:z-30 mt-2 transition-opacity duration-0 group-hover:duration-300 " +
        (message.type === "outgoing" ? "right-full" : " left-full")
      }
    >
      <div
        className="inline-flex bg-gray-800 border-2 border-gray-600 rounded-full p-1 shadow-lg"
      >
        {REACTION_EMOJIS.map((emoji) => (
          <button
            onClick={() => toggleReaction(emoji.emoji)}
            key={emoji.emoji}
            className="relative w-9 flex justify-center items-center h-9 rounded-full bg-none border-none cursor-pointer transition duration-200 active:scale-90 hover:scale-110 hover:-translate-y-1 hover:bg-gray-600"
            title={emoji.label}
          >
            <span className="text-[24px]">{emoji.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


export default ReactionButton