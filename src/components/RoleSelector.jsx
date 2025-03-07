import React, { useContext } from 'react';
import { RoleContext } from '../RoleContext';

const RoleSelector = () => {
  const { role, setRole } = useContext(RoleContext);

  return (
    <div className=" flex justify-end items-center">
      <label className="mr-2 text-lg font-semibold">Select Role:</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
    </div>
  );
};

export default RoleSelector;