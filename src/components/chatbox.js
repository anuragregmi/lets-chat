import React from 'react'
import ChatClient from '../utils/chatClient'

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props)

        let messages = this.getMessageHistory(props.peerId)
        this.chatClient = null

        this.currentPeer = null
        this.state = {
            peerId: window.localStorage.getItem('peerId'),
            messages: messages,
            currentPeer: null,
            fullName: window.localStorage.getItem('fullName'),
            activeUsers: {}
        }

        // bind event listeners
        this.onKeyPressPeerBox = this.onKeyPressPeerBox.bind(this)
        this.onKeyPressSendMessageBox = this.onKeyPressSendMessageBox.bind(this)
        this.onSendMessageButtonClick = this.onSendMessageButtonClick.bind(this)
    }

    getMessageHistory(peerId) {
        return []
    }

    onKeyPressPeerBox(e) {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) {
            e.preventDefault();
            if (!this.state.peerId | this.state.peerId === 'N/A') {
                alert("Not connected to server yet. Please wait.")
                return
            }
            const peerId = e.target.value
            e.target.value = "connecting..."
            this.connectPeer(peerId)
        }

    }

    onKeyPressSendMessageBox(e) {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) {
            e.preventDefault();
            this.sendMessage(e.target.value)
            e.target.value = ""
        }
    }
    onSendMessageButtonClick() {
        let el = document.querySelector("#composeMessage")
        this.sendMessage(el.value)
        el.value = ""
    }

    setConnectedId(id) {
        console.log(this,this.chatClient.userDB)
        this.setState({currentPeer: id, activeUsers: this.chatClient.userDB})
        document.getElementById("peer-input").value = id
    }

    sendMessage(text) {
        this.chatClient.sendMessage(this.state.currentPeer, text)

    }

    connectPeer(peerId) {
        this.chatClient.connectToPeer(peerId)
    }

    componentDidMount() {
        let fullName = this.state.fullName
        if (! this.state.fullName) {
            fullName = prompt("Full Name")
            window.localStorage.setItem('fullName', fullName)
        }
        this.setState({'fullName': fullName})

        this.chatClient = new ChatClient(fullName, null, this.state.peerId)
        this.chatClient.on('open', (id) => {
                this.setState({ peerId: id, activeUsers: this.chatClient.userDB })
                window.localStorage.setItem('peerId', id)
            }
        )
        console.log(this.state.activeUsers)
        this.chatClient.on('connection', (peer) => this.setConnectedId(peer))
        this.chatClient.on('peer-connected', (peer) => this.setConnectedId(peer))
        this.chatClient.on('receive', (id, message) => {
            console.log(this.chatClient.messages)
            this.setState({ messages: this.chatClient.messages[id]})
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });

        })
        this.chatClient.on('send', (id, message) => {
            this.setState({ messages: this.chatClient.messages[id]})
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });

        })
        this.chatClient.connect()

    }

    render() {
    
        return <div className="flex h-screen antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-auto">
                {/* Left Nav */}
                <div className="flex flex-col py-8 pl-6 pr-2 w-72 bg-white flex-shrink-0 overflow-y-scroll">
                    {/* Brand Details */}
                    <div className="flex flex-row items-center justify-center h-12 w-full">
                        <div
                            className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                ></path>
                            </svg>
                        </div>
                        <div className="ml-2 font-bold text-2xl">Let's Chat</div>
                    </div>
                    {/* End Brand Details */}
                    {/* Avatar Section */}
                    <div
                        className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
                    >
                        <div className="h-20 w-20 rounded-full border overflow-hidden">
                            <img
                                src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                                alt="Avatar"
                                className="h-full w-full"
                            />
                        </div>
                        <div className="text-sm font-semibold mt-2">{this.state.fullName}</div>
                        <div className="flex flex-row items-center mt-3">
                            <div
                                className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full"
                            >
                                <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
                            </div>
                            <div className="leading-none ml-1 text-xs">Active</div>
                        </div>
                        <div className="flex flex-col items-center mt-3">
                                    <p><b>Your Id</b></p>
                                    <p>{this.state.peerId}</p>
                        </div>
                        <div className="flex flex-col items-center mt-3">
                                    <p>Connected to</p>
                                    <input className="mt-1 p-1 border w-full" placeholder="Peer's Id" id="peer-input"
                                        onKeyPress={this.onKeyPressPeerBox}></input>
                        </div>
                    </div>
                    {/* End Avatar Section */}
                    {/* Active Conversations */}
                    <div className="flex flex-col mt-8">
                        <div className="flex flex-row items-center justify-between text-xs">
                            <span className="font-bold">Active Conversations</span>
                            <span
                                className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
                            >
                                4
                            </span>
                        </div>
                        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-auto overflow-y-auto">
                            {
                               Object.keys(this.state.activeUsers).map((key)=>{
                                   let user = this.state.activeUsers[key]
                                   console.log(user.self)
                                   return !user.self ?<button
                                        className={`flex flex-row items-center ${key === this.state.currentPeer? 'bg-gray-200': 'hover:bg-gray-100'} } rounded-xl p-2`}
                                        key={key}
                                    >
                                        <div
                                            className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full"
                                        >
                                            {user.full_name[0]}
                                        </div>
                                        <div className="ml-2 text-sm font-semibold">{user.full_name}</div>
                                        {/* <div
                                            className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                                        >
                                            2
                                        </div> */}
                                    </button> : ''
                                })
                            }
                          </div>
                    </div>
                    {/* End Active Conversations*/}
                </div>
                {/* End Left Nav */}
                {/* Conversation */}
                <div className="flex flex-col flex-auto h-full p-6">
                    <div
                        className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                    >
                        <div className="flex flex-col h-full overflow-x-auto mb-4">
                            <div className="flex flex-col h-full">
                                <div className="grid grid-cols-12 gap-y-2">
                                    {
                                        this.state.messages.map((message, i) =>
                                            message.self === true
                                                ?
                                                <div className="col-start-6 col-end-13 p-3 rounded-lg" key={i}>
                                                    <div className="flex items-center justify-start flex-row-reverse">
                                                        <div
                                                            className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                        >
                                                            {message.user.full_name[0]}
                                                        </div>
                                                        <div
                                                            className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                                        >
                                                            <div>{message.text}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :

                                                <div className="col-start-1 col-end-8 p-3 rounded-lg" key={i}>
                                                    <div className="flex flex-row items-center">
                                                        <div
                                                            className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                        >
                                                            {message.user.full_name[0]}
                                                        </div>
                                                        <div
                                                            className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                                        >
                                                            <div>{message.text}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                        )
                                    }
                                    <div style={{ float: "left", clear: "both" }}
                                        ref={(el) => { this.messagesEnd = el; }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Send part */}
                        <div
                            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                        >
                            <div>
                                <button
                                    className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-grow ml-4">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                        onKeyPress={this.onKeyPressSendMessageBox}
                                        id="composeMessage"
                                    />
                                    {/* <button
                                        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                    </button> */}
                                </div>
                            </div>
                            <div className="ml-4">
                                <button
                                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                                    onClick={this.onSendMessageButtonClick}
                                >
                                    <span>Send</span>
                                    <span className="ml-2">
                                        <svg
                                            className="w-4 h-4 transform rotate-45 -mt-px"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        {/* End Send part */}
                    </div>
                </div>
                {/* End Conversation */}
            </div>
        </div>
    }
}