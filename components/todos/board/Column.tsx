import React, { Dispatch, SetStateAction, useState, DragEvent } from "react";
import { useDispatch } from "react-redux";
import { ITask, updateTaskAsync } from "@/lib/redux/features/taskSlice";
import { ITaskStatus } from "@/type/todo";
import { AppDispatch } from "@/lib/redux/store";
import { Card } from "./Card";
import { DropIndicator } from "./DropIndicator";
// import { DropIndicator } from "./DropIndicator";


type ColumnProps = {
  title: string;
  headingColor: string;
  cards: ITask[];
  column: ITaskStatus;
  setCards: Dispatch<SetStateAction<ITask[]>>;
  handleUpdateTask: (task: ITask) => void;
};

export const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  handleUpdateTask
}: ColumnProps) => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDragStart = (e: DragEvent, card: ITask) => {
    e.dataTransfer.setData("cardId", card.id);
  };

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
      
      dispatch(updateTaskAsync({
        id: cardId,
        data: { status: column }
      }));

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
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => (
          <Card 
            key={c.id} 
            task={c} 
            handleDragStart={handleDragStart} 
            handleUpdateTask={handleUpdateTask} 
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};