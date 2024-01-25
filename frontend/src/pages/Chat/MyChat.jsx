import React, { useEffect, useState } from 'react'
import { useChat } from '../../context/ChatProvider'
import axios from 'axios';
import { VStack, Box, Text, Button } from '@chakra-ui/react'
import UserMessageAvatar from '../../utills/UserMessageAvatar';
import { AddIcon } from '@chakra-ui/icons'
import AddingGroupChat from '../../utills/AddingGroupChat';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'


const MyChat = () => {
    const { chats, setChats, user, setSelectChat } = useChat();
    const [scrollEl, setScrollEl] = useState();


    useEffect(() => {
        if (scrollEl) {
            scrollEl.scrollTop = 0
        }
    }, [scrollEl, chats]);


    const fetchChats = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        let { data } = await axios.get('/api/chat', config);
        setChats(data);
    }
    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user])


    const handleFunction = (item) => {
        setSelectChat(item);
    }
    return (
        <Box
            display='flex'
            flexDir='column'
            padding='5px 10px'
        >
            <Box display='flex' justifyContent='space-between'>
                <Text fontSize='calc(12px + 0.6vw)'>My Chats</Text>
                <AddingGroupChat>
                    <Button p='2' rightIcon={<AddIcon />}>
                        <Text fontSize='calc(10px + 0.3vw)'>New Group Chat</Text></Button>
                </AddingGroupChat>
            </Box>
            <Box
                maxHeight='95vh'
                height='95vh'
            >
                <PerfectScrollbar
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '80%',
                    }}
                    containerRef={ref => {
                        setScrollEl(ref);
                    }}
                >

                    {chats?.length > 0 &&
                        chats.map(item => {
                            return (
                                <UserMessageAvatar
                                    chatProps={item}
                                    key={item._id}
                                    handleFunction={handleFunction}
                                />
                            )
                        })}
                </PerfectScrollbar>
            </Box>

        </Box>

    )
}

export default MyChat;
