import { Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import DrawerSidebar from "../../utills/DrawerSidebar";
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { Text } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons'
import { useChat } from "../../context/ChatProvider";
import ProfileUser from "../../utills/ProfileUser";
import { useHistory } from "react-router-dom";





const Navbar = () => {
    const { user, setSelectChat } = useChat();
    const { notifications, setNofitications } = useChat();
    const history = useHistory();
    const logout = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
        setSelectChat(null);
    }

    const handleOutChat = () => {
        setSelectChat('');
    }
    const handleClickNotification = (item) => {
        setSelectChat(item.chat);
        setNofitications([
            ...notifications.filter(message => message._id !== item._id)
        ])

    }

    return (
        <Box
            height='100%'
            bg='#ffffff'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
        >
            <DrawerSidebar>
                <Button
                    bg='transparent'
                    height={'100%'}
                    borderRadius={'0'}
                >
                    <SearchIcon />
                    <Text className="disable" style={{ marginLeft: '5px', fontSize: 'calc(10px + 0.5vw)' }}>Search Users</Text>
                </Button>
            </DrawerSidebar>
            <Text fontSize='calc(12px + 1.2vw)' cursor='pointer' onClick={handleOutChat}>Talk-A-Tive</Text>
            <Box height='100%'
                display='flex'
                alignItems='center'
            >
                <Menu>
                    <MenuButton
                        position='relative'
                        p={1}
                    >
                        <BellIcon color='#1C90ED' fontSize='19px' mx='5px' cursor='pointer' />
                        {
                            notifications.length > 0 &&
                            <Text
                                position='absolute'
                                top={0}
                                right={0}
                                fontSize='10px'
                                color='#ffffff'
                                fontWeight='bold'
                                bg='red'
                                width='16px'
                                height='16px'
                                borderRadius='50%'
                            >{notifications?.length}</Text>
                        }
                    </MenuButton>
                    {
                        notifications?.length > 0 &&
                        <MenuList>
                            {
                                notifications.map(item => (
                                    <MenuItem key={item._id}
                                        onClick={() => handleClickNotification(item)}
                                    >{`New message from ${item?.chat?.isGroupChat ? item.chat.chatName : item.sender.name}`}
                                    </MenuItem>
                                ))
                            }

                        </MenuList>
                    }
                </Menu>


                <Menu>
                    <MenuButton
                        as={Button} rightIcon={<ChevronDownIcon />} bg='transparent'
                        height='100%' borderRadius='0'
                    >
                        <Avatar width='calc(20px + 3vh)' height='calc(20px + 3vh)' src={user?.avatar} />
                    </MenuButton>
                    <MenuList>
                        <ProfileUser user={user}>
                            <MenuItem>Xem thông tin</MenuItem>
                        </ProfileUser>
                        <MenuItem onClick={() => logout()}>Đăng xuất</MenuItem>
                    </MenuList>

                </Menu>
            </Box>
        </Box >
    )
}

export default Navbar;