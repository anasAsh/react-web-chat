// @ts-check
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AvatarContainer from '../AvatarContainer';
import MessageContainer from '../MessageContainer';
import Message from '../Message';

import * as messageActions from '../../actions/messages';

import Avatar from '../../../es/themes/default/components/Avatar/index';
import networkManager from '../../../es/utils/network';

const mapStateToProps = ({ messages }) => ({
    messages: messages.messages,
    messageQueue: messages.messageQueue
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    delayedMessageAdd: message => {
        dispatch(messageActions.delayedMessageAdd(message));
    },
    submitHandler: text => {
        dispatch(messageActions.messageSend({ text }));
    }
});

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0
        };
    }

    componentDidUpdate() {
        this._last &&
            this._last.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });

        let { messageQueue, delayedMessageAdd } = this.props;

        messageQueue.length && delayedMessageAdd(messageQueue[messageQueue.length - 1]);
    }

    render() {
        let { theme, messages, messageQueue, submitHandler } = this.props;
        return (
            <ul className="ChatContainer-content" ref={ref => (this._ref = ref)}>
                <div className="MessagesList">
                    {messages.map((message, i) => (
                        <li
                            key={i}
                            ref={ref => {
                                if (i === messages.length - 1) {
                                    this._last = ref;
                                }
                            }}
                        >
                            {message.origin === 'remote' && (
                                <AvatarContainer AvatarComponent={theme.AvatarComponent} />
                            )}
                            <MessageContainer key="text" {...message}>
                                {message.pages.map((page, i) => (
                                    <Message
                                        key={i}
                                        page={page}
                                        isLocal={message.origin === 'local'}
                                        {...theme}
                                        submitHandler={submitHandler}
                                    />
                                ))}
                            </MessageContainer>
                            {message.buttons &&
                                message.buttonStyle === 'default' && (
                                    <MessageContainer key="buttons" {...message}>
                                        {message.buttons.map((button, i) => (
                                            <theme.ButtonComponent
                                                key={i}
                                                text={button.text}
                                                onClick={() => submitHandler(button.text)}
                                            />
                                        ))}
                                    </MessageContainer>
                                )}
                            {messageQueue.length && i === messages.length - 1
                                ? [
                                      <AvatarContainer
                                          key="avatar"
                                          AvatarComponent={theme.AvatarComponent}
                                      />,
                                      <MessageContainer key="typing">
                                          <theme.TypingIndicatorComponent />
                                      </MessageContainer>
                                  ]
                                : null}
                        </li>
                    ))}
                </div>
            </ul>
        );
    }
}

MessageList.PropTypes = {
    messages: PropTypes.object,
    theme: PropTypes.shape({
        ImageComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
        InputComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
        MessageComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
        TextComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    })
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
