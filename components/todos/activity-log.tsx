'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface Activity {
  id: string;
  action: string;
  changes: any;
  timestamp: string;
  userId: string;
}

interface ActivityLogProps {
  taskId: string;
}

export function ActivityLog({ taskId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}/activities`);
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchActivities();
    }
  }, [taskId]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'status_changed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatChanges = (changes: any) => {
    if (!changes) return 'No changes recorded';

    if (changes.oldStatus && changes.newStatus) {
      return `Status changed from ${changes.oldStatus} to ${changes.newStatus}`;
    }

    if (changes.before && changes.after) {
      const changedFields = Object.keys(changes.after).filter(
        key => changes.before[key] !== changes.after[key]
      );
      return `Updated fields: ${changedFields.join(', ')}`;
    }

    if (changes.newTask) {
      return 'Task created';
    }

    if (changes.deletedTask) {
      return 'Task deleted';
    }

    return JSON.stringify(changes);
  };

  if (loading) {
    return <div>Loading activity log...</div>;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-gray-500">No activities recorded yet</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-2 border-b last:border-0">
              <Badge className={getActionColor(activity.action)}>
                {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
              </Badge>
              <div className="flex-1">
                <p className="text-sm">{formatChanges(activity.changes)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}