import React, {
    Dispatch,
    SetStateAction,
    useState,
    DragEvent,
    FormEvent,
  } from "react";
  import { FiPlus,  } from "react-icons/fi";
  import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { ITask, updateTaskAsync, addTaskAsync, deleteTaskAsync } from "@/lib/redux/features/taskSlice";
import { ITaskStatus, ITaskCategory } from "@/type/todo";
import toast from "react-hot-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import {  CardContent } from "../ui/card";
import { MoreHorizontal } from "lucide-react";
interface TodoBoardTableProps {

  handleUpdateTask: (task: ITask) => void;

}

  export const CustomKanban = (
    { 
      handleUpdateTask,
  }: TodoBoardTableProps& { setAddOpen: (open: boolean) => void }
  ) => {

    return (
      <div className="h-screen w-full  text-neutral-50">
        <Board handleUpdateTask={handleUpdateTask} />
      </div>
    );
  };
  const Board = ({handleUpdateTask}:{handleUpdateTask:(task: ITask) => void}) => {
    const data = useSelector((state: RootState) => state.tasks.tasks);
  
    const [cards, setCards] = useState<ITask[]>(data || []);
  
    return (
      <div className="flex justify-center  h-full gap-3  p-12">
        <Column
          title="To Do"
          column="TO-DO"
          headingColor="bg-[#FAC3FF]"
          cards={cards}
          setCards={setCards}
    
          handleUpdateTask={handleUpdateTask}
        />
        <Column
          title="In Progress"
          column="IN-PROGRESS"
          headingColor="bg-[#85D9F1]"
          cards={cards}
          setCards={setCards}
     
          handleUpdateTask={handleUpdateTask}
        />
        <Column
          title="Completed"
          column="COMPLETED"
          headingColor="bg-[#CEFFCC]"
          cards={cards}
          setCards={setCards}

          handleUpdateTask={handleUpdateTask}
        />
        {/* <BurnBarrel setCards={setCards} dispatch={dispatch} /> */}
      </div>
    );
  };
  
  type ColumnProps = {
    title: string;
    headingColor: string;
    cards: ITask[];
    column: ITaskStatus;
    setCards: Dispatch<SetStateAction<ITask[]>>;

    handleUpdateTask: (task: ITask) => void;
  };
  
  const Column = ({
    title,
    headingColor,
    cards,
    column,
    setCards,

    handleUpdateTask
  }: ColumnProps) => {
    const [active, setActive] = useState(false);
  
    const handleDragStart = (e: DragEvent, card: ITask) => {
      e.dataTransfer.setData("cardId", card.id);
    };
    const dispatch = useDispatch<AppDispatch>();
    const handleDragEnd = (e: DragEvent) => {
      const cardId = e.dataTransfer.getData("cardId");
  
      setActive(false);
      clearHighlights();
  
      const indicators = getIndicators();
      const { element } = getNearestIndicator(e, indicators);
  
      const before = element.dataset.before || "-1";
  
      if (before !== cardId) {
        let copy = [...cards];
  
        let cardToTransfer = copy.find((c) => c.id === cardId);
        if (!cardToTransfer) return;
        // Update the task status in the database
        dispatch(updateTaskAsync({
          id: cardId,
          data: { status: column }
        }));
  
        // Update the local state
        cardToTransfer = { ...cardToTransfer, status: column };
        copy = copy.filter((c) => c.id !== cardId);
  
        const moveToBack = before === "-1";
  
        if (moveToBack) {
          copy.push(cardToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => el.id === before);
          if (insertAtIndex === -1) return;
  
          copy.splice(insertAtIndex, 0, cardToTransfer);
        }
  
        setCards(copy);
      }
    };
  
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      highlightIndicator(e);
  
      setActive(true);
    };
  
    const clearHighlights = (els?: HTMLElement[]) => {
      const indicators = els || getIndicators();
  
      indicators.forEach((i) => {
        i.style.opacity = "0";
      });
    };
  
    const highlightIndicator = (e: DragEvent) => {
      const indicators = getIndicators();
  
      clearHighlights(indicators);
  
      const el = getNearestIndicator(e, indicators);
  
      el.element.style.opacity = "1";
    };
  
    const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
      const DISTANCE_OFFSET = 50;
  
      const el = indicators.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
  
          const offset = e.clientY - (box.top + DISTANCE_OFFSET);
  
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        {
          offset: Number.NEGATIVE_INFINITY,
          element: indicators[indicators.length - 1],
        }
      );
  
      return el;
    };
  

    const getIndicators = () => {
      return Array.from(
        document.querySelectorAll(
          `[data-column="${column}"]`
        ) as unknown as HTMLElement[]
      );
    };
    const handleDragLeave = () => {
      clearHighlights();
      setActive(false);
    };
  
    const filteredCards = cards.filter((c) => c.status === column);
  
    return (
      <div className="w-1/3 bg-[#F1F1F1] p-4 rounded-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-medium ${headingColor} px-4 py-2 rounded-lg text-gray-800`}>{title}</h3>
          <span className="rounded text-sm text-neutral-400">
            {filteredCards.length}
          </span>
        </div>
        <div
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`h-full w-full transition-colors ${
            active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
        >
          {filteredCards.map((c) => (
        
           <Card key={c.id} task={c} handleDragStart={handleDragStart} handleUpdateTask={handleUpdateTask}  />
         
         
                                              
                                              ))}
          <DropIndicator beforeId={null} column={column} />
          <AddCard column={column} setCards={setCards} />
        </div>
      </div>
    );
  };
  
  type CardProps ={
  
    handleUpdateTask: (task: ITask) => void;
    task:ITask
    handleDragStart: (e: DragEvent, card: ITask) => void;
  };
  const Card = ({task, handleDragStart,handleUpdateTask }: CardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    return (
      <>
        <DropIndicator beforeId={task.id} column={task.status as ITaskStatus} />
        <motion.div
          layout
          layoutId={task.id}
          draggable="true"
          onDragStart={(e:any) => handleDragStart(e, task as ITask)}
          className="cursor-grab  border rounded-xl bg-white text-neutral-800 p-3 active:cursor-grabbing"
        >
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
                                                        <DropdownMenuItem onClick={() => dispatch(deleteTaskAsync(task.id))} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer">
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
                                    {/* </Card> */}
        </motion.div>
      </>
    );
  };
  
  type DropIndicatorProps = {
    beforeId: string | null;
    column: ITaskStatus;
  };
  
  const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
    return (
      <div
        data-before={beforeId || "-1"}
        data-column={column}
        className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
      />
    );
  };
  
 
  
  type AddCardProps = {
    column: ITaskStatus;
    setCards: Dispatch<SetStateAction<ITask[]>>;
   
  };
  
  const AddCard = ({ column, setCards, }: AddCardProps) => {
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
  
  // const DEFAULT_CARDS: CardType[] = [
  //   // BACKLOG
  //   { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  //   { title: "SOX compliance checklist", id: "2", column: "backlog" },
  //   { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  //   { title: "Document Notifications service", id: "4", column: "backlog" },
  //   // TODO
  //   {
  //     title: "Research DB options for new microservice",
  //     id: "5",
  //     column: "todo",
  //   },
  //   { title: "Postmortem for outage", id: "6", column: "todo" },
  //   { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
  
  //   // DOING
  //   {
  //     title: "Refactor context providers to use Zustand",
  //     id: "8",
  //     column: "doing",
  //   },
  //   { title: "Add logging to daily CRON", id: "9", column: "doing" },
  //   // DONE
  //   {
  //     title: "Set up DD dashboards for Lambda listener",
  //     id: "10",
  //     column: "done",
  //   },
  // ];