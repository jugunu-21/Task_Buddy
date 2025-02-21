import * as React from "react";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { CardWithForm } from "./add-todos-form";
import { Updatecard } from "./update-todos";
import { ITask, removeBulkTasks, UpdateIntialTasks, updateTask } from "@/lib/redux/features/taskSlice";
import FiltersAndSearch from "../FiltersAndSearch";
import { Card } from "../ui/card";
import { TodosListTable } from "./todoslist-table";
import { TodoBoardTable } from "./todoboard-table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { getAllTasks } from "@/lib/db/tasks";

interface TodoContainerProps {
    viewMode: 'list' | 'board';
}

export function TodoContainer({ viewMode }: TodoContainerProps) {
    const data = useSelector((state: RootState) => state.tasks.tasks)
    const userId = useSelector((state: RootState) => state.tasks.userIdFir)
    const [addOpen, setAddOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask>();
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        todo: true,
        inProgress: false,
        completed: false
    });

    const dispatch = useDispatch();

    const handleTaskSelect = (taskId: string) => {
        setSelectedTasks(prev => {
            if (prev.includes(taskId)) {
                return prev.filter(id => id !== taskId);
            }
            return [...prev, taskId];
        });
    };

    const handleBulkDelete = () => {
        if (selectedTasks.length > 0) {
            dispatch(removeBulkTasks(selectedTasks));
            setSelectedTasks([]);
        }
    };

    const handleBulkStatusUpdate = (newStatus: string) => {
        if (selectedTasks.length > 0) {
            selectedTasks.forEach(taskId => {
                dispatch(updateTask({
                    id: taskId,
                    status: newStatus
                }));
            });
            setSelectedTasks([]);
        }
    };

    const toggleSection = (section: 'todo' | 'inProgress' | 'completed') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
    const [selectedDueDate, setSelectedDueDate] = React.useState<string>("all");
    const filteredData = React.useMemo(() => {
        return data.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase());
            const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
            const matchesDueDate = selectedDueDate === "all" || (() => {
                const taskDate = new Date(task.dueDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);               
                const weekEnd = new Date(today);
                weekEnd.setDate(weekEnd.getDate() + 7);
                
                const monthEnd = new Date(today);
                monthEnd.setMonth(monthEnd.getMonth() + 1);
                
                switch(selectedDueDate) {
                    case "today":
                        return taskDate >= today && taskDate < tomorrow;
                    case "tomorrow":
                        return taskDate >= tomorrow && taskDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
                    case "week":
                        return taskDate >= today && taskDate <= weekEnd;
                    case "month":
                        return taskDate >= today && taskDate <= monthEnd;
                    default:
                        return true;
                }
            })();
            
            return matchesSearch && matchesCategory && matchesDueDate;
        });
    }, [data, searchValue, selectedCategory, selectedDueDate]);
    const handleUpdateTask = (task: ITask) => {
        setSelectedTask(task);
        setUpdateOpen(true);
    };
    if (!data) return null;
   useEffect(() => {
    console.log("userid",userId)
        getAllTasks(userId).then((tasks) => {
            console.log("tasks ssss",tasks)
            const tasksWithSerializedDates = tasks.map(task => ({
                ...task,
                dueDate: task.dueDate.toISOString()
            }));

            dispatch(UpdateIntialTasks(tasksWithSerializedDates));
        }).catch((error) => {
            console.error("Error fetching tasks:", error);
        });
    }, [dispatch, userId]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timerId);
    }, [setLoading]);
    return (
        <Card className="h-full">
            <FiltersAndSearch 
                VALUESEARCH={searchValue}
                ONCHANGESEARCH={(event) => setSearchValue(event.target.value)}
                ONCLICKBUTTON={() => setAddOpen(true)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDueDate={selectedDueDate}
                setSelectedDueDate={setSelectedDueDate}
            />
            <div className="w-full h-full">
                {viewMode === 'list' ? (
                    <TodosListTable 
                    dispatch={dispatch}
                    handleUpdateTask={handleUpdateTask}
                        data={filteredData}
                        
                        selectedTasks={selectedTasks}
                      
                        handleTaskSelect={handleTaskSelect}
                        handleBulkDelete={handleBulkDelete}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                        loading={loading}
                        setLoading={setLoading}
                        setAddOpen={setAddOpen}
                    />
                ) : (
                    <TodoBoardTable 
                    dispatch={dispatch}
                    handleUpdateTask={handleUpdateTask}
                        data={filteredData}
                      
                      
                        selectedTasks={selectedTasks}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        setAddOpen={setAddOpen}
                    />
                )}

                <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle></AlertDialogTitle>
                            <CardWithForm
                            dispatch={dispatch}
                                sheetOpen={addOpen}
                                setSheetOpen={setAddOpen}
                            />
                        </AlertDialogHeader>
                        <AlertDialogFooter />
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={updateOpen} onOpenChange={setUpdateOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Update Task</AlertDialogTitle>
                            {selectedTask && (
                                <Updatecard
                                    todos={selectedTask}
                                   
                                    setSheetOpen={setUpdateOpen}
                                />
                            )}
                        </AlertDialogHeader>
                        <AlertDialogFooter />
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
}