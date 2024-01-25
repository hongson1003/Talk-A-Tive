
export const handleRenderMessage = (itemCurrent, itemPrev, user) => {
    if (!itemCurrent.sender) {
        return {
            position: 'RIGHT',
            content: itemCurrent.content,
            isSendIt: true,
            isSame: itemPrev?.sender?._id === user._id
        }
    }
    let content = itemCurrent.content;
    let sender = itemCurrent.sender;
    let isSendIt = sender._id === user._id;
    let position = '';
    if (isSendIt === false)
        position = 'LEFT';
    else
        position = 'RIGHT';
    let isSame = false || (itemPrev && sender._id === itemPrev.sender._id)
    return {
        position,
        content,
        avatar: sender.avatar,
        isSendIt,
        isSame
    }
}