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

export const ReportsList = () => {
    return (
        <Box>
            <Typography variant="h2">
                Выбор отчетов
            </Typography>
            <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Stack spacing={2} sx={{minWidth: '300px'}}>
                    <Item>
                        <Link to={PATHS.root.reports.frequentCustomer.$path}>
                            <Typography>Отчеты FrequentCustomer</Typography>
                        </Link>
                    </Item>
                    <Item>
                        <Link to={PATHS.root.reports.profitableRooms.$path}>
                            <Typography>Отчеты ProfitableRooms</Typography>
                        </Link>
                    </Item>
                </Stack>
            </Box>
        </Box>
    )
}
