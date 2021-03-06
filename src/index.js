import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import store from './store';

import { Provider } from 'react-redux';
import 'smoothscroll-polyfill';

import ChatContainer from './components/ChatContainer';
import defaultTheme from './themes/default';

import * as actionTypes from './actionTypes';
import feersumClient from 'rwc-feersum-client';
import networkManager from './utils/network';

/**
 * The main react component for React Web Chat
 * @param {Object} params - An object containing configuration parameters
 * @param {Object} params.theme - Custom theme
 * @param {Object} params.url - Chat server url to post messages to
 * @param {Object} params.client - Which client to use for network communication
 * @return {Object} React component
 */
export const ReactWebChatComponent = ({ theme, client = feersumClient, url }) => {
    networkManager.init({
        store,
        client,
        url
    });
    return (
        <Provider store={store}>
            <ChatContainer theme={{ ...defaultTheme, ...theme }} />
        </Provider>
    );
};

/**
 * The wrapping constructor module which renders {@link ReactWebChatComponent} to the target element
 */
class ReactWebChat {
    constructor(
        { theme, client, element, url } = {
            theme: defaultTheme,
            client: feersumClient,
            element,
            url: 'http://localhost:8080/echo'
        }
    ) {
        if (element && element.nodeName) {
            /**
             * @type {Element}
             */
            this.element = element;
            /**
             * @type {Object}
             */
            this.client = client;
            this.bindEventsToActions();
            ReactDOM.render(
                <ReactWebChatComponent theme={theme} client={client} url={url} />,
                element
            );
        } else {
            console.error(
                'React Web Chat: expected element passed to constructor to be a DOM node. Received instead: ',
                element
            );
        }
    }

    bindEventsToActions() {
        Object.values(actionTypes).map(type =>
            window.addEventListener(`rwc-dispatch-${type}`, ({ detail: { payload } }) =>
                store.dispatch({
                    type,
                    payload
                })
            )
        );
    }
}

export default ReactWebChat;
