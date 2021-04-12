import React from 'react'
import Peer from 'peerjs'

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props)

        var messages = this.getMessageHistory(props.peerId)


        this.peer = null
        this.connection = null
        this.state = {
            peerId: props.peerId ? props.peerId : 'N/A',
            messages: messages
        }

        // bind event listeners
        this.onKeyPressPeerBox = this.onKeyPressPeerBox.bind(this)
        this.onKeyPressSendMessageBox = this.onKeyPressSendMessageBox.bind(this)
        this.receiveConnection = this.receiveConnection.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
    }

    getMessageHistory(peerId) {
        return []
    }

    onKeyPressPeerBox(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) {
            e.preventDefault();
            if (!this.state.peerId | this.state.peerId === 'N/A') {
                alert("Not connected to server yet. Please wait.")
                return
            }
            this.connectPeer(e.target.value)
        }

    }

    onKeyPressSendMessageBox(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) {
            e.preventDefault();
            if (!(this.connection && this.connection.peer)) {
                alert("Not connected to peer yet. Can not send message.")
                return
            }
            this.sendMessage(e.target.value)
            e.target.value = ""
        }
    }

    setConnectedId(id) {
        document.getElementById("peer-input").value = id
    }

    sendMessage(text) {
        var message = {
            "text": text,
            "user": {
                "profile_picture": "https://source.unsplash.com/vpOeXr5wmR4/600x600",
            },
            "self": true
        }
        this.connection.send(text)
        this.setState({ 'messages': this.state.messages.concat([message]) })
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });

    }

    receiveMessage(text) {
        var message = {
            "text": text,
            "user": {
                "profile_picture": "https://source.unsplash.com/otT2199XwI8/600x600",
            },
            "self": false
        }
        this.setState({ 'messages': this.state.messages.concat([message]) })
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    connectPeer(peerId) {
        var conn = this.peer.connect(peerId)
        conn.on('error', (error) => { alert(error.type) })
        conn.on('open', () => {
            this.connection = conn
            conn.on('data', this.receiveMessage)
        })
    }
    receiveConnection(conn) {
        this.setConnectedId(conn.peer)
        this.connection = conn
        conn.on('data', this.receiveMessage)
    }

    componentDidMount() {
        this.peer = new Peer()
        this.peer.on('open', (id) => { this.setState({ peerId: id }) })
        this.peer.on('connection', this.receiveConnection)
    }

    render() {
        return (
            <div className="p-4 m-5 shadow-lg bg-white w-full max-w-screen-md h-full">
                <div className="h-1/6">
                    <div className="border-b pb-2">
                        <div className="flex">
                            <div className="flex w-1/6">
                                <span className="font-semibold flex-col text-2xl">Let's Chat</span>
                            </div>
                            <div className="flex w-5/6 justify-end">
                                <div className="text-gray-400 italic py-1">
                                    <p>Your Id:</p>
                                    <p>{this.state.peerId}</p>
                                </div>
                                <div className="text-gray-400 italic ml-3 w-2/6">
                                    <p>Connected to:</p>
                                    <input className="mt-1 p-1 border w-full" placeholder="Peer's Id" id="peer-input"
                                        onKeyPress={this.onKeyPressPeerBox}></input>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="w-full px-5 flex flex-col justify-between h-4/6  overflow-y-auto">

                    <div className="flex w-full flex-col mt-5">
                        {
                            this.state.messages.map((message, i) =>
                                message.self === true
                                    ? <div className="flex justify-end mb-4" key={i}>

                                        <div
                                            className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                        >
                                            {message.text}
                                        </div>
                                        <img
                                            src={message.user.profile_picture}
                                            className="object-cover h-8 w-8 rounded-full"
                                            alt=""
                                        />
                                    </div>
                                    :
                                    <div className="flex justify-start mb-4" key={i}>
                                        <img
                                            src={message.user.profile_picture}
                                            className="object-cover h-8 w-8 rounded-full"

                                            alt=""
                                        />
                                        <div
                                            className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                            )
                        }
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                </div>
                <div className="w-full px-5 flex flex-col justify-between h-1/6">
                    <div className="w-full space-x-5">
                        <input
                            className="w-5/6 bg-gray-300 py-5 px-3 rounded-xl"
                            type="text"
                            placeholder="type your message here..."
                            onKeyPress={this.onKeyPressSendMessageBox}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="inline-block h-10 w-10 transform rotate-90 hover:text-blue-600"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}
