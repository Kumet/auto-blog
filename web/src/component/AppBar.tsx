import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import {createTheme, Stack, ThemeProvider} from '@mui/material'
import {Link} from 'react-router-dom'


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
})

interface Page {
    label: string
    path: string
}

const pages: Page[] = [
    {label: 'home', path: '/'},
    {label: 'site info', path: '/site'},
    {label: 'template', path: '/template'},
]

const MyAppBar = () => {
    return (
        <Stack sx={{flexGrow: 1}}>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{display: 'flex'}}>
                            {pages.map((page) => (
                                <Link to={page.path} key={page.label}>
                                    <Button
                                        sx={{my: 2, color: 'white', display: 'block'}}
                                    >
                                        {page.label}
                                    </Button>
                                </Link>
                            ))}
                        </Box>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </Stack>
    )
}

export default MyAppBar