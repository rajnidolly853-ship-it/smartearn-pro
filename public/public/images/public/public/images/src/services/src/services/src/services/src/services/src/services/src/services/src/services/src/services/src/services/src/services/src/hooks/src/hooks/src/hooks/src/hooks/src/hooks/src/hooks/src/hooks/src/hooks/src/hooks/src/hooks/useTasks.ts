import { useState, useEffect, useCallback } from 'react';
import { Task, TaskSubmission } from '../types/task.types';
import { addPendingCoins } from '../services/wallet.service';
import { performFraudCheck } from '../services/fraudPrevention.service';
import { useNotification } from '../context/NotificationContext';

// Mock tasks data (in production, this would come from Firebase or an API)
const MOCK_TASKS: Task[] = [
  {
    id: 'task_1',
    title: 'Download & Open App',
    description: 'Download the app and open it for 30 seconds',
    reward: 50,
    icon: '📱',
    category: 'app_install',
    url: 'https://play.google.com/store/apps',
    difficulty: 'easy',
    timeToComplete: '2 mins',
    instructions: [
      'Click the button below to open Play Store',
      'Download the app',
      'Open the app and stay for 30 seconds',
      'Come back and claim your reward'
    ]
  },
  {
    id: 'task_2',
    title: 'Complete Survey',
    description: 'Answer a short 5-question survey',
    reward: 30,
    icon: '📝',
    category: 'survey',
    url: 'https://example.com/survey',
    difficulty: 'easy',
    timeToComplete: '3 mins',
    instructions: [
      'Click to open the survey',
      'Answer all questions honestly',
      'Submit the survey',
      'Return here to claim reward'
    ]
  },
  {
    id: 'task_3',
    title: 'Sign Up & Verify',
    description: 'Create an account and verify your email',
    reward: 100,
    icon: '✉️',
    category: 'register',
    url: 'https://example.com/signup',
    difficulty: 'medium',
    timeToComplete: '5 mins',
    instructions: [
      'Click to visit the website',
      'Create a new account',
      'Verify your email address',
      'Return and submit proof'
    ],
    requiredProof: true
  },
  {
    id: 'task_4',
    title: 'Play Game Level 5',
    description: 'Install game and reach level 5',
    reward: 200,
    icon: '🎮',
    category: 'game',
    url: 'https://play.google.com/store/apps',
    isFeatured: true,
    difficulty: 'hard',
    timeToComplete: '30 mins',
    instructions: [
      'Download the game from Play Store',
      'Complete the tutorial',
      'Play until you reach Level 5',
      'Take a screenshot and submit'
    ],
    requiredProof: true
  }
];

interface UseTasksReturn {
  tasks: Task[];
  featuredTasks: Task[];
  completedTasks: string[];
  isLoading: boolean;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

export const useTasks = (userId: string | undefined): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { showNotification } = useNotification();

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [userId]);

  // Load tasks (mock implementation)
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from Firebase/API
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network
      setTasks(MOCK_TASKS);

      // Load completed tasks from localStorage
      if (userId) {
        const completed = localStorage.getItem(`completed_tasks_${userId}`);
        if (completed) {
          setCompletedTasks(JSON.parse(completed));
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get featured tasks
  const featuredTasks = tasks.filter((task) => task.isFeatured);

  // Start a task (open external URL)
  const startTask = useCallback((taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      // Track task start time
      localStorage.setItem(`task_start_${taskId}`, Date.now().toString());
      
      // Open task URL
      window.open(task.url, '_blank', 'noopener,noreferrer');
      
      showNotification('Task started! Complete it to earn rewards.', 'info');
    }
  }, [tasks, showNotification]);

  // Complete a task
  const completeTask = useCallback(async (taskId: string): Promise<boolean> => {
    if (!userId) {
      showNotification('Please login to complete tasks', 'error');
      return false;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      showNotification('Task not found', 'error');
      return false;
    }

    // Check if already completed
    if (completedTasks.includes(taskId)) {
      showNotification('Task already completed', 'info');
      return false;
    }

    // Check minimum time spent
    const startTime = localStorage.getItem(`task_start_${taskId}`);
    if (startTime) {
      const elapsed = Date.now() - parseInt(startTime);
      const minTime = 10 * 1000; // 10 seconds minimum

      if (elapsed < minTime) {
        showNotification('Please complete the task first', 'error');
        return false;
      }
    }

    // Fraud check
    const fraudCheck = await performFraudCheck(userId, 'complete_task');
    if (!fraudCheck.allowed) {
      showNotification(fraudCheck.reason || 'Action blocked', 'error');
      return false;
    }

    try {
      // Add pending coins (will be approved after verification)
      const success = await addPendingCoins(
        userId,
        task.reward,
        'task_offer',
        `Task completed: ${task.title}`
      );

      if (success) {
        // Mark as completed
        const newCompleted = [...completedTasks, taskId];
        setCompletedTasks(newCompleted);
        localStorage.setItem(`completed_tasks_${userId}`, JSON.stringify(newCompleted));

        // Clean up start time
        localStorage.removeItem(`task_start_${taskId}`);

        showNotification(
          `🎉 +${task.reward} coins pending! Will be approved within 24 hours.`,
          'success'
        );
        return true;
      } else {
        showNotification('Failed to submit task', 'error');
        return false;
      }
    } catch (error) {
      showNotification('Something went wrong', 'error');
      return false;
    }
  }, [userId, tasks, completedTasks, showNotification]);

  // Refresh tasks
  const refresh = useCallback(async (): Promise<void> => {
    await loadTasks();
  }, [userId]);

  // Get task by ID
  const getTaskById = useCallback((id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  }, [tasks]);

  return {
    tasks,
    featuredTasks,
    completedTasks,
    isLoading,
    startTask,
    completeTask,
    refresh,
    getTaskById
  };
};

export default useTasks;
