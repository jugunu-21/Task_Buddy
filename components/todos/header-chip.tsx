import React from 'react';
import { motion } from "framer-motion";
interface ChipProps {
    text: string;
    selected: boolean;
    setSelected: () => void;
}

export const HeaderButton: React.FC<ChipProps> = ({ text, selected, setSelected }) => {
    return (
        <button
            onClick={setSelected}
            className={`${selected ? "text-white" : "text-slate-900 hover:text-slate-100 hover:bg-slate-600"} text-sm transition-colors px-2.5 py-0.5 rounded-md relative`}
        >
            <span className="relative z-10 py-2 text-sm font-semibold ">{text}</span>
            {selected && (
                <motion.span
                    layoutId={`pill-tab-${text}`}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute p-2 inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
                ></motion.span>
            )}
        </button>
    );
};
