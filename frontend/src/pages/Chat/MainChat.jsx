import React, { useEffect } from 'react'
import { useChat } from '../../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';


const MainChat = ({ size }) => {
    const { user, setUser, selectChat, setSelectChat } = useChat();
    useEffect(() => {
    }, [selectChat])
    return (
        <>
            {
                selectChat ? (
                    <SingleChat size={size} />
                ) : (
                    <Box display='flex' flex='1' alignItems='center' justifyContent='center'
                        height='88vh'
                    >Click on a user to start chatting</Box >
                )

            }
        </>
    )
}

export default MainChat
