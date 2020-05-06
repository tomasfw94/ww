import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';

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
    month = "0"+month
}
if (day.length < 2) {
    day = "0"+day
}
const materialDateInput = year+"-"+month+"-"+day;

export default class AgregarTrabajo extends React.Component {
    constructor() {
        super();
        this.state = {
            nombre:"",
            zona:"",
            direccion:"",
            diaComienzo:"",
            diaFinalizacion:"",
            horaComienzo:"",
            horaFinalizacion:""
        }
    }
    handleClose = () => {
        this.setState({ open: false });
    };
    handleOpen = () => {
        this.setState({ open: true });
    };
    AgregarTrabajo = () => {
        this.setState({ nombre: document.getElementById("nombre").value });
        this.setState({ zona: document.getElementById("zona").value });
        this.setState({ direccion: document.getElementById("direccion").value });
        this.setState({ diaComienzo: document.getElementById("date").value });
        this.setState({ diaFinalizacion: document.getElementById("date2").value });
        this.setState({ horaComienzo: document.getElementById("time").value });
        this.setState({ horaFinalizacion: document.getElementById("time2").value });
        alert(this.state.nombre+"//"+this.state.zona+"//"+this.state.direccion+"//"+this.state.diaComienzo+"//"+this.state.diaFinalizacion+"//"+this.state.horaComienzo+"//"+this.state.horaFinalizacion)
    }


    render() {

        return (

            <div >

                <button className='agregarTrabajo-btn' onClick={this.handleOpen}>Crear Evento</button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="confirmation-dialog-title">Nuevo Evento</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            Ingrese los datos necesarios para poder crear su evento.
                    </DialogContentText>
                        <TextField id="nombre" autoFocus margin="dense" label="Nombre del evento" type="evento" fullWidth />
                        <TextField id="zona" margin="dense" label="Zona" type="zona" fullWidth />
                        <TextField id="direccion" margin="dense" label="Dirección" type="direccion" fullWidth />
                        <TextField id="date" label="Comienzo:" type="date" defaultValue={materialDateInput} />
                        <TextField id="time" type="time" defaultValue="00:00" label=" " />
                        <br />
                        <TextField id="date2" label="Terminación:" type="date" defaultValue={materialDateInput} />
                        <TextField id="time2" type="time" defaultValue="00:00" label=" " />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary">
                            Cancel
                         </Button>
                        <Button onClick={this.AgregarTrabajo} color="primary">
                            Ok
                         </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}