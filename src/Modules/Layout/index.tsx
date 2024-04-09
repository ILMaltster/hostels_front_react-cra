import { Navigate, Outlet, useNavigate } from "react-router-dom"
import Container from "@mui/material/Container"
import { AppBar, Box, Button, Toolbar, Typography, useTheme } from "@mui/material"
import { PATHS } from "../../routePaths"

const pages = [
    {title: 'Домой', path: PATHS.root.home.$path}, 
    {title: 'Таблицы', path: PATHS.root.tables.$path}, 
    {title: 'Отчеты', path: PATHS.root.reports.$path}
]


export const Layout = () => {
    const navigate = useNavigate();
    const theme = useTheme()

    return (
        <>
            <AppBar position="static">
                <Container<'header'> component="header" maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'roboto',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            Управление отелями
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: {md: 'flex' } }}>
                            {pages.map((page) => (
                            <Button
                                key={page.title}
                                onClick={() => navigate(page.path)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.title}
                            </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container sx={{marginTop: theme.spacing(2), flexGrow: '1'}}>
                <Outlet/>
            </Container>
        </>
    )
}