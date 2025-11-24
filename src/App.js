import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import useTechnologies from './hooks/useTechnologies';

function App() {
    const { technologies, updateStatus, updateNotes, addTechnology, deleteTechnology, progress } = useTechnologies();

    return (
        <Router>
            <div className="App">
                <Navigation />
                <main className="App-main">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home
                                    technologies={technologies}
                                    progress={progress}
                                    updateStatus={updateStatus}
                                />
                            }
                        />
                        <Route
                            path="/technologies"
                            element={
                                <TechnologyList
                                    technologies={technologies}
                                    updateStatus={updateStatus}
                                />
                            }
                        />
                        <Route
                            path="/technology/:techId"
                            element={
                                <TechnologyDetail
                                    technologies={technologies}
                                    updateStatus={updateStatus}
                                    updateNotes={updateNotes}
                                    deleteTechnology={deleteTechnology}
                                />
                            }
                        />
                        <Route
                            path="/add-technology"
                            element={
                                <AddTechnology
                                    onAddTechnology={addTechnology}
                                />
                            }
                        />
                        <Route
                            path="/statistics"
                            element={
                                <Statistics
                                    technologies={technologies}
                                />
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <Settings />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;