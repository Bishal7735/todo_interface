import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

export default function LoginPage() {
    const adornmentId = React.useId();
    const textFieldId = React.useId();
    const sxId = React.useId();
    return (
        <Box sx={{
            mt: 10,
            ml: 50,
            width: "50%",
            borderRadius: 1,
            borderRadiousColor: "#00000",
            bgcolor: '#2cd2c9',
        }}>
            <InputLabel sx={{ mt: 10, fontFamily: "arial", fontSize: "3rem" }}>
                SIGN IN
            </InputLabel>
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                <PersonIcon fontSize='large' sx={{ height: 100 }} />
            </Box>
            <FormControl variant="standard">
                <Input
                    sx={{ mt: 10 }}
                    id="email"
                    placeholder='Email'
                />
                <Input
                    sx={{ mt: 5 }}
                    id="password"
                    placeholder='Password'
                />

                <Button sx={{ m: 10 }} variant="contained" endIcon={<SendIcon />}>
                    Login
                </Button>
            </FormControl>
        </Box>
    );
}
