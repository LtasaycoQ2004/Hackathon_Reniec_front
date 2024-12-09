import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './App.css';
import BASE_URL from './config/apiConfig'

function App() {
  const url = BASE_URL+"reniec";

  const [todos, setTodos] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [showEliminar, setShowEliminar] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showRestaurar, setShowRestaurar] = useState(false);
  const [dni, setDni] = useState('');
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [dniEditar, setDniEditar] = useState('');

  const fetchApi = async () => {
    const response = await fetch(url + "/listar/A");
    const data = await response.json();
    setTodos(data);
  };

  const fetchInactive = async () => {
    const response = await fetch(url + "/listar/I");
    const data = await response.json();
    setTodos(data);
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    if (isActive) {
      fetchInactive();
    } else {
      fetchApi();
    }
  };

  const handleShowEliminar = (id) => {
    setSelectedId(id);
    setShowEliminar(true);
  };

  const handleShowRestaurar = (id) => {
    setSelectedId(id);
    setShowRestaurar(true);
  };

  const handleShowRegistrar = () => {
    setShowRegistrar(true);
  };

  const handleShowEditar = (id, dni) => {
    setSelectedId(id);
    setDniEditar(dni);
    setShowEditar(true);
  };

  const handleClose = () => {
    setShowEliminar(false);
    setShowRestaurar(false);
    setShowRegistrar(false);
    setShowEditar(false);
  };

  const eliminar = async (id) => {
    const response = await fetch(`${url}/inactivar/${id}`, { method: 'DELETE' });
    if (response.ok) {
      Swal.fire('Eliminado!', 'La traducción fue eliminada correctamente.', 'success');
      fetchApi();
    } else {
      Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
    }
    setShowEliminar(false);
  };

  const restaurar = async (id) => {
    const response = await fetch(`${url}/restaurar/${id}`, { method: 'PUT' });
    if (response.ok) {
      Swal.fire('Restaurado!', 'La traducción fue restaurada correctamente.', 'success');
      fetchInactive();
    } else {
      Swal.fire('Error', 'Hubo un problema al restaurar.', 'error');
    }
    setShowRestaurar(false);
  };

  const consultarDni = async (dni) => {
    try {
      const response = await fetch(`${url}/consultar?dni=${dni}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        Swal.fire('Consulta Exitosa', 'DNI consultado con éxito', 'success');
      } else {
        Swal.fire('Error', 'Hubo un error al consultar el DNI.', 'error');
      }
    } catch (error) {
      console.error('Error al consultar el DNI:', error);
      Swal.fire('Error', 'Hubo un error al consultar el DNI.', 'error');
    }
    setDni('');
    fetchApi();
    setShowRegistrar(false);
  };

  const editarDni = async () => {
    try {
      const response = await fetch(`${url}/editar/${selectedId}?dni=${dniEditar}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire('Actualizado!', 'El DNI fue actualizado correctamente.', 'success');
      } else {
        Swal.fire('Error', 'Hubo un error al editar el DNI.', 'error');
      }
    } catch (error) {
      console.error('Error al editar el DNI:', error);
      Swal.fire('Error', 'Hubo un error al editar el DNI.', 'error');
    }
    fetchApi();
    setShowEditar(false);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div className="container mt-5">

      <h1 class="api-title">API RENIEC - HACKATHON</h1>
      <br />
      <br />

      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="warning"
          onClick={toggleActive}
          className="btn-custom"
        >
          {isActive ? 'Mostrar Inactivos' : 'Mostrar Activos'}
        </Button>
        <Button
          variant="success"
          onClick={handleShowRegistrar}
          className="btn-custom"
        >
          Registrar
        </Button>
      </div>

      {todos.length === 0 ? (
        <div className="loading">Cargando...</div>

      ) : (


        <Table striped bordered hover responsive className="table-custom">
          <thead>
            <tr>
              <th>ID</th>
              <th>DNI</th>
              <th>NOMBRES</th>
              <th>APELLIDO PATERNO</th>
              <th>APELLIDO MATERNO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.dni}</td>
                <td>{todo.nombres}</td>
                <td>{todo.apellidoPaterno}</td>
                <td>{todo.apellidoMaterno}</td>
                <td>
                  <div className="action-buttons">
                    {isActive && (
                      <Button
                        variant="primary"
                        onClick={() => handleShowEditar(todo.id, todo.dni)}
                        className="btn-action"
                      >
                        Editar
                      </Button>
                    )}
                    {isActive && (
                      <Button
                        variant="danger"
                        onClick={() => handleShowEliminar(todo.id)}
                      >
                        Eliminar
                      </Button>
                    )}
                    {!isActive && (
                      <Button variant="success" onClick={() => handleShowRestaurar(todo.id)} >
                        Restaurar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showEliminar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Traducción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de querer eliminar la traducción con el ID: {selectedId}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="danger" onClick={() => eliminar(selectedId)}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRestaurar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Restaurar Traducción</Modal.Title>
        </Modal.Header>
        <Modal.Body>Restaurar datos con el ID: {selectedId}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="success" onClick={() => restaurar(selectedId)}>Restaurar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRegistrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Traducción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDni">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="success" onClick={() => consultarDni(dni)}>Consultar</Button>

        </Modal.Footer>
      </Modal>

      {/* Modal para editar */}
      <Modal show={showEditar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar DNI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDniEditar">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                value={dniEditar}
                onChange={(e) => setDniEditar(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={editarDni}>Actualizar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
