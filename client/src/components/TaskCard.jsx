import React from 'react';
import { useDrag } from 'react-dnd';

const ItemType = 'CARD';

const TaskCard = ({ task, index, columnId, moveCard, setSelectedTask, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { draggableId: task.id, index, droppableId: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex flex-col p-2 border rounded bg-white shadow ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => setSelectedTask(task)}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="font-bold text-lg mb-2">{task.content}</p>
        </div>
        <button
          className="text-gray-500"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTask(task);
          }}
        >
          ✏️
        </button>
      </div>
      <p className="text-gray-500 mb-2">{task.date}</p>
      <button
        className="self-end text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default TaskCard;

