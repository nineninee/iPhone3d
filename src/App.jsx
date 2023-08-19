/*
 * @Author: hvvvvvv- 1264178545@qq.com
 * @Date: 2023-08-18 20:14:14
 * @LastEditors: hvvvvvv- 1264178545@qq.com
 * @LastEditTime: 2023-08-18 21:56:56
 * @FilePath: \iphone-3d\src\App.jsx
 * @Description: >
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import Nav from './components/Nav'
import Jumbotron from './components/Jumbotron';
import SoundSection from './components/SoundSection';
import DisplaySection from './components/DisplaySection';


function App() {

  return (
    <div className="App">
      <Nav />
      <Jumbotron />
      <SoundSection />
      <DisplaySection />
    </div>
  );
}

export default App;