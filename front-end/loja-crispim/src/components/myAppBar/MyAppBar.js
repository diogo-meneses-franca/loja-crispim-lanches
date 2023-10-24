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
      <Button label="Home" className="inline m-3 surface-200 text-red-500 font-bold border-transparent text-lg  " onClick={() => loadPage('/')} />
    </React.Fragment>
  );

  const endContent = (
    <React.Fragment>
      <Button icon="pi pi-user" className="inline text-red-500 surface-200 font-bold border-transparent" />
    </React.Fragment>
  );

  return (

    <div className='card surface-200'>
      <Toolbar className='surface-200 border-transparent' start={startContent} end={endContent} />
    </div>

  );
}
export default MyAppBar;