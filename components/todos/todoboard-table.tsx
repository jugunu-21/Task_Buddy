import * as React from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ITask, removeTask } from "@/lib/redux/features/taskSlice";

interface TodoBoardTableProps {
    data: ITask[];
    selectedTasks: string[];
    handleBulkStatusUpdate: (status: string) => void;
    handleUpdateTask: (task: ITask) => void;
    dispatch:any
}

export function TodoBoardTable({ 
    data,
    selectedTasks,
    handleBulkStatusUpdate,
    handleUpdateTask,
    dispatch
}: TodoBoardTableProps& { setAddOpen: (open: boolean) => void }) {




    return(
      
              <>  
                            
                <div className="mt-6 grid grid-cols-3 gap-6">
                    {/* Todo Section */}
                    <div className=" rounded-lg p-4 bg-muted/90">
                        <div className="flex items-center justify-between mb-4 bg-[#FAC3FF] p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">To Do</h3>
                               
                            </div>
                        </div>
                        <div className="space-y-3">
                            {data
                                .filter(task => task.status === "TO-DO")
                                .map((task) => (
                                    <Card key={task.id} className="bg-white">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 ">
                                                    <div className="font-medium">{task.title}</div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white rounded-md shadow-md border border-gray-200 w-[120px]">
                                                        <DropdownMenuItem onClick={() => 
                                                           handleUpdateTask(task)
                                                        } className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => dispatch(removeTask(task.id))} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                            <div className="mt-2  ">
                                                
                                       {task.category}

                                            </div>
                                            <div className="mt-2 ">
                                                
                                                {task.dueDate}
                                                
                                                     </div></div> 
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>

                    {/* In Progress Section */}
                    <div className=" rounded-lg p-4 bg-muted/90">
                        <div className="flex items-center justify-between mb-4  bg-[#85D9F1] p-2 rounded-xl">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">In Progress</h3>
                                
                            </div>
                        </div>
                        <div className="space-y-3">
                            {data
                                .filter(task => task.status === "IN-PROGRESS")
                                .map((task) => (
                                    <Card key={task.id} className="bg-white">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium">{task.title}</div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => dispatch(removeTask(task.id))}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleUpdateTask(task)}>
                                                            Update
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <div className="mt-2">
                                                    {task.category}
                                                </div>
                                                <div className="mt-2">
                                                    {task.dueDate}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>

                    {/* Completed Section */}
                    <div className=" rounded-lg p-4 bg-muted/90">
                        <div className="flex items-center justify-between mb-4 bg-[#CEFFCC] p-2 rounded-xl">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Completed</h3>
                                
                            </div>
                        </div>
                        <div className="space-y-3">
                            {data
                                .filter(task => task.status === "COMPLETED")
                                .map((task) => (
                                    <Card key={task.id} className="bg-white">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium">{task.title}</div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => dispatch(removeTask(task.id))}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleUpdateTask(task)}>
                                                            Update
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <div className="mt-2">
                                                    {task.category}
                                                </div>
                                                <div className="mt-2">
                                                    {task.dueDate}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedTasks.length > 0 && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black p-4 rounded-lg shadow-lg border flex items-center gap-4 z-50">
                        <span className="text-sm font-medium text-white">{selectedTasks.length} task(s) selected</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const menu = e.currentTarget.nextElementSibling;
                                        if (menu) {
                                            menu.classList.toggle('hidden');
                                        }
                                    }}
                                >
                                    Change Status
                                </Button>
                                <div className="hidden absolute left-0 bottom-full mb-1 w-40 bg-black border rounded-md shadow-lg z-50">
                                    <div className="py-1">
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                                            onClick={() => handleBulkStatusUpdate("TO-DO")}
                                        >
                                            Mark as Todo
                                        </button>
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                                            onClick={() => handleBulkStatusUpdate("IN-PROGRESS")}
                                        >
                                            Mark as In Progress
                                        </button>
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                                            onClick={() => handleBulkStatusUpdate("COMPLETED")}
                                        >
                                            Mark as Completed
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* <Button variant="danger" onClick={handleBulkDelete}>
                                Delete
                            </Button> */}
                        </div>
                    </div>
                )}
          </>
    )
}