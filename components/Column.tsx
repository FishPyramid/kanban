import { GlowCard } from "./spotlight-card";

interface ColumnProps {
    title: string;
    children: React.ReactNode;
    onDrop: (columnTitle: string) => void;
    onAdd: (col: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, children, onDrop, onAdd }) => {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleClick = () => {
        onAdd(title)
    }

    return (
        <GlowCard customSize={true}>
            <div
                onDragOver={handleDragOver}
                onDrop={() => onDrop(title)}
            >
                <h1 style={{userSelect: 'none'}} className="text-xl text-center font-bold text-shadow-amber-50 text-shadow-md/30">{title}</h1>
                <div className="flex flex-col mt-4 gap-2">
                    {children}
                </div>
                <button style={{userSelect: 'none', cursor:'pointer'}} onClick={handleClick} className="
                    mt-4
                    rounded-xl
                    opacity-80
                    hover:opacity-60
                    transition
                    border-2
                    text-xl
                    py-2
                    w-full
                    shadow-amber-50
                    shadow-md/15
                    text-shadow-amber-50
                    text-shadow-md/30
                ">+</button>
            </div>
        </GlowCard>
        
    );
};

export default Column