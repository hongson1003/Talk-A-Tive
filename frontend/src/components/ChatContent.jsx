import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatProvider';
import { handleRenderMessage } from '../utills/handleMessage';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

const ChatContent = ({ messages }) => {
    const { user, selectChat } = useChat();
    const [scrollEl, setScrollEl] = useState();

    useEffect(() => {
        if (scrollEl) {
            scrollEl.scrollTop = scrollEl.scrollHeight
        }
    }, [scrollEl, messages]);



    return (
        <Box height='87%'>
            <PerfectScrollbar
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '100%',
                }}
                containerRef={ref => {
                    setScrollEl(ref);
                }}

            >
                {messages.map((message, index) => {
                    let { position, content, avatar, isSendIt, isSame } =
                        handleRenderMessage(message, messages[index - 1], user);
                    return (
                        <Box
                            key={message._id}
                            display='flex'
                            justifyContent={position === 'LEFT' ? 'flex-start' : 'flex-end'}
                            alignItems='center'
                            gap='2'
                            width='100%'
                            px='3'
                            my='1'
                        >
                            {!isSendIt && (
                                <Box width='30px' height='30px'>
                                    {!isSame && <Avatar size='sm' src={avatar} />}
                                </Box>
                            )}
                            <Text
                                bg={position === 'LEFT' ? '#F07661' : '#518FF5'}
                                borderRadius='15px'
                                p='1'
                                px='3'
                                maxWidth='100%'
                            >
                                {content}
                            </Text>
                        </Box>
                    );
                })}
            </PerfectScrollbar>
        </Box>
    );
};

export default ChatContent;
