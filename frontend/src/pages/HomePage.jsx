import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'

import Login from '../components/auth/Login';
import Register from '../components/auth/Register'

const HomePage = () => {
    return (
        <Container centerContent minHeight='100vh' bgImage='/images/bglogin.avif' bgSize='cover'>
            <Box
                padding='4'
                bg='blue.400'
                color='black'
                mt='20px'
                maxWidth='500px'
                width='100%'
            >
                <Box bg='#ffffff' borderRadius='6px'
                >
                    <Text fontSize='xx-large' color='#333' align='center' mb='17px' p='10px'>
                        Talk-a-Tive
                    </Text>
                </Box>
                <Box bg='#ffffff' p='15px 10px 10px' borderRadius='6px'>
                    <Tabs variant='soft-rounded' colorScheme='green'>
                        <TabList>
                            <Tab
                                _selected={{ bg: '#BEE2F7', fontWeight: '700' }} width='50%' p='10px' border='none' borderRadius='30px'
                                bg='transparent'>Sign In</Tab>
                            <Tab
                                _selected={{ bg: '#BEE2F7', fontWeight: '700' }} width='50%' p='10px' border='none' borderRadius='30px'
                                bg='transparent'
                            >Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Login />
                            </TabPanel>
                            <TabPanel>
                                <Register />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </Container >
    )
}

export default HomePage
