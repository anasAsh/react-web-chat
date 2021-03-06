// @ts-check
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, setPropTypes } from 'recompose';

import * as messageActions from '../../actions/messages';
import { getLatestRemote } from '../../utils/helpers';

const mapStateToProps = ({ messages }) => {
    let latestMessage = getLatestRemote(messages.messages);
    return {
        inputExpected: latestMessage && latestMessage.input_expected,
        buttons: latestMessage && latestMessage.buttons
    };
};

const mapDispatchToProps = dispatch => ({
    submitHandler: text => {
        dispatch(
            messageActions.messageSend({
                text: text
            })
        );
    }
});

const enhance = compose(
    setPropTypes({
        messages: PropTypes.object
    }),
    connect(mapStateToProps, mapDispatchToProps)
);

export const InputArea = ({
    InputComponent,
    submitHandler,
    inputExpected,
    MenuComponent,
    CheckboxMenuComponent,
    buttons
}) => {
    return (
        <div className="ChatContainer-input">
            {inputExpected === 'radio' && (
                <MenuComponent items={buttons} submitHandler={submitHandler} />
            )}
            {inputExpected === 'checkbox' && (
                <CheckboxMenuComponent items={buttons} submitHandler={submitHandler} />
            )}
            <InputComponent submitHandler={submitHandler} />
        </div>
    );
};

export default enhance(InputArea);
