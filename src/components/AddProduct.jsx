import { PhotoIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import SimpleReactValidator from 'simple-react-validator';

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [stripeImageUrl, setStripeImageUrl] = useState(null);

  useEffect(() => {
    // Limpiar la URL temporal cuando el componente se desmonte
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  const handleImageSelect = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setImageFile({ file, preview: imageUrl });
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const changeHandler = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  const [validator] = useState(
    new SimpleReactValidator({
      className: 'errorMessage',
    })
  );

  const getImageUrlFromStripeFileId = (fileId) => {
    if (fileId && fileId.length > 0) {
      return `https://files.stripe.com/v1/files/${fileId[0]}`; // Extraer el ID del archivo del arreglo
    }
  };
  

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('proImg', imageFile.file);

      const respuesta = await axios.post('https://75.101.211.126/products', formData);
      console.log(respuesta);

      // Obtener la URL de la imagen desde el ID del archivo en Stripe
      const imageUrl = getImageUrlFromStripeFileId(respuesta.data.proImg);

      // Actualizar la URL de la imagen
      setStripeImageUrl(imageUrl);

      toast.success('El producto se agregó correctamente');

      // Limpiar los campos del formulario y la imagen después de agregar exitosamente
      setProduct({
        title: '',
        price: '',
        description: '',
      });
      setImageFile(null);
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al agregar el producto');
    }
  };

  return (
    <>
      <ToastContainer />

      <form onSubmit={submitForm}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Llenar todos los campos</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Llenar todos los campos y proporcionar sus datos personales.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={product.title}
                    onChange={changeHandler}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                precio
                </label>
                <div className="mt-2">
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={changeHandler}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>


              <div className="sm:col-span-4">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Descripcion
                </label>
                <div className="mt-2">
                  <input
                    id="description"
                    name="description"
                    type="text"
                    value={product.description}
                    onChange={changeHandler}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>            
              
              <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Imagen
                </label>
                <div
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                >
                  <div className="text-center">
                    {imageFile?.preview ? (
                      <img
                        src={imageFile.preview}
                        alt="Imagen cargada"
                        className="h-32 w-32 mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="proImg"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Subir una foto</span>
                        <input id="proImg" name="proImg" type="file" className="sr-only" onChange={(e) => handleImageSelect(e.target.files[0])} />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF de hasta 10MB</p>
                  </div>
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
            Enviar
          </button>
        </div>
      </form>
    </>
  )
};

export default AddProduct;
