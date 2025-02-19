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

    if (!data) return null;
    return (
        <Card className="h-full">
            <div className="w-full h-full">
                {viewMode === 'list' ? (
                    <TodosListTable 
                    setAddOpen={setAddOpen}
                    setLoading={setLoading}
                        data={data}
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
                        data={data}
                        setUpdateOpen={setUpdateOpen}
                        setToDo={setToDo}
                        selectedTasks={selectedTasks}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                    />
                )}

                <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add New Task</AlertDialogTitle>
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