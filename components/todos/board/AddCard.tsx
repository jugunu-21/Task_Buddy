import React, { Dispatch, SetStateAction, useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { ITask, addTaskAsync } from "@/lib/redux/features/taskSlice";
import { ITaskStatus, ITaskCategory } from "@/type/todo";
import { AppDispatch } from "@/lib/redux/store";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

type AddCardProps = {
  column: ITaskStatus;
  setCards: Dispatch<SetStateAction<ITask[]>>;
};

export const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) {
      toast.error("Title is required");
      return;
    }

    const newTask = {
      status: column,
      title: text.trim(),
      description: "",
      category: "work" as ITaskCategory,
      dueDate: new Date().toISOString(),
    };

    dispatch(addTaskAsync(newTask));
    setCards((prev) => [...prev, newTask as ITask]);
    setText("");
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};