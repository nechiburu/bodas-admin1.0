// pages/NuevosRegalos.jsx

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AddProduct from '../components/AddProduct';

const stripePromise = loadStripe('pk_test_51NIuUSBVZkoMCPQO4M9bItvEYI8PbKWrWZ1Vh5Bh2OGixEEO8b61QWiXcAMrMOnEzVuCLAGQhrrKqWP19MnZCd5F00VmEumVff'); // Reemplaza 'TU_CLAVE_PUBLICA_DE_STRIPE' con tu clave pública de Stripe

const NuevosRegalos = () => {
  return (
    <div>
      <h2>Agregar nuevos regalos</h2>
      <Elements stripe={stripePromise}>
        <AddProduct />
      </Elements>
    </div>
  );
};

export default NuevosRegalos;
