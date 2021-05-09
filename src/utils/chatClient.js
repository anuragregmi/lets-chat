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

        this.receiveConnection = this.receiveConnection.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
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

        }
    }

    receiveConnection(connection) {
        this.activeConnections[connection.peer] = connection
        this.userDB[connection.peer] = {
            "full_name": "Friend",
            "profile_picture": "https://source.unsplash.com/vpOeXr5wmR4/600x600",
        }
        connection.on('data', (data) => this.receiveMessage(connection, data))
        if (this.onEventReceiveConnection) {
            this.onEventReceiveConnection(connection)
        }
        
    }

    receiveMessage(connection, message) {
        this.messages[connection.peer].push({
            "text": message,
            "user": this.userDB[connection.peer],
            "self": false
        })
        if (this.onEventReceiveMessage) {
            this.onEventReceiveMessage(connection, message)
        }
    }

    sendMessage(peerId, message) {
        if (this.activeConnections[peerId]) {
            let connection = this.activeConnections[peerId]
            connection.send(message)
            this.messages[connection.peer].push({
                "text": message,
                "user": this.userDB[connection.peer],
                "self": true
            })
            if (this.onEventSendMessage) {
                this.onEventSendMessage()
            }
        }
        // raise error
    }

    connect() {
        if (this.peerId) {
            this.peer = new Peer(this.PeerId)
        }
        else {
            this.peer = new Peer()
        }
        this.peer.on('open', (id) => {
            this.peerId = id
            this.userDB[this.peerId] = {
                "full_name": this.name,
                "profile_picture": "https://source.unsplash.com/otT2199XwI8/600x600"
            }
            if (this.onConnectionOpen) {
                this.onConnectionOpen(this.peer)
            }
        })
        this.peer.on('connection', this.receiveConnection)
    }

    connectToPeer(peerId) {
        if (!this.peer){
            throw "Client not connected."
        }
        let connection = this.peer.connect(peerId)
        connection.on('open', () => {
            console.log("open")
            this.activeConnections[peerId] = connection
            this.userDB[peerId] = {
                "full_name": "Friend",
                "profile_picture": "https://source.unsplash.com/vpOeXr5wmR4/600x600",
            }
            connection.on('data', data => this.receiveMessage(connection, data))
            if (this.onEventPeerConnected) {
                this.onEventPeerConnected(connection)
            }
        })
        
    }

}