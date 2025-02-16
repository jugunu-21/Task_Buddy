import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllTasks, createTask, updateTaskdb, deleteTask, toggleTaskCompletion } from '../../db/tasks';
import type { Task as PrismaTask } from '@prisma/client';

export interface Task extends Omit<PrismaTask, 'updatedAt'> {
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface TaskState {
  loading: boolean;
  error: string | null;
  tasks: Task[];
  filteredTasks: Task[];
  filters: {
    status: string[];
    category: string[];
    priority: string[];
  };
}

// Load tasks from localStorage or use empty array
const loadTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  }
  return [];
};

const initialState: TaskState = {
  loading: false,
  error: null,
  tasks: loadTasks(),
  filteredTasks: loadTasks(),
  filters: {
    status: [],
    category: [],
    priority: []
  }
};

// Helper function to save tasks to localStorage
const saveTasks = (tasks: Task[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string) => {
    const tasks = await getAllTasks(userId);
    return tasks;
  }
);

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData: Omit<PrismaTask, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const task = await createTask(taskData);
      return task;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add task');
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: Partial<PrismaTask> }, { rejectWithValue }) => {
    try {
      const task = await updateTaskdb(id, data);
      return task;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
);

export const toggleTaskCompleteAsync = createAsyncThunk(
  'tasks/toggleComplete',
  async ({ id, completed }: { id: string; completed: boolean }, { rejectWithValue }) => {
    try {
      const task = await toggleTaskCompletion(id, completed);
      return task;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle task completion');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state: TaskState, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'completed'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
        completed: false
      };
      state.tasks.push(newTask);
      state.filteredTasks = state.tasks;
      saveTasks(state.tasks);
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        state.filteredTasks = state.tasks;
        saveTasks(state.tasks);
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.filteredTasks = state.tasks;
      saveTasks(state.tasks);
    },
    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'todo';
        saveTasks(state.tasks);
      }
    },
    setFilters: (state, action: PayloadAction<{
      status?: string[];
      category?: string[];
      priority?: string[];
    }>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredTasks = state.tasks.filter(task => {
        const statusMatch = state.filters.status.length === 0 || 
          state.filters.status.includes(task.status);
        const categoryMatch = state.filters.category.length === 0 || 
          state.filters.category.includes(task.category);
        const priorityMatch = state.filters.priority.length === 0 || 
          state.filters.priority.includes(task.priority);
        return statusMatch && categoryMatch && priorityMatch;
      });
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        category: [],
        priority: []
      };
      state.filteredTasks = state.tasks;
    }
  },
 
});

export const {
  addTask,
  updateTask,
  removeTask,
  toggleTaskComplete,
  setFilters,
  clearFilters
} = taskSlice.actions;
export default taskSlice.reducer;