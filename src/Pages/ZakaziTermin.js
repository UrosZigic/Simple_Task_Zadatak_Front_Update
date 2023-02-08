import React, { useState, useEffect } from 'react';
import axios from "axios";
import Select from 'react-select';
import { Link, useNavigate } from "react-router-dom";
import Moment from 'moment';

export default function ZakaziTermin() {


  const[BT, setBT] = useState(JSON.parse(localStorage.getItem("bt")));

  let navigate = useNavigate();

  
  const [isDisabled, setIsDisabled] = useState(false);

  
  const [trajanje, setTrajanje] = useState(30);
  const [date, setDate] = useState();
  const [slobodniTermini, setSlobodniTermini] = useState([]);
  const[vremeTermina, setVremeTermina] = useState();
  const[tipPregleda, setTipPregleda] = useState();
  

  const[pacijent, setPacijent]=useState({
    ime: "",
    prezime: "",
    email: "",
    brojtelefona: BT
  });
  const{ime, prezime, email, brojtelefona} = pacijent;


  const onInputChange = (e) => {
    setPacijent({...pacijent, [e.target.name]: e.target.value });
  };

  const onTrajanjeChange = (e) => {
    setTrajanje(e);
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) {
      await axios.post("http://localhost:8080/zakazi", { trajanje: trajanje, vreme: vremeTermina.value, tippregleda: tipPregleda, brojtelefona: BT })
    }
    else {
      await axios.post("http://localhost:8080/zakaziNovog", { trajanje: trajanje, vreme: vremeTermina.value, tippregleda: tipPregleda, brojtelefona: BT, ime: pacijent.ime, prezime: pacijent.prezime, email: pacijent.email })
    }
    navigate("/pregled");
  };



  useEffect( () => {
    setVremeTermina([]);
    setSlobodniTermini([null]);
    loadDatumi();
  }, [date, trajanje]);


  const loadDatumi = async () => {
    console.log("http://localhost:8080/slobodni?trajanje=" + trajanje + "&datum=" + date)
      const result = await axios.get("http://localhost:8080/slobodni?trajanje=" + trajanje + "&datum=" + date);
      setSlobodniTermini(result.data);
  }


  useEffect( () => {
    ident();
    loadPacijent();
  }, []);


  const loadPacijent = async () => {
    const result = await axios.get("http://localhost:8080/nadjiPacijenta?brojTelefona=" + BT);

    if (result.data !== '') {
      setIsDisabled(true);
      setPacijent(result.data);
    }
    
  }



  const [isBroj, setIsBroj] = useState(true);



  const ident = async () => {
    const result = await axios.get("http://localhost:8080/ident?brojTelefona=" + BT);
    if (result.data != 1) {
      setIsBroj(false);
    }
  }




  return (
    <div className='container'>

      {(() => { if (isBroj) {
        return (
          <>
            <div className='row'>
              <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 mb-2 shadow'>
                <form onSubmit={(e) => onSubmit(e)}>
                  <div className='mb-2'>
                    <label className='form-label'>
                      Ime
                    </label>
                    <input type={"text"} className='form-control' placeholder="ime" name='ime' value={ime} disabled={isDisabled} onChange={(e) => onInputChange(e)}/>
                  </div>

                  <div className='mb-2'>
                    <label className='form-label'>
                      Prezime
                    </label>
                    <input type={"text"} className='form-control' placeholder="prezime" name='prezime' value={prezime} disabled={isDisabled} onChange={(e) => onInputChange(e)}/>
                  </div>

                  <div className='mb-2'>
                    <label className='form-label'>
                      Email
                    </label>
                    <input type={"email"} className='form-control' placeholder="email" name='email' value={email} disabled={isDisabled} onChange={(e) => onInputChange(e)}/>
                  </div>

                  <div className='mb-5'>
                    <label className='form-label'>
                      Broj Telefona
                    </label>
                    <input type={"text"} className='form-control' placeholder="broj telefona" name='brojtelefona' value={brojtelefona} disabled onChange={(e) => onInputChange(e)}/>
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>
                      Tip Pregleda
                    </label>
                    <input type={"text"} className='form-control' placeholder="tip pregleda" name='tippregleda' onChange={(e) => setTipPregleda(e.target.value)}/>
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>
                      Datum
                    </label>
                    <br/>
                    <input type="date" onChange={e=>setDate(e.target.value)}/>
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>
                      Trajanje
                    </label>
                    <br/>
                    <input type="radio" name='trajanje' value="30" defaultChecked onChange={e=>onTrajanjeChange(e.target.value)}/><label className='mx-2'>30min</label>
                    <input type="radio" name='trajanje' value="60" onChange={e=>onTrajanjeChange(e.target.value)}/><label className='mx-2'>60min</label>
                  </div>

                  <div className='mb-3'>
                    <label className='form-label'>
                      Vreme
                    </label>
                    <Select options={slobodniTermini.map(t => ({ value: t, label: Moment(t).format("HH:mm, D MMM yyyy")}))} menuPlacement='top' onChange={(e) => setVremeTermina(e)}/>
                  </div>

                  <button type="submit" className="btn btn-primary mx-1">Zakazi</button>
                  <Link className="btn btn-outline-danger mx-2" to="/pregled">Prekini</Link>
                </form>
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
