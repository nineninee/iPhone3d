/*
 * @Author: hvvvvvv- 1264178545@qq.com
 * @Date: 2023-08-18 20:14:14
 * @LastEditors: hvvvvvv- 1264178545@qq.com
 * @LastEditTime: 2023-08-20 18:32:38
 * @FilePath: \iphone-3d\src\App.jsx
 * @Description: >
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Nav from './components/Nav'
import Jumbotron from './components/Jumbotron';
import SoundSection from './components/SoundSection';
import DisplaySection from './components/DisplaySection';
import WebgiViewer from './components/WebgiViewer';
import Loader from './components/Loader'
import { useRef } from 'react';

function App() {
  const webgiViewerRef = useRef()
  const contentRef = useRef()

  const handlePreview = () => {
    webgiViewerRef.current.triggerPreview()
  }

  return (
    <div className="App">
      <Loader />
      <div id="content" ref={contentRef}>
        <Nav />
        <Jumbotron />
        <SoundSection />
        <DisplaySection triggerPreview={handlePreview} />
      </div>
      
      <WebgiViewer ref={webgiViewerRef} contentRef={contentRef} />
    </div>
  );
}

export default App;
