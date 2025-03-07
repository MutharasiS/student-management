import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AssignmentContext } from '../AssignmentContext';
import { RoleContext } from '../RoleContext';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assignments, updateAssignmentStatus } = useContext(AssignmentContext);
  const { role } = useContext(RoleContext);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const assignment = assignments.find((item) => item.id === parseInt(id));
        if (assignment) {
          setAssignment(assignment);
        } else {
          setError('Assignment not found');
        }
      } catch (err) {
        setError('Failed to fetch assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id, assignments]);

  const validateForm = () => {
    const errors = {};
    if (!studentName) errors.studentName = 'Student Name is required';
    if (!email) errors.email = 'Email is required';
    if (!file) errors.file = 'File upload is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    // Simulate submission
    updateAssignmentStatus(parseInt(id), 'Submitted');
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      navigate('/'); // Redirect to the list page
    }, 3000); // Show confirmation for 3 seconds
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!assignment) return <p>Assignment not found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{assignment.title}</h2>
        <p className="text-gray-600 mb-4">Due: {assignment.dueDate}</p>
        <p className="text-gray-600 mb-4">{assignment.description}</p>
        <p className="text-gray-600 mb-4">{assignment.instructions}</p>
        <p className="text-gray-600 mb-4">Status: {assignment.status || 'Not Submitted'}</p>
        {role === 'student' && assignment.status !== 'Submitted' ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {validationErrors.studentName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.studentName}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">File Upload (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {validationErrors.file && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.file}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Comments</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Assignment
            </button>
          </form>
        ) : role === 'student' && assignment.status === 'Submitted' ? (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            Assignment submitted successfully!
          </div>
        ) : null}
        {role === 'teacher' && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-center">
            {assignment.status === 'Submitted' ? 'Assignment  submitted.' : 'Assignment has not been submitted.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;