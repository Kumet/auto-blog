import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import SiteInfo from './pages/SiteInfo'
import TemplateList from './pages/TemplateList'
import Settings from './pages/Settings'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={`/`} element={<Home/>}/>
                <Route path={`/site`} element={<SiteInfo/>}/>
                <Route path={`/template`} element={<TemplateList/>}/>
                <Route path={`/settings`} element={<Settings/>}/>
            </Routes>
        </BrowserRouter>
    )
}
export default App
