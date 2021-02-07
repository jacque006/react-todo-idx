import React from 'react';
import { ThemeProvider } from './providers/theme-provider.component';
import { IDXProvider } from './hooks/idx';
import TODOPage from './components/todo-page.component';
import AppBar from './components/app-bar.component';

export default function App() {
  return (
    <ThemeProvider>
      <IDXProvider ceramicOptions={{
        apiHost: 'https://ceramic-clay.3boxlabs.com',
      }}>
        <AppBar />
        <TODOPage />
      </IDXProvider>
    </ThemeProvider>
  );
}
