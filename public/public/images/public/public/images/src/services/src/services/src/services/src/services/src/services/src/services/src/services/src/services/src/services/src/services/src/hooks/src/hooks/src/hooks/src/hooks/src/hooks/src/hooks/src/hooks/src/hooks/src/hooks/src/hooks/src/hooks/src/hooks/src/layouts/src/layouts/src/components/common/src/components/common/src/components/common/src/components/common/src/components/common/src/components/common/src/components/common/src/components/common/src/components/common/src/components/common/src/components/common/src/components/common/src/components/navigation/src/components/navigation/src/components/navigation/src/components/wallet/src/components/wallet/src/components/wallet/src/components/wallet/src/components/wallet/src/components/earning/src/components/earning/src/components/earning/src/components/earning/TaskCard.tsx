import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Task } from '../../types/task.types';

interface TaskCardProps {
  task: Task;
  onStart: (id: string) => void;
  isCompleted?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStart, isCompleted }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-dark-800 border border-white/5 rounded-2xl p-4 flex items-center gap-4
        ${isCompleted ? 'opacity-60 grayscale' : 'hover:border-neon-500/30'}
      `}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
        {task.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-white truncate">{task.title}</h4>
          {task.isFeatured && (
            <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full uppercase font-bold">
              Hot
            </span>
          )}
        </div>
        
        <p className="text-xs text-gray-400 truncate">{task.description}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="info">{task.difficulty}</Badge>
          <span className="text-[10px] text-gray-500">{task.timeToComplete}</span>
        </div>
      </div>

      {/* Action */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 text-neon-400 font-bold">
          <span>+{task.reward}</span>
          <span className="text-xs">🪙</span>
        </div>
        
        <Button 
          variant={isCompleted ? 'secondary' : 'primary'} 
          size="sm"
          disabled={isCompleted}
          onClick={() => onStart(task.id)}
          className="min-w-[80px]"
        >
          {isCompleted ? 'Done' : 'Start'}
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
