import React, { createContext, useState, useEffect } from 'react';

export const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/assignments.json');
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError('Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const updateAssignmentStatus = (id, status) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === id ? { ...assignment, status } : assignment
      )
    );
  };

  return (
    <AssignmentContext.Provider
      value={{ assignments, loading, error, updateAssignmentStatus }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};