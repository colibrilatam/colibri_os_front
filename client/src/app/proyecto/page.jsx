'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsService } from '@/services/project';
import { useRequest } from '@/hooks/useRequest';
import { useUserStore } from '@/lib/store';
import { userService } from '@/services/user';

export default function CreateProject() {
  const router = useRouter();

  const { execute, error } = useRequest(projectsService.getAll);
  const { execute: getUser } = useRequest(() => userService.profile());

  const demoHandleSubmit = async (e) => {
    e.preventDefault();
    
    const { data } = await execute();
    if(error){
        alert(error);
    }
    const { data: userData } = await getUser();
    const projectId = data?.find((p) => p.projectName === "FlujoClave").id || [];

    alert('Demostración de registro');
    router.push(`/dashboard/${projectId}/senial`);
  };

  // DEMO
  const isDemo = useUserStore((state) => state.isDemo);


    const [formData, setFormData] = useState({
      projectName: '',
      country: '',
      industry: '',
      tagline: '',
      shortDescription: '',
      startupLinkedinUrl: '',
      websiteUrl: '',
    })

useEffect(() => {
  if (isDemo) {
    setFormData({
      projectName: 'FlujoClave',
      country: 'Colombia',
      industry: 'Fintech',
      tagline: 'Tecnología para una educación mejor',
      shortDescription: 'Proyecto edtech en etapa fundacional que explora una solución simple para organizar actividades, seguimiento y alertas básicas de continuidad académica en educación media venezolana.',
      startupLinkedinUrl: 'https://linkedin.com/company/mi-startup',
      websiteUrl: 'https://mi-startup.com',
    });
  }
}, [isDemo])

  const [errors, setErrors] = useState({
    projectName: '',
    country: '',
    industry: '',
    tagline: '',
    shortDescription: '',
    startupLinkedinUrl: '',
    websiteUrl: '',
  });



  const [loading, setLoading] = useState(false);

  const validateUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    const requiredFields = {
      projectName: 'El nombre del proyecto es requerido',
      country: 'El país es requerido',
      industry: 'La industria es requerida',
      tagline: 'El tagline es requerido',
      shortDescription: 'La descripción corta es requerida',
      startupLinkedinUrl: 'La URL de LinkedIn es requerida',
      websiteUrl: 'La URL del sitio web es requerida',
    
    };

    const urlFields = ['startupLinkedinUrl', 'websiteUrl', 'rlabProfileUrl'];

    if (value.trim() === '') {
      newErrors[name] = requiredFields[name];
    } else if (urlFields.includes(name) && !validateUrl(value)) {
      newErrors[name] = 'La URL no tiene un formato válido';
    } else {
      newErrors[name] = '';
    }

    setErrors(newErrors);
  };

  const isFormValid = () =>
    Object.values(formData).every((v) => v.trim() !== '') &&
    Object.values(errors).every((e) => e === '');

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      return alert('Por favor, corrige los errores en el formulario antes de continuar.');
    }

    const payload = {
      ...formData,
      status: 'active',
      trajectoryStatus: 'on_track',
    };

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al crear el proyecto');

      alert('¡Proyecto creado correctamente!');
      router.push('/home');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'projectName',        label: 'Nombre del proyecto',  type: 'text' },
    { name: 'country',            label: 'País',                 type: 'text' },
    { name: 'industry',           label: 'Industria',            type: 'text' },
    { name: 'tagline',            label: 'Tagline',              type: 'text' },
    { name: 'shortDescription',   label: 'Descripción corta',    type: 'textarea' },
    { name: 'startupLinkedinUrl', label: 'LinkedIn de la startup', type: 'text' },
    { name: 'websiteUrl',         label: 'Sitio web',            type: 'text' },
    
  ];

  return (
    <div className='p-4 border-glass glass-effect'>
        <div className="mb-4 flex flex-col items-center text-center  p-4 rounded-2xl border-glass glass-effect">
            <h1 >Crear Proyecto</h1>
            <p className="max-w-3xl text-(--text-tertiary) text-center hyphens-auto">Registra tu proyecto en Colibrí OS. Una vez creado podrás ingresar al Reputation Lab para gestionarlo.</p>
        </div>
        <form onSubmit={isDemo ? demoHandleSubmit : handleSubmit} className="space-y-5">
        {fields.map(({ name, label, type }) => (
            <div key={name}>
            <label className="text-micro-label block mb-2">{label}</label>
            {type === 'textarea' ? (
                <textarea
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 resize-none ${
                    errors[name] ? 'border-red-500' : ''
                }`}
                />
            ) : (
                <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                    errors[name] ? 'border-red-500' : ''
                }`}
                />
            )}
            {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
            </div>
        ))}

        <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
            !loading
                ? 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer'
                : 'bg-gray-500 cursor-not-allowed opacity-60'
            }`}
        >
            {loading ? 'Creando proyecto...' : 'Crear proyecto'}
        </button>

        <button
            type="button"
            onClick={() => router.back()}
            className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
        >
            Volver atrás
        </button>
        </form>
    </div>
  );
}
