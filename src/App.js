import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import hoja from "../src/assets/hoja.png";
import hoja2 from "../src/assets/hoja2.png";
import ChartistGraph from "react-chartist";
import Chartist from "chartist";
// import CanvasJS from 'canvasjs';
import {CanvasJSChart} from 'canvasjs-react-charts'
function App() {
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [color, setColor] = useState("");
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [inicio, setInicio] = useState(false);
  const [advice, setAdvice] = useState("");
  const [actualTemp, setActualTemp] = useState("");
  const [actualHum, setActualHum] = useState("");
  const [dps, setDps] = useState("");
  const [dpsH, setDpsH] = useState("");
  const [dpsL, setDpsL] = useState("");
  const wrapperRef = useRef(null);
  let tableRef = useRef();
  useOutsideAlerter(wrapperRef);
  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title: {
      text: "Temperatura"
    },
    axisX: {
      title: "Muestra n°",
      includeZero: false
    },
    axisY: {
      title: "Valor °C",
      includeZero: false,
    },
    data: [{
      type: "line",
      dataPoints: dps
    }]
  };
  const options2 = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title: {
      text: "Humedad"
    },
    axisX: {
      title: "Muestra n°",
      includeZero: false
    },
    axisY: {
      title: "Valor Humedad",
      includeZero: false,
    },
    data: [{
      type: "line",
      dataPoints: dpsH
    }]
  };
  const options3 = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", // "light1", "dark1", "dark2"
    title: {
      text: "Luz"
    },
    axisX: {
      title: "Muestra n°",
      includeZero: false
    },
    axisY: {
      title: "Valor Luz",
      includeZero: false,
    },
    data: [{
      type: "line",
      dataPoints: dpsL
    }]
  };

  useEffect(() => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function success(pos) {
      var crd = pos.coords;

      setLatitud(crd.latitude);
      setLongitud(crd.longitude);
    }

    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  });
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setColor("");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const handleSubmit = () => {
    if (title != "") {
      var myInit = {
        method: "POST",
      };
      async function postData() {
        var myRequest = new Request(
          `//ec2-34-204-101-3.compute-1.amazonaws.com/user?usuario=${title}`,
          myInit
        );
        const response = await fetch(
          `//ec2-34-204-101-3.compute-1.amazonaws.com/user?usuario=${title}`,
          {
            method: "POST",
          }
        );
        return response.json();
      }
      postData()
        .then((data) => {
          if (Object.values(data)[0].length == 0) {
            alert(
              "Parece que el código que ingresaste es érroneo o no está bien configurado"
            );
          } else {
            let data_array=[]
            let data_arrayH=[]
            let data_arrayL=[]
            Object.values(data)[0].map((i, index) => {
              if (index == Object.values(data)[0].length-1) {
                console.log(i[4]);
                setAdvice(i[4]);
                setActualTemp(i[0])
                setActualHum(i[1])
              }
              data_array.push({
                label: "",
                y: parseFloat(i[0])
              });
              data_arrayH.push({
                label: "",
                y: parseFloat(i[1])
              });
              data_arrayL.push({
                label: "",
                y: parseFloat(i[2])
              });
            });
            setInicio(true);
            console.log(data_array);
            setDps(data_array)
            setDpsH(data_arrayH)
            setDpsL(data_arrayL)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Ingresa un código válido");
    }
  };
  const handleClose = (e) => {
    e.preventDefault();
    setColor("");
  };
  return (
    <div className="App">
      {/*  */}
      <div className="App-header"></div>
      {!inicio && (
        <>
          <div className="App-content">
            <div className="App-content__title">
              <h1>Plant Care</h1>
              <img src={hoja2} />
            </div>

            <div className="App-content__body">
              <p>Pon el código de tu maceta aquí:</p>
              <input
                type="text"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="123456"
              />
              <br />
              <button onClick={handleSubmit}>Continuar</button>
            </div>
          </div>

          <div className="App-footer"></div>
        </>
      )}
      {inicio && (
        <>
          <div className="App-content__body-home">
            <h2>{advice}</h2>
            <span>
            <h3>Humedad Actual: {actualHum}%</h3>
            <h3>Temperatura Actual: {actualTemp}°C</h3></span>
            <p>Aquí puedes ver los valores históricos de tu planta, cuando haya algun problema te lo informaremos</p>
            <div>
              {/* <div id="1"
              >
                
                 <CanvasJSChart options = {options}/>
              </div> */}
              <div 
              >
                 <CanvasJSChart options = {options}/>
              </div>
              <div 
              >
                 <CanvasJSChart options = {options2}/>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
