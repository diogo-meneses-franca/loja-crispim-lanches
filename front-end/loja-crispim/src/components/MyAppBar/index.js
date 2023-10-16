import * as React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css';
        

const MyAppBar = () => {
  const navigate = useNavigate();
  const loadPage = (page) => {
    navigate(page);
  }

  const startContent = (
    <React.Fragment>
      <Button label="Home" className="inline m-3 bg-blue-500 border-transparent" onClick={() => loadPage('/')} />
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <Button icon="pi pi-user" className="inline bg-blue-500 border-transparent" />
    </React.Fragment>
  );

  return (

    <div className='card bg-blue-500'>
      <Toolbar className='bg-blue-500 border-transparent' start={startContent} end={endContent} />
    </div>

  );
}
export default MyAppBar;