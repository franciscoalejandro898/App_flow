import React, { createContext, useReducer } from 'react';

const KanbanContext = createContext();

const initialState = {
  tasks: {/* ... */},
  columns: {/* ... */},
  columnOrder: {/* ... */}
};

const kanbanReducer = (state, action) => {
  switch (action.type) {
    // Define actions like ADD_TASK, MOVE_TASK, etc.
    default:
      return state;
  }
};

export const KanbanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
};

export default KanbanContext;
