import React, {useState, useEffect} from "react";

const API = process.env.REACT_APP_API;
export const Users = () => {
    const [documentType, setDocumentType] = useState("");
    const [document, setDocument] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [hobbie, setHobbie] = useState("");

    const [editing, setEditing] = useState(false)
    const [id, setId] = useState("")

    let [users,setUsers]=useState([])

    const handleSubmit= async (e) => {
        e.preventDefault();
        if(!editing){
            const res = await fetch(`${API}/users`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    documentType,
                    document,
                    name,
                    lastname,
                    hobbie
                }),
            });
            await res.json();
        }else{
            const res = await fetch(`${API}/users/${id}`, {
                method : 'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    documentType,
                    document,
                    name,
                    lastname,
                    hobbie
                })
            })
            const data = await res.json();
            console.log(data);
            setEditing(false);
            setId("")
        }
        
        await getUsers();

        setDocumentType("");
        setDocument("");
        setName("");
        setLastname("");
        setHobbie("");
    }

    const getUsers = async() => {
        const res = await fetch(`${API}/users`)
        const data = await res.json();
        setUsers(data)
    }

    const deleteUser = async  (id) => {
        const userResponse = window.confirm('¿Esta seguro de eliminar al usuario?')
        if(userResponse){
            const res = await fetch(`${API}/users/${id}`,{
                method: 'DELETE'
            })
            const data = await res.json();
      	    console.log(data);
            await getUsers();
        }  

    };

    const editUser = async (id) => {
        const res = await fetch(`${API}/users/${id}`);
        const data = await res.json();

        console.log(res)
        setEditing(true);
        setId(id);

        setDocumentType(data.documentType);
        setDocument(data.document);
        setName(data.Name);
        setLastname(data.lastname);
        setHobbie(data.hobbie);
    };

 useEffect(()=>{
        getUsers();
    }, []);

return (
    <div className="row">
        <div className="col-md-4">
            <form onSubmit={handleSubmit} className="card card-body">
            <div className="form-group">
                <input 
		type="text" 
		onChange={(e) => setDocumentType(e.target.value)} 
		value={documentType} 
		className="form-control" 
		placeholder="Tipo de documento" 
		autoFocus></input>
            </div>
            <div className="form-group">
                <input 
		type="text" 
		onChange={(e) => setDocument(e.target.value)} 
		value={document} 
		className="form-control" 
		placeholder="Documento" 
		autoFocus></input>
            </div>
            <div className="form-group">
                <input 
		type="text" 
		onChange={(e) => setName(e.target.value)} 
		value={name} 
		className="form-control" 
		placeholder="Nombre" 
		autoFocus></input>
            </div>
            <div className="form-group">
                <input 
		type="text" 
		onChange={(e) => setLastname(e.target.value)} 
		value={lastname} 
		className="form-control" 
		placeholder="Apellidos" 
		autoFocus></input>
            </div>
            <div className="form-group">
                <input 
		type="text" 
		onChange={(e) => setHobbie(e.target.value)} 
		value={hobbie} 
		className="form-control" 
		placeholder="hobbie" 
		autoFocus></input>
            </div>
            <button type="primary" >
                {editing ? 'Editar' : 'Crear'}
            </button>
            </form>
        </div>
        <div className="col md-6">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Tipo de documento</th>
                        <th>Documento</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Hobbie</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user)=>(
                    <tr key={user._id}>
                        <td>{user.documentType}</td>
                        <td>{user.document}</td>
                        <td>{user.name}</td>
                        <td>{user.lastname}</td>
                        <td>{user.hobbie}</td>
                        <td><button className="btn btn-secondary btn-sm btn-block" onClick={(e) => editUser(user._id)}>
                            Editar
                        </button>
                        <button className="btn btn-danger btn-sm btn-block" onClick={(e) => deleteUser(user._id)}>
                            Eliminar
                        </button></td> 
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};