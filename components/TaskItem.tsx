import { useState } from "react";
import { FaPencil } from "react-icons/fa6";

interface TaskItemProps {
    title?: string;
    id: string;
    onDragStart: (e: React.DragEvent, id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, id, onDragStart }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            draggable="true"
            onDragStart={(e) => onDragStart(e, id)}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            className="relative bg-black/50 rounded-xl p-4 flex flex-col cursor-grab active:cursor-grabbing hover:bg-black/30 transition shadow-black shadow-lg/30"
        >
            <h1 className="text-wrap wrap-anywhere">{title}</h1>
            <button style={{cursor:'pointer'}} className={`absolute inset-y-0 right-0 rounded-xl p-5 hover:bg-black/20 transition `}>
                <FaPencil className={`${hovered ? 'fill-white/95' : 'opacity-0'} transition`}/>
            </button>
        </div>
    );
};

export default TaskItem