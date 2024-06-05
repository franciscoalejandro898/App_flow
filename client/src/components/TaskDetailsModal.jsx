import React, { useState } from 'react';
import './TaskDetailsModal.css';

const TaskDetailsModal = ({ task, people, onClose, onSave }) => {
  const [description, setDescription] = useState(task.description || '');
  const [startDate, setStartDate] = useState(task.startDate || '');
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || '');
  const [priority, setPriority] = useState(task.priority || '');
  const [components, setComponents] = useState(task.components || '');

  const handleSave = () => {
    onSave({ ...task, description, startDate, assignedTo, priority, components });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles de la Tarea</h2>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Fecha de inicio:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Prioridad:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Persona asignada:</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Seleccionar</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Proyecto:</label>
            <input
              type="text"
              value={components}
              onChange={(e) => setComponents(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
