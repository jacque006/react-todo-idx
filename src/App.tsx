import React from 'react';
import './App.css';
import { ThemeProvider } from './providers/theme-provider.component';
import { IDXProvider } from './hooks/idx';
import TODOPage from './components/todo-page.component';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider>
          <IDXProvider ceramicOptions={{
            apiHost: 'https://ceramic-clay.3boxlabs.com',
          }}>
            <TODOPage />
          </IDXProvider>
        </ThemeProvider>
      </header>
    </div>
  );
}
