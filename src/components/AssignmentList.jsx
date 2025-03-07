import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AssignmentContext } from '../AssignmentContext';
import { RoleContext } from '../RoleContext';

const AssignmentList = () => {
  const { assignments, setAssignments } = useContext(AssignmentContext);
  const { role } = useContext(RoleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dueDateFilter, setDueDateFilter] = useState('');
  const assignmentsPerPage = 10;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/assignments.json'); // Ensure this path is correct
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };

    fetchAssignments();
  }, [setAssignments]);

  const filteredAssignments = assignments.filter(
    (assignment) =>
      (assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (dueDateFilter === '' || assignment.dueDate === dueDateFilter) &&
      (role === 'teacher' || assignment.student === 'student1') // Filter based on role and student
  );

  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = filteredAssignments.slice(indexOfFirstAssignment, indexOfLastAssignment);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(filteredAssignments.length / assignmentsPerPage)) {
      return; // Prevent going beyond the first or last page
    }
    setCurrentPage(pageNumber);
  };

  // Get unique due dates for the due date filter dropdown
  const uniqueDueDates = [...new Set(assignments
    .filter(assignment => role === 'teacher' || assignment.student === 'student1')
    .map(assignment => assignment.dueDate))];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Due Dates</option>
            {uniqueDueDates.map((dueDate, index) => (
              <option key={index} value={dueDate}>
                {dueDate}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white p-4 rounded-lg shadow flex-col flex content-center relative group">
            <h3 className="truncate text-lg font-semibold">
              <Link to={`/assignment/${assignment.id}`}>{assignment.title}</Link>
            </h3>
            <p className="text-gray-600">Due: {assignment.dueDate}</p>
            <p className="text-gray-600 truncate">{assignment.description}</p>
            <Link to={`/assignment/${assignment.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2 text-center">View Details</Link>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l disabled:bg-gray-300"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2 flex items-center">Page {currentPage} of {Math.ceil(filteredAssignments.length / assignmentsPerPage)}</span>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r disabled:bg-gray-300"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredAssignments.length / assignmentsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AssignmentList;