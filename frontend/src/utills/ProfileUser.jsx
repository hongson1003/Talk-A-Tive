import { ViewIcon } from '@chakra-ui/icons';
import { Button, useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

const ProfileUser = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {
                !children ? <ViewIcon cursor='pointer' onClick={onOpen} /> :
                    <span onClick={onOpen}>{children}</span>
            }
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{user?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                        py='30px'
                    >
                        <Avatar size='2xl' name='Segun Adebayo' src={user?.avatar} />{' '}
                        <Text mt='15px' fontSize='2xl'>{user?.email}</Text>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}
export default ProfileUser;