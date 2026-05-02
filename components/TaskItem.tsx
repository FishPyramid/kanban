import { useEffect, useRef, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

interface TaskItemProps {
    title?: string;
    id: string;
    autoFocus?: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onUpdate: (id: string, newTitle: string) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, id, autoFocus, onDragStart, onUpdate, onDelete }) => {
    const [hovered, setHovered] = useState(false)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (editing && textRef.current) {
            textRef.current.focus();
            
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(textRef.current);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [editing]);

    useEffect(() => {
        if (autoFocus) setEditing(true);
    }, [autoFocus]);

    const textRef = useRef<HTMLInputElement>(null)
    
    const saveEdit = () => {
        if(textRef.current?.innerText.trim())
            onUpdate(id, textRef.current?.innerText);
        else
            onDelete(id)
        setEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key=== 'Escape') {
            e.preventDefault();
            textRef.current?.blur();
        }
    };

    return (
        <div
            draggable="true"
            onDragStart={(e) => onDragStart(e, id)}
            onPointerOver={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            className="relative bg-black/50 rounded-xl p-4 flex flex-col cursor-grab active:cursor-grabbing hover:bg-black/30 transition shadow-black shadow-lg/30"
        >
            <h1
                ref={textRef}
                contentEditable={editing}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
                className={`text-wrap break-all outline-none ${editing ? 'bg-black/20 rounded px-1' : ''} ${hovered ? 'pr-10' : ''}`}
            >
                {title}
            </h1>
            <button 
                onPointerDown={(e) => {
                    if (editing) {
                        e.preventDefault();
                        onDelete(id);
                    }
                }}
                onClick={() => {
                    if (!editing) setEditing(true);
                }}
                style={{ cursor: 'pointer' }} 
                className={`absolute top-2 right-2 h-10 w-10 rounded-xl p-5 hover:bg-black/20 transition`}
            >
                <div className="relative flex items-center justify-center">
                    <FaPencil className={`absolute ${hovered && !editing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all duration-200 fill-white/95`} />
                    <FaTrashCan className={`absolute ${hovered && editing ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all duration-200 fill-red-600/95`} />
                </div>
            </button>
        </div>
    );
};

export default TaskItem