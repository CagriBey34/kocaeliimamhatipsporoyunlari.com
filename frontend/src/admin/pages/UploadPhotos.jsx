import React from 'react';
import UploadForm from '../components/UploadForm';

const UploadPhotos = () => {
  return (
    <div className="bg-gray-100 min-h-screen">      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Fotoğraf Yükle</h2>
          <UploadForm />
        </div>
      </main>
    </div>
  );
};

export default UploadPhotos;