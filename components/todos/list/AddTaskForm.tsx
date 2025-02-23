import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { DatePicker } from "../data-picker";
import { TableCell, TableRow } from "../../ui/table";
import { BsArrowReturnLeft } from "react-icons/bs";
import { addTaskAsync } from "@/lib/redux/features/taskSlice";
import { ITaskCategory, ITaskStatus } from '@/type/todo';
import toast from 'react-hot-toast';

interface AddTaskFormProps {
    dispatch: any;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ dispatch }) => {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<string>();
    const [dueDate, setDueDate] = useState<Date>();
    const [category, setCategory] = useState<string>();

    const handleSubmit = () => {
        if (!title || !status || !dueDate || !category) {
            toast.error("All fields are required");
            return;
        }

        const formData = {
            title,
            status: status as ITaskStatus,
            dueDate: dueDate.toISOString(),
            category: category as ITaskCategory,
            description: ""
        };

        dispatch(addTaskAsync(formData));
        resetForm();
    };

    const resetForm = () => {
        setTitle("");
        setStatus(undefined);
        setDueDate(undefined);
        setCategory(undefined);
        setShowForm(false);
    };

    return (
        <>
            <TableRow className="bg-muted/90">
                <TableCell colSpan={5}>
                    <Button 
                        variant="ghost" 
                        onClick={() => setShowForm(true)}
                        className="text-xs"
                        suppressHydrationWarning
                    >
                        Add Task
                    </Button>
                </TableCell>
            </TableRow>
            {showForm && (
                <TableRow className="bg-muted/90">
                    <TableCell colSpan={5} className='w-full'>
                        <div className="flex items-center justify-between px-20">
                            <div className='flex-col gap-4'>
                                <Input
                                    placeholder="Task Title"
                                    className="w-full border-none shadow-none text-xs"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className='flex-row mt-2'>
                                    <Button 
                                        variant="default" 
                                        size="sm" 
                                        onClick={handleSubmit}
                                        className='bg-[#7B1984] text-white rounded-3xl hover:bg-[#762b7d] focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200'
                                    >
                                        ADD <BsArrowReturnLeft />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={resetForm}
                                    >
                                        CANCEL
                                    </Button>
                                </div>
                            </div>

                            <div className="w-[150px]">
                                <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-10 aspect-square rounded-full">
                                    <SelectValue placeholder="+" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TO-DO">To Do</SelectItem>
                                    <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-10 aspect-square rounded-full">
                                    <SelectValue placeholder="+" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="work">Work</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};