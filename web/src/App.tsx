import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import SiteInfo from './pages/SiteInfo'
import TemplateList from './pages/TemplateList'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={`/`} element={<Home/>}/>
                <Route path={`/site`} element={<SiteInfo/>}/>
                <Route path={`/template`} element={<TemplateList/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default App
