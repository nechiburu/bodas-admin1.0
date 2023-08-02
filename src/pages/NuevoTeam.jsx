import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';

const AddTeamForm = () => {
  const [value, setValue] = useState({
    slug: '',
    title: '',
    name: '',
  });

  const [parejas, setParejas] = useState([]); // Agregamos el estado para almacenar las parejas
  const [selectedPareja, setSelectedPareja] = useState(null); // Estado para almacenar la pareja seleccionada

  useEffect(() => {
    // Función para obtener las parejas desde el servidor
    const fetchParejas = async () => {
      try {
        const response = await axios.get(process.env.BACKEND_URL + '/parejas');
        setParejas(response.data); // Actualizamos el estado con las parejas recuperadas
      } catch (error) {
        console.log(error);
      }
    };

    // Llamamos a la función fetchParejas una vez cuando el componente se monta
    fetchParejas();
  }, []);

  const [validator] = useState(
    new SimpleReactValidator({
      className: 'errorMessage',
    })
  );

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  // Función para manejar el cambio en la selección de pareja
  const handleParejaChange = (e) => {
    const selectedPareja = parejas.find((pareja) => pareja.title === e.target.value);
    setSelectedPareja(selectedPareja);
    changeHandler(e);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (!selectedPareja) {
        toast.error('Selecciona una pareja válida');
        return;
      }

      const formData = new FormData();
      formData.append('slug', selectedPareja.title); // El slug tendrá el mismo valor que el nombre de la pareja seleccionada
      formData.append('title', value.title);
      formData.append('name', value.name);

      // Hacemos otra solicitud para obtener la imagen de la pareja seleccionada
      const response = await axios.get(process.env.BACKEND_URL + `/parejas/${selectedPareja._id}`);
      if (response && response.data && response.data.pSimg) {
        const imageBlob = await fetch(process.env.BACKEND_URL + `/uploads/${response.data.pSimg}`).then((res) => res.blob());
        formData.append('tImg', imageBlob, response.data.pSimg);
      } else {
        toast.error('No se pudo obtener la imagen de la pareja seleccionada');
        return;
      }

      const respuesta = await axios.post(process.env.BACKEND_URL + '/team', formData);
      console.log(respuesta);
      toast.success('El equipo se agregó correctamente');

      // Limpiar los campos del formulario y el estado de la pareja seleccionada después de agregar exitosamente
      setValue({
        slug: '',
        title: '',
        name: '',
      });
      setSelectedPareja(null);
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al agregar el equipo');
    }
  };

  return (
    <>
      <ToastContainer />

      <form onSubmit={submitForm}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Crear Nuevos Equipos</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  TITULO
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={value.title}
                    onChange={changeHandler} // Cambio para el manejo del cambio
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  PAREJA
                </label>
                <div className="mt-2">
                  <select
                    id="name"
                    name="name"
                    value={value.name}
                    onChange={handleParejaChange} // Cambio para el manejo del cambio de pareja
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option disabled value="">
                      Seleccionar pareja
                    </option>
                    {parejas.map((pareja) => (
                      <option key={pareja._id} value={pareja.title}>
                        {pareja.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default AddTeamForm;
