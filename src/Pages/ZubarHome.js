import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function ZubarHome() {



    const[BT, setBT] = useState(JSON.parse(localStorage.getItem("bt")));


    const [termini, setTermini] = useState([]);
    const[vremeOtkazivanje, setVremeOtkazivanje] = useState();
    


    const onInputChange = (e) => {
        setVremeOtkazivanje(e.target.value);
      };


    useEffect( () => {
        ident();
        loadTermini();
        loadVremeOtkazivanje();
    }, []);


    const loadTermini = async () => {
      //console.log(JSON.parse(localStorage.getItem("token")))
        const result = await axios.get("http://localhost:8080/pregledZubar?brojTelefona=" + BT, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("token")),
            'Content-Type': 'application/json'
          }
        });
        //localStorage.getItem("token");
        console.log(result.data)
        setTermini(result.data);
    }


    const deleteTermin = async (id, title) => {
        const result = await axios.post("http://localhost:8080/otkazi", { idTermin: id, brojTelefona: BT });
        if (result.data) {
          obavestenjeBrisanje(title);
        }
        loadTermini();
    };



    const loadVremeOtkazivanje = async () => {
        const result = await axios.get("http://localhost:8080/vremeOtkazivanje");
        setVremeOtkazivanje(result.data);
    }


    const promeniOtkazivanje = async () => {
        const result = await axios.put("http://localhost:8080/setVremeOtkazivanje/" + vremeOtkazivanje + "/" + BT, {}, {
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("token")),
            'Content-Type': 'application/json'
          }
        });
        if (result.data == true) {
          obavestenje();
        }
    }


    const [isZubar, setIsZbuar] = useState(true);



    const ident = async () => {
      const result = await axios.get("http://localhost:8080/ident?brojTelefona=" + BT);
      if (result.data != 0) {
        setIsZbuar(false);
      }
    }



    const obavestenje = () => {
      toast.success("Uspesno ste promenili dozvoljeno vreme za otkazivanje na " + vremeOtkazivanje + "h.", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }

    const obavestenjeBrisanje = (title) => {
      toast.info("Otkazali ste termin " + title + ".", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }





  return (
    

    <div className="h-100 mx-5">

        {(() => { if (isZubar) {
          return (
            <>
              
              <br/>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                theme="light"
                />
              <FullCalendar className=""
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={{
                left: 'timeGridDay timeGridWeek',
              }}
              events={termini}
              eventColor="light-blue"
              nowIndicator
              height="75vh"
              buttonText={{ week: 'Nedelja', day: 'Dan', today: "Danas"}}
              slotMinTime={"09:00"}
              slotMaxTime={"17:30"}
              eventClick={(e) => deleteTermin(e.event.id, e.event.title)}
              firstDay={1}
              allDaySlot={false}
              locale={"sr-latn"}
              />
              <Link className='btn btn-secondary my-3 px-5' to="/zakaziZubar">Zakazi termin</Link>
              
              <div className="position-absolute my-4 py-4">
                <h6>Promeni dozvoljeno vreme za otkazivanje:</h6>
                <input className="mx-3 w-25 h-25 align-middle" type={"text"} name='vremeotkazivanje' placeholder={vremeOtkazivanje} onChange={(e) => onInputChange(e)}/>
                <button className="btn btn-outline-dark btn-light btn-sm align-middle" onClick={() => promeniOtkazivanje()}>Promeni</button>
              </div>
            </>
          )
        } else {
          return (
            <h1>ZABRANJEN PRISTUP</h1>
          )
        }
        })()}

        
    </div>
    

  )
}
