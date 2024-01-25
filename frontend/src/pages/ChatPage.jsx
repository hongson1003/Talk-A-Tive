import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatProvider';
import Navbar from './Navbar/Navbar';
import { Box } from '@chakra-ui/react';
import MyChat from './Chat/MyChat';
import MainChat from './Chat/MainChat';
import _ from 'lodash';

const ChatPage = () => {
    const { user, selectChat } = useChat();
    const [size, setSize] = useState(document.body.clientWidth);
    const handleResize = () => {
        setSize(document.body.clientWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
    return (
        <Box
            display='flex'
            overflow='hidden'
            height='50px'
            flexDir='column'
            minHeight='100vh'
        >
            <Box
                maxHeight='calc(30px + 4vh)'
                height='calc(30px + 4vh)'
            >
                <Navbar />
            </Box>
            <Box
                display='flex'
                justifyContent='space-around'
                alignItems='center'
                paddingX='14px'
                backgroundColor='#92CBD1'
                maxHeight='calc(100vh - 30px - 4vh)'
                height='calc(100vh - 30px - 4vh)'
            >
                <Box
                    width='20%'
                    bg='#ffffff'
                    maxHeight='88vh'
                    height='88vh'
                    borderRadius='6px'
                    flex='1'
                    marginRight={size > 800 && '20px'}
                    display={(size < 800 && selectChat) && 'none'}
                >
                    <MyChat />
                </Box>
                <Box
                    width='68%'
                    bg='#ffffff'
                    height='88vh'
                    borderRadius='6px'
                    maxHeight='88vh'

                    display={
                        size > 800 ? 'block' :
                            (
                                !selectChat && 'none'
                            )
                    }
                    flex={size < 800 && '1'}
                >
                    <MainChat size={size} />
                </Box>
            </Box >

        </Box >
    )
}

export default ChatPage

