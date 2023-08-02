import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';

const AddParejaForm = () => {
  const [value, setValue] = useState({
    slug: '',
    title: '',
    date: '',
    location: '',
  });

  const [imageUrls, setImageUrls] = useState({
    pSimg: '',
    pimg1: '',
    pimg2: '',
    pimg3: '',
  });

  const [imageFiles, setImageFiles] = useState({
    pSimg: null,
    pimg1: null,
    pimg2: null,
    pimg3: null,
  });

  useEffect(() => {
    // Limpiar las URLs temporales cuando el componente se desmonte
    return () => {
      Object.values(imageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageSelect = (file, name) => {
    const imageUrl = URL.createObjectURL(file);
    setImageUrls((prevImageUrls) => ({ ...prevImageUrls, [name]: imageUrl }));
    setImageFiles((prevImageFiles) => ({ ...prevImageFiles, [name]: file }));
  };

  const handleImageDrop = (e, name) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageSelect(file, name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  const [validator] = useState(
    new SimpleReactValidator({
      className: 'errorMessage',
    })
  );

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(imageFiles).forEach((key) => {
        formData.append(key, imageFiles[key]);
      });
      formData.append('slug', value.slug);
      formData.append('title', value.title);
      formData.append('date', value.date);
      formData.append('location', value.location);

      const respuesta = await axios.post('75.101.211.126:4001/parejas', formData);
      console.log(respuesta);
      toast.success('La pareja se agregó correctamente');

      // Limpiar los campos del formulario y las URLs de las imágenes después de agregar exitosamente
      setValue({
        slug: '',
        title: '',
        date: '',
        location: '',
      });
      setImageUrls({
        pSimg: null,
        pimg1: null,
        pimg2: null,
        pimg3: null,
      });
      setImageFiles({
        pSimg: null,
        pimg1: null,
        pimg2: null,
        pimg3: null,
      });
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al agregar la pareja');
    }
  };

  return (
    <>
      <ToastContainer />

      <form onSubmit={submitForm}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Crear Nuevas Parejas</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="sm:col-span-4">
                <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                  SLUG
                </label>
                <div className="mt-2">
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={value.slug}
                    onChange={(e) => changeHandler(e)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  NOMBRE
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={value.title}
                    onChange={(e) => changeHandler(e)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  PORTADA
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDrop={(e) => handleImageDrop(e, 'pSimg')}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragEnter={(e) => handleDragEnter(e)}
                >
                  <div className="text-center">
                    {imageUrls.pSimg ? (
                      <img
                        src={imageUrls.pSimg}
                        alt="Imagen cargada"
                        className="h-32 w-32 mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="pSimg"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Subir una foto</span>
                        <input id="pSimg" name="pSimg" type="file" className="sr-only" onChange={(e) => handleImageSelect(e.target.files[0], 'pSimg')} />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF de hasta 10MB</p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  EXTRA 1
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDrop={(e) => handleImageDrop(e, 'pimg1')}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragEnter={(e) => handleDragEnter(e)}
                >
                  <div className="text-center">
                    {imageUrls.pimg1 ? (
                      <img
                        src={imageUrls.pimg1}
                        alt="Imagen cargada"
                        className="h-32 w-32 mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="pimg1"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Subir una foto</span>
                        <input id="pimg1" name="pimg1" type="file" className="sr-only" onChange={(e) => handleImageSelect(e.target.files[0], 'pimg1')} />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF de hasta 10MB</p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  EXTRA 2
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDrop={(e) => handleImageDrop(e, 'pimg2')}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragEnter={(e) => handleDragEnter(e)}
                >
                  <div className="text-center">
                    {imageUrls.pimg2 ? (
                      <img
                        src={imageUrls.pimg2}
                        alt="Imagen cargada"
                        className="h-32 w-32 mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="pimg2"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Subir una foto</span>
                        <input id="pimg2" name="pimg2" type="file" className="sr-only" onChange={(e) => handleImageSelect(e.target.files[0], 'pimg2')} />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF de hasta 10MB</p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  EXTRA 3
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDrop={(e) => handleImageDrop(e, 'pimg3')}
                  onDragOver={(e) => handleDragOver(e)}
                  onDragEnter={(e) => handleDragEnter(e)}
                >
                  <div className="text-center">
                    {imageUrls.pimg3 ? (
                      <img
                        src={imageUrls.pimg3}
                        alt="Imagen cargada"
                        className="h-32 w-32 mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="pimg3"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Subir una foto</span>
                        <input id="pimg3" name="pimg3" type="file" className="sr-only" onChange={(e) => handleImageSelect(e.target.files[0], 'pimg3')} />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF de hasta 10MB</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                  FECHA
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={value.date}
                    onChange={(e) => changeHandler(e)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                  LOCALIZACION
                </label>
                <div className="mt-2">
                  <select
                    id="location"
                    name="location"
                    value={value.location}
                    onChange={(e) => changeHandler(e)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option disabled value="">
                      Seleccionar destino
                    </option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
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

  )
};

export default AddParejaForm;
