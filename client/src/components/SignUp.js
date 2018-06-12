import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    overlay: {
        backgroundColor: '#3B3B3B',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
};

class SignUp extends React.Component {
    constructor() {
        super();

        this.state = {
            modalIsOpen: true,
            errors: true
        }

        this.openModal = this
            .openModal
            .bind(this);
        this.closeModal = this
            .closeModal
            .bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render() {
        return (
            <div>
                <h1>ehfgksildjfgkjsdngkjsdfjngjk</h1>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">

                    <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
                    <button onClick={this.closeModal}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input/>
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
            </div>
        )
    }
}
export default SignUp;