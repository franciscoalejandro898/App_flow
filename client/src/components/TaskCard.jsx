import React, { useState } from 'react';
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

  const [isEditing, setIsEditing] = useState(false);
  const [taskContent, setTaskContent] = useState(task.content);

  const handleContentChange = (e) => {
    setTaskContent(e.target.value);
  };

  const handleContentSubmit = () => {
    if (taskContent.trim() === '') {
      alert('El contenido de la tarea no puede estar vacío.');
      setTaskContent(task.content);
      setIsEditing(false);
      return;
    }
    task.content = taskContent;
    setIsEditing(false);
  };

  return (
    <div
      ref={drag}
      className={`kanban-task ${isDragging ? 'is-dragging' : ''}`}
    >
      <div className="task-content">
        {isEditing ? (
          <input
            type="text"
            className="task-content-input"
            value={taskContent}
            onChange={handleContentChange}
            onBlur={handleContentSubmit}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleContentSubmit();
              }
            }}
            autoFocus
          />
        ) : (
          <p className="task-content-text" onClick={() => setIsEditing(true)}>{task.content}</p>
        )}
        <p className="task-date">{task.date}</p>
      </div>
      <div className="task-actions">
        <span className="task-icon edit-icon" onClick={() => setSelectedTask(task)}>&#9998;</span>
        <span className="task-icon delete-icon" onClick={() => onDelete(task.id)}>&#128465;</span>
      </div>
    </div>
  );
};

export default TaskCard;

