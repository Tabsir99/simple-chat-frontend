import React, { useState } from 'react';
import { XCircle, Image, Link, File } from 'lucide-react';
import useCustomSWR from '@/components/hooks/customSwr';
import { ecnf } from '@/utils/env';
import { Attachment } from '@/types/chatTypes';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold transition-colors border-b-2 border-transparent ${
      active ? 'text-blue-300 border-b-2 border-blue-300' : 'text-gray-400 hover:text-blue-200'
    }`}
  >
    {children}
  </button>
);

interface MediaItemProps {
  icon: React.ReactNode;
  name: string;
}

const MediaItem: React.FC<MediaItemProps> = ({ icon, name }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 border border-gray-700  cursor-pointer hover:bg-opacity-70">
    {icon}
    <span className="mt-2 text-sm text-gray-300 truncate w-full text-center">{name}</span>
  </div>
);

interface MediaModalProps {
  toggleMediaModal: () => void;
  selectedChatId: string
}


type TabType = 'media' | 'links' | 'files';

export default function MediaModal({ toggleMediaModal,selectedChatId }: MediaModalProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('media');

  const {} = useCustomSWR(`${ecnf.apiUrl}/chats/${selectedChatId}?all=`)

  const mediaItems: Attachment[] = [
    { type: 'image', url: 'Image1.jpg' },
    { type: 'image', url: 'Image2.png' },
  ];

  const filteredItems = mediaItems.filter((item) => {
    if (activeTab === 'media') return item.type === 'image' || item.type === "video";
    if (activeTab === 'links') return item.type === 'document'
    return false;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex h-screen items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl min-h-[90vh] overflow-hidden flex flex-col shadow-lg border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-blue-300">Shared Content</h2>
          <button onClick={toggleMediaModal} className="text-gray-400 hover:text-blue-300 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <div className="flex border-b border-gray-800">
          <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')}>
            Media
          </TabButton>
          <TabButton active={activeTab === 'links'} onClick={() => setActiveTab('links')}>
            Links
          </TabButton>
          <TabButton active={activeTab === 'files'} onClick={() => setActiveTab('files')}>
            Files
          </TabButton>
        </div>
        <div className="flex-grow overflow-y-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <MediaItem
                key={index}
                icon={
                  item.type === 'image' ? (
                    <Image size={48} className="text-blue-400" />
                  ) : (
                    <File size={48} className="text-blue-400" />
                  )
                }
                name={item.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}