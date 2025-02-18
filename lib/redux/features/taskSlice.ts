import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllTasks, createTask, updateTaskdb, deleteTask,} from '../../db/tasks';
import type { Task as PrismaTask } from '@prisma/client';
export interface ITask extends PrismaTask {
  // Task fields from schema:
  // - id: string
  // - title: string
  // - description: string
  // - category: string
  // - dueDate: DateTime
  // - completed: boolean
  // - userId: string
}
interface ITaskState {
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
export const fetchTasksAsync = async(userId:string)=>{
  const tasks = await getAllTasks(userId);
  return tasks;
} 

const initialState: ITaskState = {
  loading: false,
  error: null,
  tasks: [],
  filteredTasks: [],
  filters: {
    status: [],
    category: []
  }
};


  
export const addTaskAsync = async (taskData: Omit<PrismaTask, 'id'>) => {
  try {
    const task = await createTask(taskData);
    return task;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add task');
  }
};

export const updateTaskAsync = async (id: string, data: Partial<PrismaTask>) => {
  try {
    const task = await updateTaskdb(id, data);
    return task;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update task');
  }
};

export const updateBulkTasksAsync = async (ids: string[], data: Partial<PrismaTask>) => {
  try {
    const updatePromises = ids.map(id => updateTaskdb(id, data));
    const tasks = await Promise.all(updatePromises);
    return tasks;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update tasks');
  }
};

export const deleteTaskAsync = async (id: string) => {
  try {
    await deleteTask(id);
    return id;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete task');
  }
};

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
    UpdateIntialTasks: (state, action: PayloadAction<ITask[]>) => {
      state.loading = true;
      state.tasks = action.payload || [];
      state.filteredTasks = action.payload || [];
      state.loading = false;
    },
    addTask: (state: ITaskState, action: PayloadAction<Omit<ITask, 'id' | 'completed'|'userId'>>) => {
      const taskData = {
        ...action.payload,
        userId:"USERID",
      };
      addTaskAsync(taskData).then(newTask => {
        state.tasks.push(newTask);
        state.filteredTasks = state.tasks;
      });

    },
    updateTask: (state, action: PayloadAction<Partial<ITask> & { id: string }>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        updateTaskAsync(action.payload.id, action.payload).then(() => {
          state.tasks[index] = { ...state.tasks[index], ...action.payload };
          state.filteredTasks = state.tasks;
        });
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      deleteTaskAsync(action.payload).then(() => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.filteredTasks = state.tasks;
      }).catch(error => {
        state.error = error.message;
      });
    },
    removeBulkTasks: (state, action: PayloadAction<string[]>) => {
      Promise.all(action.payload.map(id => deleteTaskAsync(id)))
        .then(() => {
          state.tasks = state.tasks.filter(task => !action.payload.includes(task.id));
          state.filteredTasks = state.tasks;
        })
        .catch(error => {
          state.error = error.message;
        });
    },
    updateBulkTasks: (state, action: PayloadAction<{ ids: string[], data: Partial<ITask> }>) => {
      updateBulkTasksAsync(action.payload.ids, action.payload.data)
        .then((updatedTasks) => {
          updatedTasks.forEach(updatedTask => {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
              state.tasks[index] = { ...state.tasks[index], ...updatedTask };
            }
          });
          state.filteredTasks = state.tasks;
        })
        .catch(error => {
          state.error = error.message;
        });
    },
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
    clearFilters: (state) => {
      state.filters = {
        status: [],
        category: []
      };
      state.filteredTasks = state.tasks;
    },
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
}
});
export const {
  UpdateIntialTasks,
  addTask,
  updateTask,
  removeTask,
  removeBulkTasks,
  updateBulkTasks,
  clearFilters,
} = taskSlice.actions;
export default taskSlice.reducer;