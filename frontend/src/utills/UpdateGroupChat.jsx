import { Box, Button, Input, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { SettingsIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
import { useChat } from '../context/ChatProvider';
import SubAvatar from '../utills/SubAvatar';
import axios from 'axios'
import AvatarItem from '../utills/AvatarItem';
import _ from 'lodash';
import { Spinner } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'


const UpdateGroupChat = ({ groupChat, updateVisible, setUpdateVisible }) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [usersGroup, setUsersGroup] = useState([]);
    const { user, setSelectChat, setChats, chats } = useChat();
    const [rename, setRename] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [isSpiner, setIsSpiner] = useState(false);


    useEffect(() => {
        setUsersGroup(groupChat.users.filter(item => item._id !== user._id));
        setRename(groupChat.chatName);
    }, [groupChat, user]);

    const handleEnter = (e) => {
        if (e.key === 'Enter')
            handleOnSearch();
    }

    const handleUpdateRename = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        let { data } = await axios.put('/api/chat/rename', {
            chatId: groupChat._id,
            chatName: rename
        }, config);
        setSelectChat(data);
        let chatsNew = chats.filter(item => {
            if (item._id === data._id)
                item.chatName = data.chatName;
            return item;
        });
        setChats(chatsNew);
    }

    const handleOnSearch = async () => {
        setIsLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        const { data } = await axios.get(`/api/users?search=${search}`, config);
        let dataNew = _.differenceBy(data, usersGroup, '_id');
        setUsers(dataNew);
        setTimeout(() => {
            setIsLoading(false);
        }, 600);
    }

    const handleAdd = async (item) => {
        setIsSpiner(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        await axios.put('/api/chat/groupadd', {
            chatId: groupChat._id,
            userId: item._id
        }, config);
        setUsers(users.filter(user => user._id !== item._id));
        setUsersGroup([
            ...usersGroup,
            item
        ])
        setIsSpiner(false);

    }

    const handleRemove = async (item) => {
        if (groupChat.groupAdmin._id !== user._id && user._id !== item._id) {
            toast({
                position: 'top-right',
                render: () => (
                    <Box color='white' p={3} bg='red.400'>
                        You can't permission for delete user of group chat !!!
                    </Box>
                ),
            })
            return;
        }
        setIsSpiner(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        let { data } = await axios.put('/api/chat/groupremove', {
            chatId: groupChat._id,
            userId: item._id
        }, config);
        setUsers([
            ...users,
            item
        ])
        setUsersGroup(usersGroup.filter(user => user._id !== item._id));
        setIsSpiner(false);
        setSelectChat(null);
        setChats(chats.filter(item => item._id !== data._id));
    }


    return (
        <Box>
            <Button bg='transparent' __css={{
                p: '0'
            }} rightIcon={<SettingsIcon fontSize='18px' />}
                onClick={() => {
                    onOpen();
                }}
            />


            <Modal isOpen={isOpen} onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize='15px' fontStyle='italic' p='3'
                        display='flex' justifyContent='space-between' alignItems='center'
                    >
                        <Text>{groupChat.chatName}</Text>
                        <Text
                            marginRight='10%'
                            fontSize='calc(10px + 0.5vw)'
                            color='orange'
                        >Created by {groupChat.groupAdmin.name}</Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <FormControl mb='2'>
                                <FormLabel fontWeight='570' display='block'>Rename Group</FormLabel>
                                <Box display='flex' gap='2'>
                                    <Input value={rename} type='text' onChange={(e) => setRename(e.target.value)} />
                                    <Button onClick={() => handleUpdateRename()}>Update</Button>
                                </Box>
                            </FormControl>
                        </Box>

                        <Box width='100%' display='flex' gap='1' flexWrap='wrap'>
                            <Text fontWeight='570'>Members:</Text>
                            {
                                usersGroup.map(item => (
                                    <SubAvatar
                                        key={item._id}
                                        user={item} handleFunction={handleRemove}
                                    />
                                ))
                            }
                            {
                                isSpiner === true && <Spinner />
                            }
                        </Box>

                        <Box>
                            <FormControl mb='2'>
                                <FormLabel fontWeight='570' display='block'>Add members</FormLabel>
                                <Box display='flex' gap='2'>
                                    <Input placeholder='Search User ...'
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        onKeyDown={handleEnter}
                                    />
                                    <Button bg='#45C7C0'
                                        onClick={handleOnSearch}
                                        isLoading={isLoading}

                                    >Go</Button>
                                </Box>
                            </FormControl>
                        </Box>

                        <Box overflowY='scroll' maxHeight='100px'>
                            {
                                users?.length > 0 &&
                                users.map(item => (
                                    <AvatarItem
                                        key={item._id}
                                        user={item}
                                        handleFunction={handleAdd}
                                    />

                                ))
                            }
                        </Box>


                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    )
}

export default UpdateGroupChat
