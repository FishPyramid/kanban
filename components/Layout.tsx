import { useState } from "react";
import Column from "./Column";
import TaskItem from "./TaskItem";
import { Shader } from 'react-shaders'
import { code } from './example'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [tasks, setTasks] = useState([
        { id: crypto.randomUUID(), title: "gfdgd", status: "To Do" },
        { id: crypto.randomUUID(), title: "y5rgfd", status: "In Progress" },
        { id: crypto.randomUUID(), title: "4ygfd", status: "Done" },
        { id: crypto.randomUUID(), title: "gfdy4", status: "Done" },
    ]);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDrop = (status: string) => {
        if (!draggedId) return;
        setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status } : t));
    };

    const addItem = (col: string) => {
        const title = window.prompt("Enter task name...");
        if (!title) return;
        const newTask = {
            id: crypto.randomUUID(),
            title: title,
            status: col
        };
        setTasks((prev) => [...prev, newTask]);
    }

    const columns = ["To Do", "In Progress", "In Review", "Done"];

    return (
        <div className="min-h-screen text-white p-8">
            <div className="absolute inset-0 -z-10 opacity-70">
                <Shader fs={code} />
            </div>
            
            {children}

            <div className="grid grid-cols-4 gap-4 mt-10 items-baseline">
                {columns.map((col) => (
                    <Column key={col} title={col} onDrop={handleDrop} onAdd={addItem}>
                        {tasks
                            .filter((t) => t.status === col)
                            .map((t) => (
                                <TaskItem
                                    key={t.id}
                                    id={t.id}
                                    title={t.title}
                                    onDragStart={() => setDraggedId(t.id)}
                                />
                            ))}
                    </Column>
                ))}
            </div>
        </div>
    );
};

export default Layout;