import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'

const Navbar = () => {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
            align="center"
          >
            Snow Enterprices' Clients
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
export default Navbar
