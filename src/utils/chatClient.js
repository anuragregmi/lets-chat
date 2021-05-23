import Peer from 'peerjs'
import {DefaultDict} from './collection'

export default class ChatClient {
    constructor(name, email, peerId=null) {
        this.name = name
        this.email = email
        this.peerId = peerId
        this.peer = null
        
        this.activeConnections = {}
        this.userDB = {}      
        this.messages = new DefaultDict([])

        this.onEventReceiveMessage = null
        this.onEventSendMessage = null
        this.onEventReceiveConnection = null
        this.onEventConnectionOpen = null
        this.onEventPeerConnected = null
        this.onEventError = null

        this.receiveConnection = this.receiveConnection.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)

    }

    getMeta() {
        return {
            name: this.name
        }
    }

    on(event, handler) {
        switch(event) {
            case 'send':
                this.onEventSendMessage = handler
                break
            case 'receive':
                this.onEventReceiveMessage = handler
                break                
            case 'connection':
                this.onEventReceiveConnection = handler
                break
            case 'open':
                this.onEventConnectionOpen = handler
                break
            case 'peer-connected':
                this.onEventPeerConnected = handler
                break
            case 'error':
                this.onEventError = handler               

        }
    }

    receiveConnection(connection) {
        this.activeConnections[connection.peer] = connection
        this.userDB[connection.peer] = {
            "full_name": connection.metadata.name || 'Friend',
            "profile_picture": "https://source.unsplash.com/vpOeXr5wmR4/600x600",
            "self": false
        }
        console.log(this.userDB)
        connection.on('data', (data) => this.receiveMessage(connection, data))
        if (this.onEventReceiveConnection) {
            this.onEventReceiveConnection(connection.peer)
        }
        
    }

    receiveMessage(connection, message) {
        this.messages[connection.peer] = this.messages[connection.peer].concat([{
            "text": message,
            "user": this.userDB[connection.peer],
            "self": false
        }])

        if (this.onEventReceiveMessage) {
            console.log("recvf message")
            this.onEventReceiveMessage(connection.peer, message)
        }
    }

    sendMessage(peerId, message) {
        let connection = this.activeConnections[peerId]
        if (connection) {
            connection.send(message)
            this.messages[connection.peer] = this.messages[connection.peer].concat([{
                "text": message,
                "user": this.userDB[connection.peer],
                "self": true
            }])
            console.log("updated to")
            console.log(this.messages)
            if (this.onEventSendMessage) {
                this.onEventSendMessage(peerId, message)
            }
        }
        else {
            alert("not connected")
        }
    }

    connect() {
        if (this.peerId) {
            console.log("connecting with id" + this.peerId)
            this.peer = new Peer(this.peerId, {host: '/', port: 3000, path: '/myapp'})
        }
        else {
            this.peer = new Peer({host: '/', port: 3000, path: '/myapp'})
        }
        this.peer.on('open', (id) => {
            console.log("connected with id" + id)
            this.peerId = id
            this.userDB[this.peerId] = {
                "full_name": this.name,
                "profile_picture": "https://source.unsplash.com/otT2199XwI8/600x600",
                "self": true
            }
            console.log(this.onEventConnectionOpen)
            if (this.onEventConnectionOpen) {
                this.onEventConnectionOpen(id)
            }
        })
        this.peer.on('connection', this.receiveConnection)
    }

    connectToPeer(peerId) {
        if (!this.peer){
            throw "Client not connected."
        }
        let connection = this.peer.connect(peerId, {metadata: this.getMeta()})
        connection.on('open', () => {
            this.activeConnections[peerId] = connection
            this.userDB[peerId] = {
                "full_name": "Friend",
                "profile_picture": "https://source.unsplash.com/vpOeXr5wmR4/600x600",
            }
            connection.on('data', data => this.receiveMessage(connection, data))
            if (this.onEventPeerConnected) {
                this.onEventPeerConnected(peerId)
            }
        })
        connection.on('error', (err) => {console.error(err)})
    }

}