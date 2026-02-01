import React from 'react';
import MainLayout from '../layouts/MainLayout';
import TaskCard from '../components/earning/TaskCard';
import BalanceDisplay from '../components/wallet/BalanceDisplay';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const TasksScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { tasks, completedTasks, isLoading, startTask } = useTasks(userProfile?.uid);

  return (
    <MainLayout headerTitle="Offerwall" headerRight={<BalanceDisplay />}>
      <div className="p-4 pb-24">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Available Tasks</h2>
          <p className="text-xs text-gray-400">Complete offers to earn huge rewards</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-10">
            <Loader text="Loading offers..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tasks.length === 0 && (
          <EmptyState 
            title="No Tasks Available" 
            description="Check back later for new offers."
          />
        )}

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task}
              onStart={startTask}
              isCompleted={completedTasks.includes(task.id)}
            />
          ))}
        </div>

        {/* Footer Note */}
        {!isLoading && tasks.length > 0 && (
          <p className="text-center text-[10px] text-gray-600 mt-8">
            Tasks are verified within 24 hours. Fraudulent completions will lead to a ban.
          </p>
        )}

      </div>
    </MainLayout>
  );
};

export default TasksScreen;
