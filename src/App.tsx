import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IDXProvider } from './hooks/idx';
import TODOPage from './components/todo-page.component';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <IDXProvider ceramicOptions={{
          apiHost: 'https://ceramic-clay.3boxlabs.com',
        }}>
          <TODOPage />
        </IDXProvider>
      </header>
    </div>
  );
}
