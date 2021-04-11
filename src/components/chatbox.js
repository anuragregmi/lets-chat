import React from 'react'

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props)
        this.messages = [
            {
                "text": "Hi sweetheart!",
                "user": {
                    "profile_picture": "https://source.unsplash.com/vpOeXr5wmR4/600x600",
                },
                "self": true
            },
            {
                "text": "Hello dear",
                "user": {
                    "profile_picture": "https://source.unsplash.com/otT2199XwI8/600x600",
                },
                "self": false
            }
        ]
    }
    render() {
        return (
            <div className="p-4 m-5 shadow-lg bg-white w-full max-w-screen-md h-full overflow-y-auto">
                <div className="h-1/6">
                    <div className="font-semibold text-2xl border-b pb-2">Let's Chat</div>
                </div>
                <div className="w-full px-5 flex flex-col justify-between h-4/6">

                    <div className="flex w-full flex-col mt-5">
                        {
                            this.messages.map((message, i) =>
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

                    </div>
                </div>
                <div className="w-full px-5 flex flex-col justify-between h-1/6">
                    <div className="w-full space-x-5">
                        <input
                            className="w-5/6 bg-gray-300 py-5 px-3 rounded-xl"
                            type="text"
                            placeholder="type your message here..."
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
