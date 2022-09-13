import React, { useState, useEffect } from "react";
import {createRoot} from "react-dom/client"
import Axios from "axios"
import CreateNewForm from "./components/CreateNewForm"
import FuncionarioCard from "./components/FuncionarioCard"

function App() {
    const [funcionarios, setFuncionarios] = useState([])

    useEffect(() => {
        async function go() {
            const response = await Axios.get('/api/funcionarios')
            setFuncionarios(response.data)
        }
        go()
    }, [])

    return (
        <div className="container">
            <p><a href="/">&laquo; Voltar para a homepage</a></p>
            <h1>Olá</h1>
            <CreateNewForm setFuncionarios={ setFuncionarios }/>
            <div className="funcionario-grid">
                {funcionarios.map((funcionario)=> {
                    return <FuncionarioCard key={funcionario._id} name={funcionario.name} funcao={funcionario.funcao} photo={funcionario.photo} id={funcionario._id} setFuncionarios={setFuncionarios}/>
                })}
            </div>
        </div>
    )
}

const root = createRoot(document.querySelector('#app'))
root.render(<App/>)