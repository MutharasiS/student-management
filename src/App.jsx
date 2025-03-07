import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AssignmentList from './components/AssignmentList';
import AssignmentDetail from './components/AssignmentDetail';
import RoleSelector from './components/RoleSelector';
import { AssignmentProvider } from './AssignmentContext';
import { RoleProvider } from './RoleContext';

function App() {
  return (
    <RoleProvider>
      <AssignmentProvider>
        <Router>
          <div>
            <header className="bg-blue-500 text-white p-4 flex justify-between items-center flex-wrap">
              <Link to="/"> <h1 className="text-2xl font-bold">Logo</h1></Link>
              <RoleSelector />
            </header>
            <main className="p-4 container mx-auto">
              <Routes>
                <Route path="/" element={<AssignmentList />} />
                <Route path="/assignment/:id" element={<AssignmentDetail />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AssignmentProvider>
    </RoleProvider>
  );
}

export default App;