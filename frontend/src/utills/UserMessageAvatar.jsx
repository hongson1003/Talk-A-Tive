import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useChat } from '../context/ChatProvider';

const UserMessageAvatar = ({ chatProps, handleFunction }) => {
    const { user } = useChat();
    const { selectChat } = useChat();
    const handleGetNameOneToOne = (chat) => {
        let name = '';
        if (!chat.isGroupChat)
            name = chat?.users?.filter(item => item._id !== user._id).map(item => item.name)[0];
        else
            name = chat.chatName;
        return name;
    }
    const handleGetAvatar = (chatProps) => {
        if (chatProps.isGroupChat)
            return '/images/group.jpg';
        let avatar = chatProps?.users?.filter(item => item._id !== user._id)?.[0]?.avatar;
        return avatar;
    }
    return (
        <Box
            display='flex' alignItems='center' gap='4' p='10px' _hover={{ backgroundColor: '#75A99C', cursor: 'pointer', }}
            borderRadius='8px'
            backgroundColor={selectChat?._id === chatProps._id ? '#4DC8C3' : ''}
            onClick={() => handleFunction(chatProps)}
        >
            <Avatar size='sm' src={handleGetAvatar(chatProps)} />
            <div>
                <Text fontSize='calc(12px + 0.4vw)' fontWeight='700'>{handleGetNameOneToOne(chatProps)}</Text>
                {
                    chatProps.latestMessage &&
                    <Text fontSize='12px'>{chatProps.latestMessage.sender.name}: {
                        (chatProps.latestMessage.content.length < 35) ?
                            chatProps.latestMessage.content :
                            chatProps.latestMessage.content.substr(0, 30) + ' ...'
                    }</Text>
                }
            </div>
        </Box >
    )
}

export default UserMessageAvatar
