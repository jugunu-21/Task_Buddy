import * as React from "react";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { CardWithForm } from "./add-todos-form";
import { Updatecard } from "./update-todos";
import { ITask, removeBulkTasks, updateTask } from "@/lib/redux/features/taskSlice";
import FiltersAndSearch from "../FiltersAndSearch";
import { Card } from "../ui/card";
import { TodosListTable } from "./todoslist-table";
import { TodoBoardTable } from "./todoboard-table";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface TodoContainerProps {
    viewMode: 'list' | 'board';
}

export function TodoContainer({ viewMode }: TodoContainerProps) {
    const data = useSelector((state: RootState) => state.tasks.tasks)
    const [addOpen, setAddOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask>();
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [toDo, setToDo] = useState<ITask>();
    const [expandedSections, setExpandedSections] = useState({
        todo: true,
        inProgress: true,
        completed: true
    });

    const handleUpdateTask = (task: ITask) => {
        setSelectedTask(task);
        setUpdateOpen(true);
    };

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

    if (!data) return null;
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
                    setAddOpen={setAddOpen}
                    setLoading={setLoading}
                        data={filteredData}
                        selectedTasks={selectedTasks}
                        handleTaskSelect={handleTaskSelect}
                        handleBulkDelete={handleBulkDelete}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        expandedSections={expandedSections}
                        toggleSection={toggleSection}
                        loading={loading}
                        setUpdateOpen={setUpdateOpen}
                        setToDo={setToDo}
                    />
                ) : (
                    <TodoBoardTable 
                        data={filteredData}
                        setUpdateOpen={setUpdateOpen}
                        setToDo={setToDo}
                        selectedTasks={selectedTasks}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        setAddOpen={setAddOpen}
                    />
                )}

                <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            {/* <AlertDialogTitle>Add New Task</AlertDialogTitle> */}
                            <AlertDialogDescription>
                                <CardWithForm
                                    sheetOpen={addOpen}
                                    setSheetOpen={setAddOpen}
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter />
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={updateOpen} onOpenChange={setUpdateOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Update Task</AlertDialogTitle>
                            <AlertDialogDescription>
                                {selectedTask && (
                                    <Updatecard
                                        todos={selectedTask}
                                        sheetOpen={updateOpen}
                                        setSheetOpen={setUpdateOpen}
                                    />
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter />
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    );
}