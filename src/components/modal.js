import React from "react";

export default class Modal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: props.title || '',
            buttonText: props.buttonText || props.title || '',
            showModal: false
        }
        
        this.onSuccess = this.props.onSuccess
        this.validate = this.props.validate

    }
    setShowModal(value) {
        this.setState({showModal: value})
    }
    render() {
        return (
            <>
                <button
                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => this.setShowModal(true)}
                >
                    {this.state.buttonText}
      </button>
                {this.state.showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            {this.state.title}
                  </h3>
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => this.setShowModal(false)}
                                        >
                                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                ×
                    </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    { this.props.children}
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => this.setShowModal(false)}
                                        >
                                            Close
                  </button>
                                        <button
                                            className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={
                                                () => {
                                                    if (this.validate && !this.validate()) {
                                                        this.setShowModal(true)
                                                    } else {
                                                        this.setShowModal(false)
                                                    }
                                                    if (this.onSuccess) {
                                                        this.onSuccess()
                                                    }
                                                }
                                            }
                                        >
                                            Save
                  </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>
        );
    }
}
