import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllTasks, createTask, updateTaskdb, deleteTask, updateStatusdb,} from '../../db/tasks';
import type { Task as PrismaTask } from '@prisma/client';
import { IAddTask } from '@/type/todo';
export interface ITask extends Omit<PrismaTask, 'dueDate'> {
  // Task fields from schema:
  // - id: string
  // - title: string
  // - description: string
  // - category: string
  // - completed: boolean
  // - userId: string
  dueDate: string;
}
interface ITaskState {
  userIdFir:string;
  loading: boolean;
  error: string | null;
  tasks: ITask[];
  filteredTasks: ITask[];
  filters: {
    status: string[];
    category: string[];
  };
}
// Load tasks from localStorage or use empty array
export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string) => {
    const tasks = await getAllTasks(userId);
    return tasks.map(task => ({
      ...task,
      dueDate: task.dueDate.toISOString()
    }));
  }
);
export const fetchTasksFromDBAsync = createAsyncThunk(
  'tasks/fetchTasksFromDB',
  async (userId: string, { dispatch }) => {
    try {
      const tasks = await getAllTasks(userId);
      const formattedTasks = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString()
      }));
      return formattedTasks;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch tasks from DB');
    }
  }
);

const initialState: ITaskState = {
  userIdFir:"",
  loading: false,
  error: null,
  tasks: [],
  filteredTasks: [],
  filters: {
    status: [],
    category: []
  }
};


  
export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData: Omit<IAddTask, 'id' | 'userId'>, { getState }) => {
    const state = getState() as { tasks: ITaskState };
    const taskWithUserId = { 
      ...taskData, 
      userId: state.tasks.userIdFir,
      dueDate: new Date(taskData.dueDate)
    };
    const task = await createTask(taskWithUserId);
    return {
      ...task,
      dueDate: task.dueDate.toISOString()
    };
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: Partial<PrismaTask> }) => {
    const task = await updateTaskdb(id, data);
    return {
      ...task,
      dueDate: task.dueDate.toISOString()
    };
  }
);

export const updateBulkTasksAsync = createAsyncThunk(
  'tasks/updateBulkTasks',
  async ({ ids, status }: { ids: string[]; status: string }) => {
    const updatePromises = ids.map(id => updateStatusdb(id, status));
    const tasks = await Promise.all(updatePromises);
    return tasks.map(task => ({
      ...task,
      dueDate: task.dueDate.toISOString()
    }));
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    await deleteTask(id);
    return id;
  }
);

export const deleteBulkTasksAsync = createAsyncThunk(
  'tasks/deleteBulkTasks',
  async (ids: string[]) => {
    await Promise.all(ids.map(id => deleteTask(id)));
    return ids;
  }
);

// export const toggleTaskCompleteAsync = async (id: string, completed: boolean) => {
//   try {
//     const task = await toggleTaskCompletion(id, completed);
//     return task;
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : 'Failed to toggle task completion');
//   }
// };
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userIdFir = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        category: []
      };
      state.filteredTasks = state.tasks;
    },
    setTasksFromDB: (state, action: PayloadAction<(Omit<PrismaTask, 'dueDate'> & { dueDate: string })[]>) => {
      state.tasks = action.payload;
      state.filteredTasks = state.tasks;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        const newState = {
          ...state,
          loading: false,
          error: null,
          tasks: action.payload,
          filteredTasks: action.payload
        };
        Object.assign(state, newState);
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.tasks = [];
        state.filteredTasks = [];
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Add Task
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks = [...state.tasks, action.payload];
        state.filteredTasks = [...state.filteredTasks, action.payload];
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add task';
      })
      // Update Task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          const filteredIndex = state.filteredTasks.findIndex(task => task.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredTasks[filteredIndex] = action.payload;
          }
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Update Bulk Tasks
      .addCase(updateBulkTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBulkTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        action.payload.forEach(updatedTask => {
          const taskIndex = state.tasks.findIndex(task => task.id === updatedTask.id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = updatedTask;
          }
          const filteredIndex = state.filteredTasks.findIndex(task => task.id === updatedTask.id);
          if (filteredIndex !== -1) {
            state.filteredTasks[filteredIndex] = updatedTask;
          }
        });
      })
      .addCase(updateBulkTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update tasks';
      })
      // Delete Task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.filteredTasks = state.filteredTasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      })
      // Delete Bulk Tasks
      .addCase(deleteBulkTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBulkTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks = state.tasks.filter(task => !action.payload.includes(task.id));
        state.filteredTasks = state.filteredTasks.filter(task => !action.payload.includes(task.id));
      })
      .addCase(deleteBulkTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete tasks';
      });
  }
    // toggleTaskComplete: (state, action: PayloadAction<string>) => {
    //   const task = state.tasks.find(task => task.id === action.payload);
    //   if (task) {
    //     task.completed = !task.completed;

    //   }
    // },
    // setFilters: (state, action: PayloadAction<{
    //   status?: string[];
    //   category?: string[];
    // }>) => {
    //   state.filters = { ...state.filters, ...action.payload };
    //   state.filteredTasks = state.tasks.filter(task => {
    //     const statusMatch = state.filters.status.length === 0 || 
    //       state.filters.status.includes(task.completed ? 'completed' : 'todo');
    //     const categoryMatch = state.filters.category.length === 0 || 
    //       state.filters.category.includes(task.category);
    //     const priorityMatch = true; // Removed priority filter since it's no longer in schema
    //     return statusMatch && categoryMatch && priorityMatch;
    //   });
    // },

  //   filterTask: (state, action: PayloadAction<string[]>) => {
  //     const selectedFilters = action.payload;
  //     if (selectedFilters.length === 0 || selectedFilters.includes('all')) {
  //       state.filteredTasks = state.tasks;
  //       return;
  //     }
  //     state.filteredTasks = state.tasks.filter((task) => {
  //       const taskStatus = task.completed ? 'completed' : 'todo';
  //       return selectedFilters.includes(taskStatus);
  //     });
  // },

});
export const { setUserId ,setTasksFromDB} = taskSlice.actions;
export default taskSlice.reducer;