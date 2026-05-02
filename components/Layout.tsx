import { useState } from "react";
import Column from "./Column";
import TaskItem from "./TaskItem";
import { Shader } from 'react-shaders'
import { code } from './example'

interface LayoutProps {
    children: React.ReactNode;
}

interface Task {
    id: string;
    title: string;
    status: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [newTaskId, setNewTaskId] = useState<string | null>(null);

    const handleDrop = (status: string) => {
        if (!draggedId) return;
        setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status } : t));
    };

    const handleUpdateTask = (id: string, newTitle: string) => {
        setTasks(prev => 
            prev.map(task => 
                task.id === id ? { ...task, title: newTitle } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const addItem = (col: string) => {
        const newTask = {
            id: crypto.randomUUID(),
            title: "",
            status: col
        };
        setTasks((prev) => [...prev, newTask]);
        setNewTaskId(newTask.id);
    }

    const columns = ["To Do", "In Progress", "In Review", "Done"];

    return (
        <div className="min-h-screen text-white p-8">
            <div className="absolute inset-0 -z-10 opacity-70">
                <div className="w-[5%] h-[5%] scale-[20] origin-top-left">
                    <Shader fs={code} />
                </div>
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
                                    autoFocus={newTaskId === t.id}
                                    onUpdate={ (id, title) => {
                                        handleUpdateTask(id, title);
                                        setNewTaskId(null);
                                    }}
                                    onDelete={deleteTask}
                                />
                            ))}
                    </Column>
                ))}
            </div>
        </div>
    );
};

export default Layout;