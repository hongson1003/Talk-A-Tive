import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { } from '@chakra-ui/react'


const SubAvatar = ({ user, handleFunction }) => {
    return (
        <Box display='flex' justifyContent='center' alignItems='center' gap='1'
            bg='violet' p='1' maxWidth='140px' width='fit-content' borderRadius='15px'
            marginBottom='2' mx='1'
        >
            <Avatar width='20px' height='20px' src={user.avatar} />
            <Text fontSize='10px'>{user.name}</Text>
            <button onClick={() => handleFunction(user)}>X</button>
        </Box >
    )
}

export default SubAvatar
