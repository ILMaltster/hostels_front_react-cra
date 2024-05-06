import { styled } from '@mui/material/styles';
import { Box, Paper, Stack, Typography } from "@mui/material"
import { PATHS } from 'routePaths';
import { Link } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    maxWidth: 400,
  }));

export const Tables = () => {
    return (
        <Box>
            <Typography variant="h2">
                Выбор таблицы
            </Typography>
            <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Stack spacing={2} sx={{minWidth: '300px'}}>
                    <Item>
                        <Link to={PATHS.root.tables.hostels.$path}>
                            <Typography>Таблицы HOSTELS</Typography>
                        </Link>
                    </Item>
                    <Item>
                        <Link to={PATHS.root.tables.posts.$path}>
                            <Typography>Таблицы Posts</Typography>
                        </Link>
                    </Item>
                    <Item>
                        <Link to={PATHS.root.tables.staff.$path}>
                            <Typography>Таблицы Staff</Typography>
                        </Link>
                    </Item>
                </Stack>
            </Box>
        </Box>
    )
}
