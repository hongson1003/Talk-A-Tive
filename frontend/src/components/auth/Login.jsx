import React, { useState } from 'react'
import {
    FormControl,
    FormLabel,
    Input,
    InputRightElement,
    InputGroup,
    Button,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import './Register.css';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useChat } from '../../context/ChatProvider';

const Login = () => {

    const [isShow, setIsShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const toast = useToast();
    const { setUser } = useChat();

    const handleOnSignIn = async () => {
        let user = {
            email, password,
        }
        try {
            const { data } = await axios.post('/api/users/login', user);
            if (data) {
                delete data.password;
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                history.push('/chat');
            } else {
                toast({
                    title: 'Sign In Fail',
                    description: "Email or Password incorrect !!!",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                })
            }
        } catch (e) {
            toast({
                title: 'Sign In Fail',
                description: "Email or Password incorrect !!!",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            })
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter')
            handleOnSignIn();
    }


    return (
        <VStack
            spacing={5}
            align='stretch'
            p='10px'
            className='register'
        >
            <FormControl p='5px' isRequired='true' className='myform'>
                <FormLabel>Email</FormLabel>
                <Input type='email' width='100%' p='5px 3px' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl p='5px' isRequired='true' className='myform'>
                <FormLabel>Password</FormLabel>
                <InputGroup size='xl' d='flex' alignItems='center' justifyContent='space-between'>
                    <Input
                        pr='4.5rem'
                        type={isShow ? 'text' : 'password'}
                        placeholder='Enter Your password'
                        maxWidth='100%' p='5px 3px'
                        width='100%'
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <InputRightElement width='4.5rem' d='flex' alignItems='center' height='100%'>
                        <Button cursor='pointer' h='1.75rem' size='sm' onClick={() => setIsShow(!isShow)} __css={{ padding: '5px' }}>
                            {isShow ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl p='5px' className='myform'>
                <Button className='signup' width='100%' p='10px' onClick={handleOnSignIn}>Sign In</Button>
            </FormControl>

        </VStack >

    )
}

export default Login
