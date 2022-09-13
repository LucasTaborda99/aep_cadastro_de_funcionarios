import Axios from "axios"
import React, { useState, useRef } from "react"

function CreateNewForm(props) {
  const [name, setName] = useState("")
  const [funcao, setFuncao] = useState("")
  const [file, setFile] = useState("")
  const CreatePhotoField = useRef()

  async function submitHandler(e) {
    e.preventDefault()
    const data = new FormData()
    data.append("photo", file)
    data.append("name", name)
    data.append("funcao", funcao)
    setName("")
    setFuncao("")
    setFile("")
    CreatePhotoField.current.value = ""
    const newPhoto = await Axios.post("/create-funcionario", data, { headers: { "Content-Type": "multipart/form-data" } })
    props.setFuncionarios(prev => prev.concat([newPhoto.data]))
  }

  return (
    <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
      <div className="mb-2">
        <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
      </div>
      <div className="mb-2">
        <input onChange={e => setName(e.target.value)} value={name} type="text" className="form-control" required placeholder="Nome do Funcionário" />
      </div>
      <div className="mb-2">
        <input onChange={e => setFuncao(e.target.value)} value={funcao} type="text" className="form-control" required placeholder="Função do Funcionário" />
      </div>

      <button className="btn btn-success">Criar novo Funcionário</button>
    </form>
  )
}

export default CreateNewForm