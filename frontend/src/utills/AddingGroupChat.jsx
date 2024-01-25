import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Box,
    VStack,
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import axios from 'axios';
import { useChat } from '../context/ChatProvider';
import AvatarItem from '../utills/AvatarItem';
import _ from 'lodash';
import SubAvatar from '../utills/SubAvatar';
import { useToast } from '@chakra-ui/react'


const AddingGroupChat = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState('');
    const { user } = useChat();
    const [users, setUsers] = useState([]);
    const [usersChose, setUsersChose] = useState([]);
    const [chatName, setChatName] = useState('');
    const { chats, setChats, setSelectChat } = useChat();
    const toast = useToast()

    const handleSubmit = async () => {
        try {
            let requestBody = {
                name: chatName,
                users: usersChose.map(item => item._id)
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.token
                }
            }
            let { data } = await axios.post('/api/chat/group', JSON.stringify(requestBody), config);
            setChats([
                ...chats, ...data
            ])
            setSelectChat(...data);
            setChatName('');
            setSearch('');
            setUsers([]);
            setUsersChose([]);
            onClose();
        } catch (error) {
            toast({
                title: 'Create Your Groupchat is Fail !',
                description: "We've created your groupchat because there's have a few problem, Please do check",
                status: 'warning',
                duration: 4000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.token
                }
            }
            let { data } = await axios.get(`/api/users?search=${search}`, config);
            setUsers(_.differenceWith(data, usersChose, _.isEqual));
        }
        const debouncedFetchUsers = _.debounce(fetchUsers, 300);
        if (user) {
            debouncedFetchUsers();
        }
        return () => {
            // Cleanup effect if needed
            debouncedFetchUsers.cancel(); // Hủy bỏ debounce khi component unmount
        }
    }, [search])

    const handleFunction = (item) => {
        setUsersChose([
            ...usersChose, item
        ])
        setUsers(users.filter(user => user._id !== item._id))
    }

    const handleDeleteUser = (item) => {
        setUsersChose(usersChose.filter(user => user._id !== item._id));
        setUsers([...users, item]);
    }

    return (
        <div>
            <span onClick={onOpen}>
                {children}
            </span>


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader paddingY='10px'>Create new group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack
                            spacing={4}
                            align='stretch'
                        >
                            <Input
                                value={chatName} placeholder='Chat name ...'
                                onChange={(e) => setChatName(e.target.value)}
                                type='text'
                            />
                            <Input
                                value={search} placeholder='Search ...'
                                onChange={(e) => setSearch(e.target.value)}
                                type='text'
                            />
                            {
                                usersChose?.length > 0 &&
                                <Box display='flex' flexWrap='wrap'>
                                    {
                                        usersChose.map(item => (
                                            <SubAvatar
                                                key={item._id}
                                                user={item}
                                                handleFunction={handleDeleteUser}
                                            />
                                        ))
                                    }
                                </Box>

                            }
                            {users?.length > 0 &&
                                <Box overflowY='scroll' maxHeight='400px'>
                                    {
                                        users.map(item => (
                                            <AvatarItem
                                                key={item._id}
                                                user={item}
                                                handleFunction={handleFunction}
                                            />
                                        ))
                                    }
                                </Box>
                            }
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='teal' onClick={handleSubmit}>Create</Button>

                    </ModalFooter>

                </ModalContent>
            </Modal>
        </div >
    )
}

export default AddingGroupChat
