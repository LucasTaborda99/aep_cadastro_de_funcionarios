import Axios from "axios"
import React, { useState } from "react"

function FuncionarioCard(props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [file, setFile] = useState()
  const [draftFuncao, setDraftFuncao] = useState("")

  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    props.setFuncionarios(prev =>
      prev.map(function (funcionario) {
        if (funcionario._id == props.id) {
          return { ...funcionario, name: draftName, funcao: draftFuncao }
        }
        return funcionario
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
    }
    data.append("_id", props.id)
    data.append("name", draftName)
    data.append("funcao", draftFuncao)
    const newPhoto = await Axios.post("/update-funcionario", data, { headers: { "Content-Type": "multipart/form-data" } })
    if (newPhoto.data) {
      props.setFuncionarios(prev => {
        return prev.map(function (funcionario) {
          if (funcionario._id == props.id) {
            return { ...funcionario, photo: newPhoto.data }
          }
          return funcionario
        })
      })
    }
  }

  return (
    <div className="card">
      <div className="our-card-top">
        {isEditing && (
          <div className="our-custom-input">
            <div className="our-custom-input-interior">
              <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
            </div>
          </div>
        )}
        <img src={props.photo ? `/uploaded-photos/${props.photo}` : "/fallback.png"} className="card-img-top" alt={`${props.funcao} named ${props.name}`} />
      </div>
      <div className="card-body">
        {!isEditing && (
          <>
            <h4>{props.name}</h4>
            <p className="text-muted small">{props.funcao}</p>
            {!props.readOnly && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setDraftName(props.name)
                    setDraftFuncao(props.funcao)
                    setFile("")
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/funcionario/${props.id}`)
                    props.setFuncionarios(prev => {
                      return prev.filter(funcionario => {
                        return funcionario._id != props.id
                      })
                    })
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div className="mb-1">
              <input autoFocus onChange={e => setDraftName(e.target.value)} type="text" className="form-control form-control-sm" value={draftName} />
            </div>
            <div className="mb-2">
              <input onChange={e => setDraftFuncao(e.target.value)} type="text" className="form-control form-control-sm" value={draftFuncao} />
            </div>
            <button className="btn btn-sm btn-success">Save</button>{" "}
            <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-outline-secondary">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default FuncionarioCard
