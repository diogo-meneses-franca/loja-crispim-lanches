import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';



const  MyAppBar = ()=> {
  const navigate = useNavigate();
  const loadPage = (page)=>{
    navigate(page);
  }
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" onClick={()=>loadPage('/category')}>Categoria</Button>
            <Button color="inherit" onClick={()=>loadPage('/brand')}>Marca</Button>
            <Button color="inherit" onClick={()=>loadPage('/product')}>Produto</Button>
            <Button color="inherit" onClick={()=>loadPage('/addrState')}>Estado</Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}/>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
export default MyAppBar;