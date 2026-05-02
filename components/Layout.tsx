import { useEffect, useState } from "react";
import Column from "./Column";
import TaskItem from "./TaskItem";
import { createClient } from '@supabase/supabase-js';
import { GradFlow } from 'gradflow'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LayoutProps {
    children?: React.ReactNode;
}

interface Task {
    id: string;
    title: string;
    status: string;
    user_id: string;
    created_at: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [newTaskId, setNewTaskId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initSessionAndFetch = async () => {
            let { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                const { data, error } = await supabase.auth.signInAnonymously();
                if (error) {
                    console.error("Auth error:", error.message);
                    return;
                }
                session = data.session;
            }

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: true });

            if (!error && data) {
                setTasks(data);
            }
            setLoading(false);
        };

        initSessionAndFetch();
    }, []);

    const handleDrop = async (status: string) => {
        if (!draggedId) return;

        setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status } : t));

        const { error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', draggedId);

        if (error) console.error("Update failed:", error.message);
    };

    const handleUpdateTask = async (id: string, newTitle: string) => {
        setTasks(prev => 
            prev.map(task => task.id === id ? { ...task, title: newTitle } : task)
        );

        const { error } = await supabase
            .from('tasks')
            .update({ title: newTitle })
            .eq('id', id);

        if (error) console.error("Title update failed:", error.message);
    };

    const deleteTask = async (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) console.error("Delete failed:", error.message);
    };

    const addItem = async (col: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ 
                title: "", 
                status: col, 
                user_id: user.id 
            }])
            .select()
            .single();

        if (!error && data) {
            setTasks((prev) => [...prev, data]);
            setNewTaskId(data.id);
        }
    };

    const columns = ["To Do", "In Progress", "In Review", "Done"];

    return (
        <div className="min-h-screen text-white p-8">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <GradFlow config={{
                    color3: '#e2624b',
                    color2: '#ffffff',
                    color1: '#1e229f',
                    speed: 0.4,
                    scale: 1,
                    type: 'stripe',
                }} />
            </div>
            
            {children}
            {!loading ? 
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
                                    onUpdate={(id, title) => {
                                        handleUpdateTask(id, title);
                                        setNewTaskId(null);
                                    }}
                                    onDelete={deleteTask}
                                />
                            ))}
                    </Column>
                ))}
            </div>
            : <h1 className="p-20 text-center font-bold text-shadow-amber-50 text-shadow-lg/20 text-xl">Loading...</h1>}
        </div>
    );
};

export default Layout;