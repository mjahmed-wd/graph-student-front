import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import { useRoundInputBaseStyles } from '@mui-treasury/styles/inputBase/round';

const FormikInput = (props) => {
  const styles = useRoundInputBaseStyles();
  return (
    <div>
      <InputBase classes={styles} {...props}/>
      <Box pb={1} />
    </div>
  );
};

export default FormikInput;