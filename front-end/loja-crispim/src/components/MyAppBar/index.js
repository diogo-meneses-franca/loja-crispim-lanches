import * as React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const MyAppBar = () => {
  const navigate = useNavigate();
    const loadPage = (page) => {
        navigate(page);
    }

  const startContent = (
    <React.Fragment>
        <Button label="Home"  className=" relative m-3 bg-blue-400 border-transparent" onClick={()=> loadPage('/')}/>
    </React.Fragment>
);

  return (
    
      <Toolbar class=" bg-blue-400 h-5rem" start={startContent} />

  );
}
export default MyAppBar;