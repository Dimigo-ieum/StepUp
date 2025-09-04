import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext' // 1. ProjectProvider를 import 합니다.

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProjectProvider>
                    <App />
                </ProjectProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
