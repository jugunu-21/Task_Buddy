import React, { DragEvent } from "react";
import { useDispatch } from "react-redux";
import { ITask, deleteTaskAsync } from "@/lib/redux/features/taskSlice";
import { ITaskStatus } from "@/type/todo";
import { AppDispatch } from "@/lib/redux/store";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { CardContent } from "../../ui/card";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropIndicator } from "./DropIndicator";


type CardProps = {
  handleUpdateTask: (task: ITask) => void;
  task: ITask;
  handleDragStart: (e: DragEvent, card: ITask) => void;
};

export const Card = ({ task, handleDragStart, handleUpdateTask }: CardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <DropIndicator beforeId={task.id} column={task.status as ITaskStatus} />
      <motion.div
        layout
        layoutId={task.id}
        draggable="true"
        onDragStart={(e: any) => handleDragStart(e, task as ITask)}
        className="cursor-grab border rounded-xl bg-white text-neutral-800 p-3 active:cursor-grabbing"
      >
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
              <DropdownMenuContent align="end" className="bg-white rounded-md shadow-md border border-gray-200 w-[120px]">
                <DropdownMenuItem
                  onClick={() => handleUpdateTask(task)}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pencil"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => dispatch(deleteTaskAsync(task.id))}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trash-2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between text-xs">
            <div className="mt-2">{task.category}</div>
            <div className="mt-2">{task.dueDate}</div>
          </div>
        </CardContent>
      </motion.div>
    </>
  );
};