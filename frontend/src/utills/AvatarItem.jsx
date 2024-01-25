import { Avatar, Box, Text } from "@chakra-ui/react";


const AvatarItem = ({ user, handleFunction }) => {
    return (
        <>
            <Box
                display='flex' alignItems='center' gap='4' p='10px' _hover={{ backgroundColor: '#75A99C', cursor: 'pointer' }}
                onClick={() => handleFunction(user)}
            >
                <Avatar size='sm' src={user?.avatar} />
                <div>
                    <Text size='sx'>{user?.email}</Text>
                    <Text fontSize='12px'>{user?.name}</Text>
                </div>
            </Box>
        </>
    )
}

export default AvatarItem;