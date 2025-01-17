import React from 'react';
import ModoEmpleado from "./ModoEmpleado";
import ModoEmpleador from "./ModoEmpleador";
import PerfilEmpleado from "./PerfilEmpleado";
import './App.css';
import authApi from "./session/api"
import { auth } from "./firebase";
import db from "./index";
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});
let show = false;
// show/hide dropdown menu
function userOptions() {
    if (show === false) {
        document.getElementById("drop-container-id").style.display = "block";
        show = true;
    } else {
        document.getElementById("drop-container-id").style.display = "none";
        show = false;
    }
};
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modo: "empleado",
            usuario: null,
            openCortina: true,
        }
    }
    componentDidMount() {
        this.setState({ openCortina: true });
        setTimeout(() => {
            var user = auth.currentUser;
            var docRef = db.collection("usuarios").doc(user.email);
            let component = this;
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    component.setState({ usuario: doc.data() });
                } else {
                    alert("Ha ocurrido un error. Actualice la página.");
                }
            }).catch(function (error) {
                console.log(error);
                alert("Ha ocurrido un error. Actualice la página.");
            });
            setTimeout(() => {
                this.setState({ openCortina: false });
            }, 1000);
        }
            , 3000);
    }
    abrirEmpleador = () => {
        document.getElementById("empleador-li").style.color = "#eeeeee";
        document.getElementById("empleado-li").style.color = "#b2bbbd";
        document.getElementById("profileTitle").style.color = "#b2bbbd";
        document.getElementById("drop-container-id").style.display = "none";
        this.setState({ modo: "empleador" });
    }
    abrirEmpleado = () => {
        document.getElementById("empleador-li").style.color = "#b2bbbd";
        document.getElementById("empleado-li").style.color = "#eeeeee";
        document.getElementById("profileTitle").style.color = "#b2bbbd";
        document.getElementById("drop-container-id").style.display = "none";
        this.setState({ modo: "empleado" });
    }
    abrirPerfil = () => {
        document.getElementById("empleador-li").style.color = "#b2bbbd";
        document.getElementById("empleado-li").style.color = "#b2bbbd";
        document.getElementById("profileTitle").style.color = "#eeeeee";
        show = false;
        document.getElementById("drop-container-id").style.display = "none";
        this.setState({ modo: "perfil" });
    }
    render() {
        var fotoPerfil = <img src="https://f1.pngfuel.com/png/1008/352/43/circle-silhouette-user-user-profile-user-interface-login-user-account-avatar-data-png-clip-art.png" alt="Avatar" className="avatar" />;
        if (this.state.usuario !== null && this.state.usuario.urlFoto !== null && this.state.usuario.urlFoto !== "") {
            fotoPerfil = <img src={this.state.usuario.urlFoto} alt="Avatar" className="avatar" />
        }

        var screen = "";
        if (this.state.modo === "perfil") {
            screen = <PerfilEmpleado usuario={this.state.usuario} />
        } else {
            if (this.state.modo === "empleado") {
                screen = <ModoEmpleado usuario={this.state.usuario} />
            } else {
                screen = <ModoEmpleador usuario={this.state.usuario} />
            }
        }        
        return (
            <div className="App">
                <nav className='navbar'>
                    <ul className="left-ui">
                        <li><img className='logo' alt="log" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331813/treehouse.svg" /></li>
                        <li className='home'>WHITEWORK</li>
                        <li id="empleado-li" onClick={this.abrirEmpleado}>Modo Empleado</li>
                        <li id="empleador-li" onClick={this.abrirEmpleador}>Modo Empleador</li>
                    </ul>
                    <ul className='right-ui nombre-usuario'>
                        <li className='points' id="profileTitle" onClick={this.abrirPerfil}>{this.state.usuario == null ? "" : this.state.usuario.fullname}</li>
                        <div className='profile' onClick={userOptions}><div className='background'><i className="fas fa-user">{fotoPerfil}</i></div></div>
                        <li><i className="fas fa-bell bell"></i></li>
                    </ul>
                </nav>
                <div id='drop-container-id' className='drop-container'>
                    <i className="fas fa-caret-up caret"></i>
                    <ul className='dropdown'>
                        <li onClick={this.abrirPerfil}>Mi Perfil</li>
                        <li onClick={authApi.signOut}>Cerrar Sesión</li>
                    </ul>
                </div>
                {screen}
                <Dialog
                    open={this.state.openCortina}
                    TransitionComponent={Transition}
                    aria-labelledby="form-dialog-title"
                >
                </Dialog>
            </div>);
    }
}

export default Main;