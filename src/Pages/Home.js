import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Home() {


    const[BT, setBT] = useState(JSON.parse(localStorage.getItem("bt")));


    const [termini, setTermini] = useState([]);

    const[vremeOtkazivanja, setVremeOtkazivanja] = useState();


    useEffect( () => {
        ident();
        loadTermini();
        loadVremeOtkazivanja();
    }, []); 



    const loadTermini = async () => {
        const result = await axios.get("http://localhost:8080/pregled?brojTelefona=" + BT);
        setTermini(result.data);
    }


    const deleteTermin = async (id) => {
        const result = await axios.post("http://localhost:8080/otkazi", { idTermin: id, brojTelefona: BT });
        if (result.data == false) {
            obavestenje();
        }
        loadTermini();
      };
    


    const loadVremeOtkazivanja = async () => {
        const result = await axios.get("http://localhost:8080/vremeOtkazivanje");
        console.log(vremeOtkazivanja);
        setVremeOtkazivanja(result.data);
    }


    const obavestenje = () => {
        toast.error("Ne mozete otkazati termin, preostalo je manje od " + vremeOtkazivanja + "h.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }




    const [isBroj, setIsBroj] = useState(true);



    const ident = async () => {
      const result = await axios.get("http://localhost:8080/ident?brojTelefona=" + BT);
      if (result.data != 1) {
        setIsBroj(false);
      }
    }





  return (

    <div>

        {(() => { if (isBroj) {
            return (
                <>
                    <Link className='btn btn-secondary my-3 px-5' to="/zakazi">Zakazi termin</Link>
                    <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    theme="colored"
                    />
                    <div className="container">
                        <div className="py-2">
                            <table class="table border">
                                <thead>
                                    <tr>
                                    <th scope="col align-middle">Vreme</th>
                                    <th scope="col">Tip Pregleda</th>
                                    <th scope="col">Trajanje</th>
                                    <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        termini.map((termin) => (
                                            <tr>
                                                <td className="align-middle">{ Moment(termin.vreme).format("HH:mm, D MMM yyyy") }</td>
                                                <td className="align-middle">{termin.tippregleda}</td>
                                                <td className="align-middle">{termin.trajanje}min</td>
                                                <td className="align-middle">
                                                    <button className="btn btn-danger mx-2" onClick={() => deleteTermin(termin.idtermin)}>Otkazi</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
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
