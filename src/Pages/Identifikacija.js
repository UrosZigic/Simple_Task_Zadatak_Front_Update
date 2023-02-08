import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Identifikacija() {

    let navigate = useNavigate();

    const [brojtelefona, setBrojTelefona] = useState("");


    useEffect(() => {
        const data = localStorage.getItem("bt");
        if (data) {
            setBrojTelefona(JSON.parse(data));
        }
    }, []);
    
    
    useEffect(() => {
        localStorage.setItem("bt", JSON.stringify(brojtelefona));
    });


    const onInputChange = (e) => {
        setBrojTelefona(e.target.value);
      };
    
    
      const onSubmit = async (e) => {
        e.preventDefault();
        const tokenResult = await axios.post("http://localhost:8080/token", {}, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            auth: {
                username: "zubar",
                password: brojtelefona
              },
        }).catch(function (error) {
            console.log("----");
            console.log(error);
            navigate("/pregled");
            
        });
        console.log(tokenResult.data);
        localStorage.setItem("token", JSON.stringify(tokenResult.data));


        const result = await axios.get("http://localhost:8080/ident?brojTelefona=" + brojtelefona);
        
        if (result.data == 0) {
            navigate("/pregledZubar")
        }
        else if (result.data == 1) {
            navigate("/pregled");
        }
      };
  


  return (
    
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className='mb-3'>
                    <label className='form-label mb-2'>
                        Broj Telefona
                    </label>
                    <input type={"text"} className='form-control' placeholder="Unesite broj telefona" name='brojtelefona' value={brojtelefona} onChange={(e) => onInputChange(e)}/>
                    </div>
                    <button type="submit" className="btn btn-outline-primary mx-1">Pregled</button>
                </form>
            </div>
        </div>
    </div>

  )
}
