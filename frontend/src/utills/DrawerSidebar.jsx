import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
    Input,
    Box,
    StackDivider
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react'
import { Skeleton, } from '@chakra-ui/react'
import { useChat } from '../context/ChatProvider';
import axios from 'axios';
import AvatarItem from './AvatarItem';
import { Spinner } from '@chakra-ui/react'

const DrawerSidebar = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useChat();
    const [users, setUsers] = useState();
    const [isLoadingAccessChat, setIsLoadingAccessChat] = useState(false);
    const { setSelectChat, chats, setChats } = useChat();
    const handleOnSearch = async () => {
        setIsLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        const { data } = await axios.get(`/api/users?search=${search}`, config);
        setUsers(data);
        setTimeout(() => {
            setIsLoading(false);
        }, 600);
    }

    const handleFunction = async (item) => {
        setIsLoadingAccessChat(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        const { data } = await axios.post(`/api/chat`, {
            userId: item._id
        }, config);
        setTimeout(() => {
            if (chats.filter(item => item._id === data._id).length === 0)
                setChats([
                    ...chats, data
                ])
            setSelectChat(data);
            setIsLoadingAccessChat(false);
            onClose();
        }, 500);

    }

    const handleEnter = (e) => {
        if (e.key === 'Enter')
            handleOnSearch();
    }
    return (
        <>
            <span style={{ display: 'inline-block', height: '100%' }} ref={btnRef} onClick={onOpen}>
                {children}
            </span>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Your Friends</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' gap='2' mb='20px'>
                            <Input placeholder='Email, Name ...'
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleEnter}
                            />
                            <Button bg='#45C7C0'
                                onClick={handleOnSearch}
                            >Go</Button>
                        </Box>
                        <VStack
                            divider={<StackDivider borderColor='gray.200' />}
                            spacing={2}
                            gap='3'
                            align='stretch'
                        >
                            {
                                isLoading ?
                                    <>
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                        <Skeleton height='50px' />
                                    </> :
                                    <>
                                        {
                                            users?.length > 0 &&
                                            users.map(user => (
                                                <AvatarItem
                                                    key={user._id}
                                                    user={user}
                                                    handleFunction={handleFunction}
                                                />
                                            ))
                                        }
                                    </>
                            }
                        </VStack>
                        {isLoadingAccessChat ?
                            <Spinner margin='auto' display='block' /> :
                            <></>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerSidebar;