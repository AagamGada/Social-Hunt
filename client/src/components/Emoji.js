import React, { useState } from 'react';
import Picker from 'emoji-picker-react';

export default function Emoji(props) {

    const onEmojiClick = (event, emojiObject) => {
        props.handleEmoji(emojiObject.emoji)
    };

    return (
        <div style={{position: 'absolute'}}>
            <Picker onEmojiClick={onEmojiClick} />
        </div>
    );
}
