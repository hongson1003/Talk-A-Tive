import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Button, Input, Text, Toast, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useChat } from '../../context/ChatProvider'
import ProfileUser from '../../utills/ProfileUser';
import UpdateGroupChat from '../../utills/UpdateGroupChat';
import {
    FormControl,
} from '@chakra-ui/react'
import axios from 'axios';
import ChatContent from '../../components/ChatContent';
import { Spinner } from '@chakra-ui/react';
import io from 'socket.io-client';
import _ from 'lodash';
import ReactLoading from 'react-loading';
import { PhoneIcon } from '@chakra-ui/icons'
import { Howl } from 'howler';
import { Peer } from "peerjs";
import { v4 as uuidv4 } from 'uuid';
let myPeer = null;
let videoCallWindow = null;
const ENDPOINT = 'http://localhost:8080'
// const ENDPOINT = 'https://talk-a-tive-fws4.onrender.com'
var socket, selectChatCompare;


const SingleChat = ({ size }) => {
    const { selectChat, setSelectChat, user, notifications, setNofitications } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const { isConnectedSocket, setIsConnectedSocket } = useChat(false);
    const [typing, setTyping] = useState(false);
    const toast = useToast();
    const sound = useMemo(() => {
        return (
            new Howl({
                src: ['/mp3/lannaylaanhchiuthuaemroi.mp3']
            })
        )
    });
    const [ids, setIds] = useState([]);


    useEffect(() => {
        setIsLoadingChats(true);
        fetchMessages(() => {
            setIsLoadingChats(false);
            selectChatCompare = selectChat;
        });

    }, [selectChat]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => {
            setIsConnectedSocket(true)
        });
        socket.on('typing', () => {
            setTyping(true)
        });
        socket.on('stop typing', () => {
            setTyping(false)
        });



    }, [])

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectChatCompare || selectChatCompare._id !== newMessageReceived.chat._id) {
                // nofitication
                if (notifications.includes(newMessageReceived)) return;
                else {
                    setNofitications([
                        newMessageReceived, ...notifications
                    ])
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
        return () => {
            socket.removeListener('message received');
        }
    }, [messages])



    const handleRedirect = () => {
        setSelectChat('');
    }

    const handleGetSender = (chat) => {
        let userSender = null;
        if (chat.isGroupChat)
            userSender = chat;
        else {
            userSender = chat.users.filter(item => item._id !== user._id)[0];
        }
        userSender.name = userSender.chatName || userSender.name;
        return userSender;
    }

    const handleSendMessage = async (e) => {
        if (!newMessage)
            return;
        socket.emit('stop typing');
        if (e.key === 'Enter' || e.type === 'click') {
            let random = Math.random();
            let oldMessage = [...messages];
            setMessages([
                ...messages,
                {
                    _id: random,
                    content: newMessage,
                }
            ]);
            setNewMessage('');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user?.token
                }
            }
            let { data } = await axios.post('/api/message/', {
                chatId: selectChat._id,
                content: newMessage,
            }, config);
            setMessages([
                ...oldMessage,
                data
            ]);
            socket.emit('new message', data);
        }
    }


    const fetchMessages = async (callback) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + user?.token
            }
        }
        let { data } = await axios.get(`/api/message/${selectChat._id}`, config);
        setMessages(data);
        callback();
        socket.emit('join chat', selectChat._id);
    }

    const debouncedHandleTyping = _.debounce(() => {
        socket.emit('stop typing', selectChat._id);
    }, 600);
    const hookCallback = useCallback(debouncedHandleTyping, [isConnectedSocket]);

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!isConnectedSocket) return;
        if (!typing)
            socket.emit('typing', selectChat._id);
        hookCallback();
    };

    const openVideoCallWindow = async (isReceived, callback) => {
        let stream = null;
        videoCallWindow = window.open(undefined, 'VideoCallWindow', 'width=800,height=600');
        if (videoCallWindow) {
            if (!isReceived) {
                sound.play();
            }
            buildWindowCall(videoCallWindow, handleGetSender(selectChat), isReceived);
            stream = await callback();

            socket.on('sound-off', () => {
                sound.stop();
            })

            videoCallWindow.addEventListener('beforeunload', () => {
                if (stream) {
                    const tracks = stream.getTracks();
                    // Dừng tất cả các tracks
                    tracks.forEach(track => track.stop());
                }
                sound.stop();
                // Hủy đối tượng PeerJS
                videoCallWindow.close();
                videoCallWindow = null;
                myPeer.disconnect();
                myPeer.destroy();
            })
        } else {
            toast({
                title: 'Do not call phone',
                description: "Please admit permission for user",
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        myPeer = new Peer(uuidv4(), {
            // host: 'https://talk-a-tive-fws4.onrender.com',
            host: '/',
            port: 3001,
        });
        myPeer.on('open', (id) => {
            socket.emit('join-call', selectChat._id, id);
        });
        myPeer.on('error', (error) => {
            console.error('PeerJS error:', error);
        });

        socket.on('user-connected', userId => {
            setIds([
                ...ids, userId
            ])
        });
        myPeer.on('disconnected', () => {
            console.log('chưa chắc đã connected đâu')

        });

        myPeer.on('call', call => {
            try {
                openVideoCallWindow(true, async () => {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    })
                    // lấy video của đối phương
                    const newDocument = videoCallWindow.document;
                    // const top = newDocument.getElementById('top');
                    // const video = newDocument.createElement('video');
                    // video.muted = 'muted'
                    // addVideo(top, video, stream);
                    socket.on('play-video', () => {
                        // hiển thị video chính mình
                        const myDiv = newDocument.getElementById('myDiv');
                        const video2 = newDocument.createElement('video');
                        video2.style.width = '150px';
                        video2.style.height = '150px';
                        addVideo(myDiv, video2, stream);
                        call.answer(stream);
                        socket.emit('play-video-one', selectChat._id);
                    })
                    call.on('stream', userVideoStream => {
                        const newDocument = videoCallWindow.document;
                        const top = newDocument.getElementById('top');
                        const video = newDocument.createElement('video');
                        addVideo(top, video, userVideoStream);
                    })
                    return stream;
                })
            } catch (error) {
                console.log(error)
            }
        })

        return () => {
            myPeer.removeListener('open')
            myPeer.removeListener('call')
            myPeer.removeListener('stream')

        }
    }, [selectChat]);

    const handleNewCall = () => {
        openVideoCallWindow(false, async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            await connectToNewUser(ids[0], stream);
            return stream;
        });
    }


    async function connectToNewUser(userId, stream) {
        const call = myPeer.call(userId, stream);
        call.on('stream', userVideoStream => {
            // thêm stream của đói phương

            const newDocument = videoCallWindow.document;
            const top = newDocument.getElementById('top');
            const video1 = newDocument.createElement('video');
            video1.muted = 'muted'
            addVideo(top, video1, userVideoStream);
            // thêm stream của bạn
            const myDiv = newDocument.getElementById('myDiv');
            const video2 = newDocument.createElement('video');
            video2.style.width = '150px';
            video2.style.height = '150px';

            video2.muted = 'muted'
            addVideo(myDiv, video2, stream);
            video2.play();
        })
        call.on('close', () => {
            videoCallWindow.close();
            videoCallWindow = null;
            myPeer.disconnect();
            myPeer.destroy();
        })

    }

    const buildWindowCall = (videoCallWindow, user, isReceived) => {
        const document = videoCallWindow.document;
        const container = document.createElement('div');
        const body = document.body;
        body.style.margin = '0'
        container.style.width = '100%'
        container.style.height = '100vh'
        container.style.backgroundColor = 'grey'
        container.style.position = 'relative';
        body.append(container);

        const yourDiv = document.createElement('div');
        yourDiv.style.position = 'absolute';
        yourDiv.style.top = 0;
        yourDiv.style.left = 0;
        yourDiv.style.right = 0;
        yourDiv.style.bottom = 0;
        yourDiv.style.backgroundOrigin = 'center';
        yourDiv.style.backgroundSize = 'cover';
        yourDiv.style.display = 'flex'
        yourDiv.style.flexDirection = 'column'
        yourDiv.style.alignItems = 'center'
        yourDiv.style.justifyContent = 'space-between'

        yourDiv.style.padding = '50px'
        container.append(yourDiv);

        const myDiv = document.createElement('div');
        myDiv.style.position = 'absolute';
        myDiv.style.top = 0;
        myDiv.style.right = 0;
        myDiv.style.width = '150px'
        myDiv.style.height = '150px';
        myDiv.setAttribute('id', 'myDiv');
        container.append(myDiv);
        // add avatar for yourDiv
        const avatar = document.createElement('div');
        const yourDivTop = document.createElement('div');
        yourDiv.append(yourDivTop);
        yourDivTop.append(avatar);
        yourDivTop.style.display = 'flex'
        yourDivTop.style.flexDirection = 'column'
        yourDivTop.style.justifyContent = 'space-around'
        yourDivTop.style.alignItems = 'center'
        yourDivTop.setAttribute('id', 'top');
        avatar.style.width = '200px';
        avatar.style.height = '200px';
        avatar.style.borderRadius = '50%'
        avatar.style.backgroundImage = `url('${user.avatar}')`
        avatar.style.backgroundSize = 'contain';

        const loading = document.createElement('p');
        loading.style.color = '#ffffff'
        loading.style.fontStyle = 'italic'
        loading.innerHTML = 'đang gọi ...';
        yourDivTop.append(loading);

        const yourDivBottom = document.createElement('div');
        yourDiv.append(yourDivBottom)
        yourDivBottom.style.display = 'flex'
        yourDivBottom.style.justifyContent = 'space-evenly'
        yourDivBottom.style.alignItems = 'center'
        const call = document.createElement('div');
        const mic = document.createElement('div');
        const speaker = document.createElement('div');
        call.style.width = '50px'
        call.style.height = '50px'
        call.style.backgroundImage = 'url("/images/capmay.png")';
        call.style.backgroundSize = 'contain'
        call.style.cursor = 'pointer'
        mic.style.width = '50px'
        mic.style.height = '50px'
        mic.style.backgroundImage = 'url("/images/tatmic.png")';
        mic.style.backgroundSize = 'contain'
        mic.style.cursor = 'pointer'
        speaker.style.width = '30px'
        speaker.style.height = '30px'
        speaker.style.cursor = 'pointer'
        speaker.style.backgroundImage = 'url("/images/tatloa.png")';
        speaker.style.backgroundSize = 'contain'
        yourDivBottom.style.width = '200px'
        yourDivBottom.style.gap = 1
        const callOk = document.createElement('div');
        callOk.style.width = '50px'
        callOk.style.height = '50px'
        callOk.style.backgroundImage = 'url("/images/okcall.png")';
        callOk.style.backgroundSize = 'contain'
        callOk.style.cursor = 'pointer'
        if (isReceived) {
            yourDivBottom.append(callOk);
            yourDivBottom.append(call);
        } else {
            yourDivBottom.append(mic);
            yourDivBottom.append(call);
            yourDivBottom.append(speaker);
        }

        callOk.addEventListener('click', () => {
            yourDivBottom.removeChild(callOk);
            yourDivBottom.removeChild(call);
            yourDivBottom.append(mic);
            yourDivBottom.append(call);
            yourDivBottom.append(speaker);
            // login xử lý video đây nè
            // tắt chuông reo
            while (yourDivTop.firstChild) {
                yourDivTop.removeChild(yourDivTop.firstChild);
            };
            socket.emit('sound-off', selectChat._id);
            socket.emit('play-video', selectChat._id);
        })

    }

    const addVideo = (parent, video, stream) => {
        while (parent && parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        video.srcObject = stream;
        video.autoplay = true;
        socket.on('play-video', () => {
            video.play();
        });

        parent.append(video);
    };






    return (
        <>
            <Box
                height='100%'
            >
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    p='0.5'
                    px='5'
                >
                    <Button
                        size='sm'
                        px='2' leftIcon={<ArrowBackIcon fontSize='25px' />}
                        onClick={() => handleRedirect()}
                        display={size < 800 ? 'flex' : 'none'}
                    />
                    <Text style={{ fontWeight: '650', display: 'block', fontSize: 'calc(12px + 0.7vw)' }}>{handleGetSender(selectChat).name}</Text>
                    <PhoneIcon
                        marginLeft='auto'
                        marginRight='20px'
                        cursor='pointer'
                        onClick={() => handleNewCall()}
                    />
                    {
                        !selectChat.isGroupChat ?
                            <ProfileUser user={handleGetSender(selectChat)}></ProfileUser> :
                            <span >
                                <UpdateGroupChat
                                    key={Math.random()}
                                    groupChat={selectChat}
                                />
                            </span>
                    }
                </Box>
                <Box p='3'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    flexDir='column'
                    minHeight='calc(100% - 40px)'
                    height='calc(100% - 40px)'
                >
                    <Box width='99%' bg='#E8E8E8'
                        display='flex'
                        flexDir='column'
                        maxHeight='100%'
                        height='100%'
                        borderRadius='7px'
                        position='relative'
                    >
                        {
                            isLoadingChats ? <Spinner margin='auto' /> :
                                <>
                                    <ChatContent messages={messages} />
                                    {
                                        typing && <ReactLoading
                                            type='bubbles' color={'#1A1C29'} height={40} width={50}
                                        />
                                    }
                                </>
                        }
                        <FormControl onKeyDown={handleSendMessage}
                            position='absolute'
                            bottom='0'
                            display='flex'
                            gap='1'
                        >
                            <Input bg='#EDF2F7' placeholder=' Enter ...' value={newMessage} type='text' onChange={(e) => handleTyping(e)}
                            />
                            <Button onClick={handleSendMessage}>Send</Button>
                        </FormControl>
                    </Box>
                </Box >
            </Box >
        </>
    )
}

export default SingleChat
