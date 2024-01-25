import React, { useState } from 'react'
import {
    FormControl,
    FormLabel,
    Input,
    InputRightElement,
    InputGroup,
    Button,
    Box,
    Text,
} from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import './Register.css';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useChat } from '../../context/ChatProvider';

const Register = () => {

    const [isShow, setIsShow] = useState(false);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const history = useHistory();
    const { user, setUser } = useChat();

    const handleOnChangeImage = (event) => {
        setLoading(true);
        const picture = event.target.files && event.target.files?.[0];
        if (!picture || !(picture.type === 'image/jpeg' || picture.type === 'image/png')) {
            toast({
                position: 'bottom-left',
                render: () => (
                    <Box color='white' p={3} bg='blue.500'>
                        Đã upload ảnh thành công
                    </Box>
                ),
            });
            setLoading(false);
            return;
        }
        const data = new FormData();
        data.append('file', picture);
        data.append('upload_preset', 'chat-app')
        data.append('cloud_name', 'djrsfrdir');
        fetch('https://api.cloudinary.com/v1_1/djrsfrdir/image/upload', {
            method: 'post',
            body: data,
        }).then((res) => res.json())
            .then(data => {
                setAvatar(data.url.toString());
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
            })

    }

    const handleOnSignUp = async () => {
        setLoading(true);
        let user = {
            name, email, password, avatar
        };
        for (let value in user) {
            if (!user[value]) {
                toast({
                    title: 'Sign Up Fail',
                    description: "The Fields is not empty !",
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                })
                setLoading(false);
                return;
            }
        }
        if (password !== confirmPassword) {
            toast({
                title: 'Sign Up Fail',
                description: "Please enter confirm password like password, again !",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            })
            setLoading(false);
            return;
        }
        let rs = await axios.post('/api/users/', user);
        let data = rs?.data;
        delete data.password;
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        setLoading(false);
        history.push('/chat');
    }

    return (
        <VStack
            align='stretch'
            p='10px'
            className='register'
        >
            <FormControl p='5px' isRequired='true' className='myform'>
                <FormLabel>Name</FormLabel>
                <Input value={name} type='text' width='100%' p='5px 3px' placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl p='5px' isRequired='true' className='myform'>
                <FormLabel>Email</FormLabel>
                <Input value={email} type='email' width='100%' p='5px 3px' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
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
                        value={password}
                    />
                    <InputRightElement width='4.5rem' d='flex' alignItems='center' height='100%'>
                        <Button cursor='pointer' h='1.75rem' size='sm' onClick={() => setIsShow(!isShow)} __css={{ padding: '5px' }}>
                            {isShow ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl p='5px' isRequired='true' className='myform'>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size='xl' d='flex' alignItems='center' justifyContent='space-between'>
                    <Input
                        pr='4.5rem'
                        type={isShowConfirm ? 'text' : 'password'}
                        placeholder='Enter Your Password Again'
                        maxWidth='100%' p='5px 3px'
                        width='100%'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    <InputRightElement width='4.5rem' d='flex' alignItems='center' height='100%'>
                        <Button cursor='pointer' h='1.75rem' size='sm' onClick={() => setIsShowConfirm(!isShowConfirm)} __css={{ padding: '5px' }}>
                            {isShowConfirm ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl p='5px' className='myform'>
                <FormLabel>Avatar &#40;*Just only format JPG/PNG&#41;</FormLabel>
                <Input type='file' p='5px 3px'
                    onChange={handleOnChangeImage}
                />
            </FormControl>

            <FormControl p='5px' className='myform'>
                <Button className='signup' width='100%' p='10px'
                    onClick={handleOnSignUp}
                    isLoading={loading}
                >Sign Up</Button>
            </FormControl>

        </VStack >

    )
}

export default Register
