import React from 'react';
import EventoTarjeta from "./components/EventoTarjeta";
import { auth } from "./firebase";
import db from './index';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const dateNow = new Date();
const year = dateNow.getFullYear();
const monthWithOffset = dateNow.getUTCMonth() + 1;
var day = dateNow.getUTCDate().toString();
// Setting current Month number from current Date object
var month = monthWithOffset.toString();
if (monthWithOffset.toString().length < 2) {
    month = "0" + month
}
if (day.length < 2) {
    day = "0" + day
}
const materialDateInput = year + "-" + month + "-" + day;
export default class ModoEmpleado extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      estadoDeEvento: "pendiente",
      usuario: null,
      eventos: [],
      openCortina: true,
    }
  }
  componentDidMount() {
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
    this.setState({ openCortina: false });
  }
  buscarEventos(estado) {
    var filtro = db.collection("eventos").where("estado", "==", estado)
    filtro.onSnapshot((snapShots) => {
      this.setState({
        eventos: snapShots.docs.map(doc => {
          return { id: doc.id, data: doc.data() }
        })
      })
    }, error => {
      console.log(error)
    });
    setTimeout(() => {
      this.setState({ openCortina: false });
    }, 1000);
  }
  busquedaAbierta() {
    var post = [];
    var events = [];
    var mailUsuario = this.state.usuario.email;
    db.collection("postulaciones").where("mail_postulante", "==", mailUsuario).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          post.push(doc.data().id_evento);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    db.collection("trabajos").where("mail_trabajador", "==", mailUsuario).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          post.push(doc.data().id_evento);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    db.collection("eventos").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const found = post.find(element => element === doc.data().id_evento);
          if (found !== doc.data().id_evento) {
            return events.push({ id: doc.id, data: doc.data() });
          }
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    setTimeout(() => {
      this.setState({ eventos: events })
      this.setState({ openCortina: false });
    }, 1000);
  }
  buscarPostulaciones() {
    var post = [];
    var events = [];
    var mailUsuario = this.state.usuario.email;
    db.collection("postulaciones").where("mail_postulante", "==", mailUsuario).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          post.push(doc.data().id_evento);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    db.collection("eventos").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const found = post.find(element => element === doc.data().id_evento);
          if (found === doc.data().id_evento) {
            return events.push({ id: doc.id, data: doc.data() });
          }
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    setTimeout(() => {
      this.setState({ eventos: events })
      this.setState({ openCortina: false });
    }, 1000);
  }
  buscarAsignados() {
    var trab = [];
    var events = [];
    var mailUsuario = this.state.usuario.email;
    db.collection("trabajos").where("mail_trabajador", "==", mailUsuario).where("puntuadoEmpleado", "==", "N").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          trab.push(doc.data().id_evento);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    db.collection("eventos").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const found = trab.find(element => element === doc.data().id_evento);
          if (found === doc.data().id_evento) {
            return events.push({ id: doc.id, data: doc.data() });
          }
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    setTimeout(() => {
      this.setState({ eventos: events })
      this.setState({ openCortina: false });
    }, 1000);
  }
  buscarPuntuados() {
    var trab = [];
    var events = [];
    var mailUsuario = this.state.usuario.email;
    db.collection("trabajos").where("mail_trabajador", "==", mailUsuario).where("puntuadoEmpleado", "==", "Y").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          trab.push(doc.data().id_evento);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    db.collection("eventos").get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const found = trab.find(element => element === doc.data().id_evento);
          if (found === doc.data().id_evento) {
            return events.push({ id: doc.id, data: doc.data() });
          }
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    setTimeout(() => {
      this.setState({ eventos: events })
      this.setState({ openCortina: false });
    }, 1000);
  }
  elegirEstadoBusqueda = () => {
    this.setState({ eventos: [] })
    document.getElementById("busqueda").style.color = "black";
    document.getElementById("postulaciones").style.color = "#b2bbbd";
    document.getElementById("aceptados").style.color = "#b2bbbd";
    document.getElementById("enproceso").style.color = "#b2bbbd";
    document.getElementById("completados").style.color = "#b2bbbd";
    document.getElementById("puntuados").style.color = "#b2bbbd";
    document.getElementById("temporales-titulo").textContent = "Eventos Temporales - Busqueda";
    this.setState({ estadoDeEvento: "pendiente" });
  }
  elegirEstadoPostulaciones = () => {
    this.setState({ openCortina: true });
    this.setState({ eventos: [] })
    document.getElementById("busqueda").style.color = "#b2bbbd";
    document.getElementById("postulaciones").style.color = "black";
    document.getElementById("aceptados").style.color = "#b2bbbd";
    document.getElementById("enproceso").style.color = "#b2bbbd";
    document.getElementById("completados").style.color = "#b2bbbd";
    document.getElementById("puntuados").style.color = "#b2bbbd";
    document.getElementById("temporales-titulo").textContent = "Eventos Temporales - Postulaciones";
    this.setState({ estadoDeEvento: "postulado" });
    this.buscarPostulaciones()
  }
  elegirEstadoAceptado = () => {
    this.setState({ openCortina: true });
    this.setState({ eventos: [] })
    document.getElementById("busqueda").style.color = "#b2bbbd";
    document.getElementById("postulaciones").style.color = "#b2bbbd";
    document.getElementById("aceptados").style.color = "black";
    document.getElementById("enproceso").style.color = "#b2bbbd";
    document.getElementById("completados").style.color = "#b2bbbd";
    document.getElementById("puntuados").style.color = "#b2bbbd";
    document.getElementById("temporales-titulo").textContent = "Eventos Temporales - Aceptados";
    this.setState({ estadoDeEvento: "aceptado" });
    this.buscarAsignados()
  }
  elegirEstadoEnProceso = () => {
    this.setState({ openCortina: true });
    this.setState({ eventos: [] })
    document.getElementById("busqueda").style.color = "#b2bbbd";
    document.getElementById("postulaciones").style.color = "#b2bbbd";
    document.getElementById("aceptados").style.color = "#b2bbbd";
    document.getElementById("enproceso").style.color = "black";
    document.getElementById("completados").style.color = "#b2bbbd";
    document.getElementById("puntuados").style.color = "#b2bbbd";
    document.getElementById("temporales-titulo").textContent = "Eventos Temporales - En Proceso";
    this.setState({ estadoDeEvento: "enproceso" });
    this.buscarAsignados();
  }
  elegirEstadoCompletado = () => {
    this.setState({ openCortina: true });
    this.setState({ eventos: [] })
    document.getElementById("busqueda").style.color = "#b2bbbd";
    document.getElementById("postulaciones").style.color = "#b2bbbd";
    document.getElementById("aceptados").style.color = "#b2bbbd";
    document.getElementById("enproceso").style.color = "#b2bbbd";
    document.getElementById("completados").style.color = "black";
    document.getElementById("puntuados").style.color = "#b2bbbd";
    document.getElementById("temporales-titulo").textContent = "Eventos Temporales - Completados";
    this.setState({ estadoDeEvento: "completado" });
    this.buscarAsignados();
  }
  elegirEstadoPuntuados = () => {
    this.setState({ openCortina: true });
    this.setState({ eventos: [] })
    document.getElementById("busqueda").style.color = "#b2bbbd";
    document.getElementById("postulaciones").style.color = "#b2bbbd";
    document.getElementById("aceptados").style.color = "#b2bbbd";
    document.getElementById("enproceso").style.color = "#b2bbbd";
    document.getElementById("completados").style.color = "#b2bbbd";
    document.getElementById("puntuados").style.color = "black";
    document.getElementById("temporales-titulo").textContent = "Eventos Temporales - Puntuados";
    this.setState({ estadoDeEvento: "puntuado" });
    this.buscarPuntuados();
  }

  filtrarBusqueda = () => {
    this.setState({ openCortina: true });
    var fromDate = document.getElementById("desde").value;
    var toDate = document.getElementById("hasta").value;
    var dueño = document.getElementById("dueño").value;
    fromDate = fromDate.substr(0,4)+""+fromDate.substr(5,2)+""+fromDate.substr(8,2)
    toDate = toDate.substr(0,4)+""+toDate.substr(5,2)+""+toDate.substr(8,2)
    console.log(fromDate+"/"+toDate+"/"+dueño)
    this.busquedaAbierta()
  }

  render() {
    var today = new Date();
    var mes = "";
    if ((today.getMonth() + 1).toString().length === 2) {
      mes = (today.getMonth() + 1)
    } else {
      mes = 0 + "" + (today.getMonth() + 1)
    }
    var dia = "";
    if (today.getDate().toString().length === 2) {
      dia = today.getDate()
    } else {
      dia = 0 + "" + today.getDate()
    }
    var minutos = "";
    if (today.getMinutes().toString().length === 2) {
      minutos = today.getMinutes()
    } else {
      minutos = 0 + "" + today.getMinutes()
    }
    var hora = "";
    if (today.getHours().toString().length === 2) {
      hora = today.getHours()
    } else {
      hora = 0 + "" + today.getHours()
    }
    var date = today.getFullYear() + "" + mes + "" + dia;
    var time = hora + "" + minutos;
    var dateTime = date + time;
    var filtros = "";
    if (this.state.estadoDeEvento === "pendiente") {
      filtros = <div className="filters-container">
        <label>Desde: </label>
        <input id="desde" type="date" text="desde" defaultValue={materialDateInput} className="filtro-busqueda" />
        <label>Hasta: </label>
        <input id="hasta" type="date" text="hasta" defaultValue={materialDateInput} className="filtro-busqueda" />
        <label>Dueño: </label>
        <input id="dueño" type="" text="Dueño" className="filtro-busqueda" />
        <button id="filter_button" onClick={this.filtrarBusqueda} className="filter-button">Filtrar</button>
      </div>
    }
    var mail = "";
    var contenedorEventos = "";
    if (this.state.usuario !== null) {
      mail = this.state.usuario.email;
      var eventos = "";
      if (this.state.estadoDeEvento === "pendiente" || this.state.estadoDeEvento === "postulado") {
        eventos = this.state.eventos.filter(function (evento) {
          return evento.data.mail_dueño_evento !== mail && evento.data.cantAsignados < evento.data.cantidadTrabajos && evento.data.dateComienzo.substr(0, 4) + "" + evento.data.dateComienzo.substr(5, 2) + "" + evento.data.dateComienzo.substr(8, 2) + "" + evento.data.timeComienzo.substr(0, 2) + "" + evento.data.timeComienzo.substr(3, 2) > dateTime;
        });
      } else {
        if (this.state.estadoDeEvento === "aceptado") {
          eventos = this.state.eventos.filter(function (evento) {
            return evento.data.mail_dueño_evento !== mail && evento.data.dateComienzo.substr(0, 4) + "" + evento.data.dateComienzo.substr(5, 2) + "" + evento.data.dateComienzo.substr(8, 2) + "" + evento.data.timeComienzo.substr(0, 2) + "" + evento.data.timeComienzo.substr(3, 2) > dateTime;
          });
        } else {
          if (this.state.estadoDeEvento === "enproceso") {
            eventos = this.state.eventos.filter(function (evento) {
              return evento.data.mail_dueño_evento !== mail && evento.data.dateComienzo.substr(0, 4) + "" + evento.data.dateComienzo.substr(5, 2) + "" + evento.data.dateComienzo.substr(8, 2) + "" + evento.data.timeComienzo.substr(0, 2) + "" + evento.data.timeComienzo.substr(3, 2) < dateTime &&
                evento.data.dateFinaliza.substr(0, 4) + "" + evento.data.dateFinaliza.substr(5, 2) + "" + evento.data.dateFinaliza.substr(8, 2) + "" + evento.data.timeFinaliza.substr(0, 2) + "" + evento.data.timeFinaliza.substr(3, 2) > dateTime;;
            });
          } else {
            if (this.state.estadoDeEvento === "completado") {
              eventos = this.state.eventos.filter(function (evento) {
                return evento.data.mail_dueño_evento !== mail && evento.data.estado !== "puntuado" && evento.data.dateFinaliza.substr(0, 4) + "" + evento.data.dateFinaliza.substr(5, 2) + "" + evento.data.dateFinaliza.substr(8, 2) + "" + evento.data.timeFinaliza.substr(0, 2) + "" + evento.data.timeFinaliza.substr(3, 2) < dateTime;;
              });
            } else {
              if (this.state.estadoDeEvento === "puntuado") {
                eventos = this.state.eventos.filter(function (evento) {
                  return evento.data.mail_dueño_evento !== mail && evento.data.dateFinaliza.substr(0, 4) + "" + evento.data.dateFinaliza.substr(5, 2) + "" + evento.data.dateFinaliza.substr(8, 2) + "" + evento.data.timeFinaliza.substr(0, 2) + "" + evento.data.timeFinaliza.substr(3, 2) < dateTime;;
                });
              }
            }
          }
        }
      }
      if (eventos.length === 0) {
        contenedorEventos = <div className="sinEventos">
          No se han encontrado eventos.
      </div>
      } else {
        contenedorEventos = <div className='library'>
          {eventos.map(evento => (<EventoTarjeta key={evento.id} usuario={this.state.usuario} estado={this.state.estadoDeEvento} eventoid={evento.data.id_evento} titulo={evento.data.titulo} privado="no" mailDueño={evento.data.mail_dueño_evento} nombreDueño={evento.data.nombre_dueño_evento} cantTrabajos={evento.data.cantidadTrabajos} descripcion={evento.data.descripcion} datecomienzo={evento.data.dateComienzo} datefin={evento.data.dateFinaliza} timecomienzo={evento.data.timeComienzo} timefin={evento.data.timeFinaliza} zona={evento.data.zona} direccion={evento.data.direccion} cantPostEvento={evento.data.cantPostulados} cantAsignados={evento.data.cantAsignados} modo="empleado" />
          ))}
        </div>
      }
    }
    return (
      <div>
        <main className='grid'>
          <div className='progress-bar'>
            <span onClick={this.elegirEstadoBusqueda} className="estados" id="busqueda">Busqueda</span>
            <span onClick={this.elegirEstadoPostulaciones} className="estados" id="postulaciones">Postulaciones</span>
            <span onClick={this.elegirEstadoAceptado} className="estados" id="aceptados">Aceptados</span>
            <span onClick={this.elegirEstadoEnProceso} className="estados" id="enproceso">En Proceso</span>
            <span onClick={this.elegirEstadoCompletado} className="estados" id="completados">Completados</span>
            <span onClick={this.elegirEstadoPuntuados} className="estados" id="puntuados">Puntuados</span>
          </div>
          <div className='track'>
            <div className='top'>
              <p id="temporales-titulo" className='ux'>Eventos Temporales - Busqueda</p>
            </div>
            {filtros}
            {contenedorEventos}
          </div>
        </main>
        <Dialog
          open={this.state.openCortina}
          TransitionComponent={Transition}
          aria-labelledby="form-dialog-title"
        >
        </Dialog>
      </div>
    );
  }
}
