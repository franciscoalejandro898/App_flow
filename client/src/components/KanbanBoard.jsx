import React, { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskDetailsModal from './TaskDetailsModal';
import TaskCard from './TaskCard.jsx';
import './kanbanBoard.css';

const ItemType = 'CARD';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Tarea 1', date: 'May 14, 2022' },
    'task-2': { id: 'task-2', content: 'Tarea 2', date: 'May 15, 2022' },
    'task-3': { id: 'task-3', content: 'Tarea 3', date: 'May 31, 2022' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Planificación',
      taskIds: ['task-1'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Desarrollo',
      taskIds: ['task-2'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Progreso',
      taskIds: [],
    },
    'column-4': {
      id: 'column-4',
      title: 'Hecho',
      taskIds: ['task-3'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  people: [
    { id: 'person-1', name: 'John Doe' },
    { id: 'person-2', name: 'Jane Smith' },
  ],
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const moveCard = (source, destination) => {
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, source.draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, source.draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  const addColumn = () => {
    if (newColumnTitle.trim() === '') {
      alert('El nombre del contenedor no puede estar vacío.');
      return;
    }

    const newColumnId = `column-${Object.keys(data.columns).length + 1}`;
    const newColumn = {
      id: newColumnId,
      title: newColumnTitle,
      taskIds: [],
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...data.columnOrder, newColumnId],
    });

    setNewColumnTitle('');
  };

  const deleteColumn = (columnId) => {
    const column = data.columns[columnId];
    if (column.taskIds.length > 0) {
      alert('No se puede eliminar un contenedor que contiene tareas.');
      return;
    }

    const newColumns = { ...data.columns };
    delete newColumns[columnId];

    const newColumnOrder = data.columnOrder.filter(id => id !== columnId);

    setData({
      ...data,
      columns: newColumns,
      columnOrder: newColumnOrder,
    });
  };

  const addTask = (columnId, content) => {
    const newTaskId = `task-${Object.keys(data.tasks).length + 1}`;
    const newTask = { id: newTaskId, content, date: new Date().toLocaleString() };

    const newTasks = {
      ...data.tasks,
      [newTaskId]: newTask,
    };

    const newTaskIds = [...data.columns[columnId].taskIds, newTaskId];
    const newColumn = {
      ...data.columns[columnId],
      taskIds: newTaskIds,
    };

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    });
  };

  const updateTask = (updatedTask) => {
    const newTasks = {
      ...data.tasks,
      [updatedTask.id]: updatedTask,
    };
    setData({
      ...data,
      tasks: newTasks,
    });
  };

  const deleteTask = (taskId, columnId) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const column = data.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);
    const newColumn = { ...column, taskIds: newTaskIds };

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [column.id]: newColumn,
      },
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        <div className="kanban-columns">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                moveCard={moveCard}
                deleteColumn={() => deleteColumn(column.id)}
                addTask={addTask}
                setSelectedTask={setSelectedTask}
                deleteTask={deleteTask}
              />
            );
          })}
        </div>
        {data.columnOrder.length < 5 && (
          <div className="kanban-column add-column">
            <input
              type="text"
              placeholder="Nueva columna"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <button onClick={addColumn}>Añadir columna</button>
          </div>
        )}
        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            people={data.people}
            onClose={() => setSelectedTask(null)}
            onSave={updateTask}
          />
        )}
      </div>
    </DndProvider>
  );
};

const Column = ({ column, tasks, moveCard, deleteColumn, addTask, setSelectedTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item, monitor) => {
      const source = monitor.getItem();
      const destination = {
        droppableId: column.id,
        index: tasks.length,
      };
      moveCard(source, destination);
    },
  });

  const [newTaskContent, setNewTaskContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleAddTask = () => {
    if (newTaskContent.trim() === '') {
      alert('El contenido de la tarea no puede estar vacío.');
      return;
    }
    addTask(column.id, newTaskContent);
    setNewTaskContent('');
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId, column.id);
  };

  const handleTitleChange = (e) => {
    setColumnTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (columnTitle.trim() === '') {
      alert('El título de la columna no puede estar vacío.');
      setColumnTitle(column.title);
      setIsEditingTitle(false);
      return;
    }
    column.title = columnTitle;
    setIsEditingTitle(false);
  };

  return (
    <div ref={drop} className="kanban-column">
      <div className="kanban-column-header">
        {isEditingTitle ? (
          <input
            type="text"
            className="kanban-column-title-input"
            value={columnTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleTitleSubmit();
              }
            }}
            autoFocus
          />
        ) : (
          <h2 className="kanban-column-title" onClick={() => setIsEditingTitle(true)}>
            {column.title}
          </h2>
        )}
        <button className="delete-column" onClick={deleteColumn}>×</button>
      </div>
      <div className="kanban-column-content">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            columnId={column.id}
            moveCard={moveCard}
            setSelectedTask={setSelectedTask}
            onDelete={handleDeleteTask}
          />
        ))}
        <div className="add-task">
          <input
            type="text"
            placeholder="Nueva tarea"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
          />
          <button onClick={handleAddTask}>Crear</button>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
