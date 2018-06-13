import React from 'react';
import Modal from 'react-modal';
import validator from 'validator';
import { Link } from 'react-router-dom';

const desktopStyles = {
    overlay: {
        backgroundColor: 'rgba(17, 17, 17, 0.8)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '70%'
    }
};

const mobileStyles = {
    content: {
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
    }

}

class SignUp extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            email: '',
            modalIsOpen: true,
            emailInput: true,
            nameError: false,
            emailError: false,
            mobile: window.innerWidth <= 600,
            currentPage: 2,
            activityChecked: false,
            connectChecked: false,
            adsChecked: false,
        }

        this.openModal = this
            .openModal
            .bind(this);
        this.closeModal = this
            .closeModal
            .bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    updateWindowDimensions = () => {
        let mobile = window.innerWidth <= 600;
        this.setState({mobile});
    };

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={this.state.mobile
                    ? mobileStyles
                    : desktopStyles}
                    contentLabel="Sign Up">
                    { this.state.currentPage === 1 && 
                        <div>
                            <div className="icon__container">
                                <i className="icon__twitter fab fa-twitter"></i>
                                <button
                                    disabled={this.state.email.trim().length === 0 || this.state.name.trim().length === 0
                                                || this.state.emailError || this.state.nameError }
                                    className="btn button__modal button__signup" onClick={() => this.setState({ currentPage: 2})}>
                                    Next
                                </button>
                            </div>
                            <div className="modal__content">
                                <h4 className="modal__title" style={{marginTop: '30px'}}>Create your account</h4>
                                <input
                                    type="text"
                                    className={this.state.nameError ? 'input__error modal__input' : 'modal__input'}
                                    placeholder="Name"
                                    onBlur={(e) => {
                                    if (e.target.value.trim().length === 0) {
                                        this.setState({nameError: true});
                                    } else {
                                        this.setState({name: e.target.value, nameError: false});
                                    }
                                }}/> {this.state.nameError && <p className="modal__error" id="name__error">What's your name?</p>}
                                <input
                                    type={this.state.email
                                    ? 'email'
                                    : 'text'}
                                    className={this.state.emailError ? 'input__error modal__input' : 'modal__input'}
                                    placeholder={this.state.emailInput
                                    ? 'Email'
                                    : 'Phone'}
                                    onBlur={(e) => {
                                    if (e.target.value.trim().length === 0) {
                                        this.setState({emailError: true});
                                    } else {
                                        if (this.state.emailInput) {
                                            if (validator.isEmail(e.target.value)) {
                                                this.setState({email: e.target.value, phoneNum: null, emailError: false});
                                            } else {
                                                this.setState({emailError: true});
                                            }
                                        } else {
                                            if (validator.isMobilePhone(e.target.value, 'en-GB')) {
                                                this.setState({phoneNum: e.target.value, email: null, emailError: false})
                                            } else {
                                                this.setState({emailError: true});
                                            }
                                        }
                                    }
                            }}/> {this.state.emailError && <p className="modal__error" id="email__error">Please enter a valid {this.state.emailInput
                                    ? 'email address.'
                                    : 'phone number.'}</p>}
                            <p
                                className="modal__changeInput"
                                onClick={() => this.setState({
                                emailInput: !this.state.emailInput
                            })}>Use {this.state.emailInput
                                    ? 'phone '
                                    : 'email '}
                            instead</p>
                        </div>
                    </div>
                    }
                    {
                        this.state.currentPage === 2 &&
                        <div>
                            <div className="icon__container">
                                <i className="icon__back fas fa-arrow-left" onClick={() => this.setState({ currentPage: this.state.currentPage - 1})}></i>
                                <i className="icon__twitter fab fa-twitter"></i>
                                <button className="btn button__modal button__signup" onClick={() => this.setState({ currentPage: this.state.currentPage + 1})}>
                                Next
                                </button>
                            </div>
                            <div className="modal__content">
                                <h4 className="modal__title" style={{marginBottom: '40px'}}>Customise your experience</h4>
                                <div className="row row__inputs">
                                        <div className="col-11">
                                            <h5 className="modal__subtitle">Connect with people you know</h5>
                                            <p>Let others find your Twitter account by your {this.state.emailInput ? 'email address' : 'phone number'}</p>
                                        </div>
                                        <div className="col-1 checkbox__container" onClick={() => this.setState({ connectChecked: !this.state.connectChecked})}>
                                            <input type="checkbox" checked={this.state.connectChecked} />
                                            <span>✓</span>
                                        </div>
                                    </div>
                                
                                {this.state.emailInput && 
                                    <div className="row row__inputs">
                                        <div className="col-11">
                                            <h5 className="modal__subtitle">Get more out of Twitter</h5>
                                            <p className="input__label">Receive email about your Twitter activity and recommendations</p>
                                        </div>
                                        <div className="col-1 checkbox__container" onClick={() => this.setState({ activityChecked: !this.state.activityChecked})}>
                                            <input type="checkbox" checked={this.state.activityChecked} />
                                            <span>✓</span>
                                        </div>
                                    </div>
                                }
                                <div className="row row__inputs">
                                    <div className="col-11">
                                        <h5 className="modal__subtitle">See better ads</h5>
                                        <p className="input__label">Receive personalised ads based on your activity off Twitter</p>
                                    </div>
                                    <div className="col-1 checkbox__container" onClick={() => this.setState({ adsChecked: !this.state.adsChecked})}>
                                        <input type="checkbox" checked={this.state.adsChecked} />
                                        <span>✓</span>
                                    </div>
                                </div>
                                <p className="information__text">For more details about these settings, visit the <Link className="link" to="/help-center">Help Center</Link></p>
                            </div>
                        </div>
                    }
                    {
                        this.state.currentPage === 3 && 
                        <div>
                            <div className="icon__container">
                                <i className="icon__back fas fa-arrow-left" onClick={() => this.setState({ currentPage: this.state.currentPage - 1})}></i>
                                <i className="icon__twitter fab fa-twitter"></i>
                            </div>
                            <div className="modal__content" style={{marginBottom: '10px'}}>
                                <h4 className="modal__title">Create your account</h4>
                                <input
                                    type="text" 
                                    className="modal__input" 
                                    style={{marginBottom: '0'}}
                                    value={this.state.name} 
                                    onClick={() => this.setState({ currentPage: 1})}
                                />
                                <input 
                                    type="text" 
                                    className="modal__input" 
                                    value={this.state.emailInput ? this.state.email : this.state.phoneNum } 
                                    onClick={() => this.setState({ currentPage: 1})} 
                                />
                                <p className="terms__text">
                                    By signing up, you agree to our <Link to="/terms" className="link">Terms</Link>, <Link to="/privacy" className="link">Privacy Policy</Link>, and <Link to="/cookies" className="link">Cookie Use</Link>. You also agree that you’re over 13 years of age.
                                </p>
                                <button className="btn button__signup" style={{width: '100%', fontSize: '20px'}}>Sign Up</button>
                            </div>
                        </div>

                    }
                </Modal>
            </div>
        )
    }
}
export default SignUp;