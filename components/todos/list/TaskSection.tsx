import React from 'react';
import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";
import { TableCell, TableRow } from "../../ui/table";
import { ITask } from "@/lib/redux/features/taskSlice";
import { flexRender } from "@tanstack/react-table";
import { AddTaskForm } from './AddTaskForm';

interface TaskSectionProps {
    title: string;
    status: string;
    bgColor: string;
    hoverColor: string;
    tasks: any[];
    columns: any[];
    expandedSections: {
        todo: boolean;
        inProgress: boolean;
        completed: boolean;
    };
    sectionKey: 'todo' | 'inProgress' | 'completed';
    toggleSection: (section: 'todo' | 'inProgress' | 'completed') => void;
    showAddForm?: boolean;
    dispatch?: any;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
    title,
    status,
    bgColor,
    hoverColor,
    tasks,
    columns,
    expandedSections,
    sectionKey,
    toggleSection,
    showAddForm = false,
    dispatch
}) => {
    const isExpanded = expandedSections[sectionKey];
    const filteredTasks = tasks.filter(row => row.original.status === status);

    return (
        <>
            <TableRow 
                className={`${bgColor} cursor-pointer rounded-t-xl hover:${hoverColor}`}
                onClick={() => toggleSection(sectionKey)}
            >
                <TableCell colSpan={columns.length} className="py-2 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{title}</h3>
                            ({filteredTasks.length})
                        </div>
                        <Button variant="link" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection(sectionKey); }}>
                            <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? '' : '-rotate-180'}`} />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {isExpanded && (
                <>
                    {showAddForm && <AddTaskForm dispatch={dispatch} />}
                    {filteredTasks.length === 0 ? (
                        <TableRow className="bg-muted/90">
                            <TableCell colSpan={columns.length} className="text-center py-4">
                                <div className="text-gray-500">No tasks in {title}</div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredTasks.map((row, index, array) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={`rounded-b-xl bg-muted/90 ${index === array.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {row.getVisibleCells().map((cell:any) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </>
            )}

            <TableRow className='h-4 border-none'>
                <TableCell colSpan={columns.length}></TableCell>
            </TableRow>
        </>
    );
};