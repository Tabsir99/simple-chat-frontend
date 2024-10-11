'use client'

import { UserX, UserCheck, Users, Bell } from "lucide-react";
import { useEffect, useState } from "react";

interface Activities {
  id: string;
  activity_type:
    | "new_message"
    | "friend_request_rejected"
    | "friend_request_accepted"
    | "group_message";
  created_at: Date;
  description: string;
}
export default function RecentActivity() {
  const [activities, setActivities] = useState<Array<Activities>>([]);

  // Fetch recent activities from the API on component mount
  // useEffect(() => {
  //   async function fetchActivities() {
  //     const response = await fetch("/api/recent-activities"); // Adjust to your API endpoint
  //     const data = await response.json();
  //     setActivities(data);
  //   }
  //   fetchActivities();
  // }, []);

  // Define icons for different activity types

  const activityIcons = {
    friend_request_accepted: (
      <UserCheck className="text-blue-400 w-6 h-6 mr-4" />
    ),
    friend_request_rejected: <UserX className="text-red-400 w-6 h-6 mr-4" />,
    group_message: <Users className="text-purple-400 w-6 h-6 mr-4" />,
    new_message: <Bell className="text-yellow-400 w-6 h-6 mr-4" />,
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl p-8 mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">
        Recent Activity
      </h3>
      <ul className="space-y-4 text-gray-300">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {activityIcons[activity.activity_type]}
              <div>
                <span className="block text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
                {activity.description}
              </div>
            </li>
          ))
        ) : (
          <p>
            No recent activity. Start interacting to see your activity here!
          </p>
        )}
      </ul>
    </div>
  );
}
