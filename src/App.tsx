import React from 'react';
import './App.css';
import { Background } from './components/background';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Intro } from './components/intro';
import { Main } from './components/main';

function App() {
  return (
    <>
      <Header />
      <Background>
        <Intro />
        <Main />
        <Footer />
      </Background>
    </>
  );
}

export default App;
