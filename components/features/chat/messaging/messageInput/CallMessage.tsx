import React from 'react';
import { Phone, Video, PhoneOff, Clock } from 'lucide-react';
import { CallInformation } from '@/types/chatTypes';

const formatDuration = (startTime: string | null, endTime: string | null) => {
  if (!startTime) return '';
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime) : new Date();
  const diff = Math.floor((end.getTime() - start) / 1000);
  
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const CallMessage = ({callInfo}: {callInfo: CallInformation}) => {
  const { callerId, isVideoCall, startTime, endTime, status } = callInfo;
  
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'ended': return 'text-gray-400';
      case 'missing': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Ongoing Call';
      case 'ended': return 'Call Ended';
      case 'missing': return 'Missed Call';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 max-w-sm w-full shadow-lg">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${status === 'connected' ? 'bg-green-500/10' : 'bg-gray-700'}`}>
          {isVideoCall ? (
            <Video className={`w-6 h-6 ${getStatusColor()}`} />
          ) : (
            <Phone className={`w-6 h-6 ${getStatusColor()}`} />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-gray-100 font-medium">{callerId}</h3>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {status !== 'missing' && (
          <div className="text-right">
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {formatDuration(startTime, endTime)}
              </span>
            </div>
          </div>
        )}
      </div>

      {status === 'connected' && (
        <button className="mt-3 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors">
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>
      )}
    </div>
  );
};

export default CallMessage;