'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsService } from '@/services/project';
import { useRequest } from '@/hooks/useRequest';
import { useUserStore } from '@/lib/store';
import { userService } from '@/services/user';
import { useNewProject } from '@/hooks/useNewProject';
import { useTranslation } from '@/hooks/useTranslation';

export default function CreateProject() {
  const { t } = useTranslation('proyecto');
  const router = useRouter();
  
  const { create } = useNewProject();
  const [ formError, setFormError ] = useState(null);

  const { execute: createProject } = useRequest(projectsService.create);
  const { execute, error } = useRequest(projectsService.getAll);
  const { execute: getUser } = useRequest(() => userService.profile());

  const demoHandleSubmit = async (e) => {
    e.preventDefault();
    
    const { data } = await execute();
    if(error){
        setFormError(t('errorFetchProjects'));
    }
    const { data: userData } = await getUser();
    const projectId = data?.find((p) => p.projectName === "FlujoClave").id || [];

    router.push(`/dashboard/${projectId}/identidad`);
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
      image: null
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
    image: ''
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
      projectName: t('errorRequiredProjectName'),
      country: t('errorRequiredCountry'),
      industry: t('errorRequiredIndustry'),
      tagline: t('errorRequiredTagline'),
      shortDescription: t('errorRequiredShortDescription'),
      startupLinkedinUrl: t('errorRequiredLinkedin'),
      websiteUrl: t('errorRequiredWebsite'),
    };

    const urlFields = ['startupLinkedinUrl', 'websiteUrl', 'rlabProfileUrl'];

    if (value.trim() === '') {
      newErrors[name] = requiredFields[name];
    } else if (urlFields.includes(name) && !validateUrl(value)) {
      newErrors[name] = t('errorInvalidUrl');
    } else {
      newErrors[name] = '';
    }

    setErrors(newErrors);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    const newErrors = { ...errors };

    if (file) {
      const validImageFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!validImageFormats.includes(file.type)) {
        newErrors[name] = t('errorInvalidImage');
        setFormData((prev) => ({ ...prev, [name]: null }));
      } else {
        newErrors[name] = '';
        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      newErrors[name] = '';
      setFormData((prev) => ({ ...prev, [name]: null }));
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    const requiredFields = ['projectName', 'country', 'industry', 'tagline', 'shortDescription', 'startupLinkedinUrl', 'websiteUrl'];
    const hasRequiredFields = requiredFields.every((field) => formData[field].trim() !== '');
    const hasNoErrors = Object.values(errors).every((e) => e === '');
    return hasRequiredFields && hasNoErrors;
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      
      setFormError(t('errorFormInvalid'));
      return 
    }

    const payload = {
      ...formData,
      status: 'active',
      trajectoryStatus: 'on_track',
    };
    //create(payload);
    //return;

    setLoading(true);
    try {
      const createdProject = await create(payload);

      if(createdProject.error){
        const errorMessage = createdProject.error || t('errorUnknown');
        setFormError(t('errorCreateProject'), errorMessage);
        return;
      }
      router.push(`/dashboard/${createdProject.id}/about`);
    } catch (err) {
      setFormError(t('errorCreateProject'), err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'projectName',        label: t('fieldProjectName'),  type: 'text' },
    { name: 'country',            label: t('fieldCountry'),      type: 'text' },
    { name: 'industry',           label: t('fieldIndustry'),     type: 'text' },
    { name: 'tagline',            label: t('fieldTagline'),      type: 'text' },
    { name: 'shortDescription',   label: t('fieldShortDescription'), type: 'textarea' },
    { name: 'startupLinkedinUrl', label: t('fieldLinkedin'),     type: 'text' },
    { name: 'websiteUrl',         label: t('fieldWebsite'),      type: 'text' },
  ];

  return (
    <div className='p-4 border-glass glass-effect'>
        <div className="mb-4 flex flex-col items-center text-center  p-4 rounded-2xl border-glass glass-effect">
            <h1 >{t('title')}</h1>
            <p className="max-w-3xl text-(--text-tertiary) text-center hyphens-auto">{t('description')}</p>
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

        <div>
          <label className="text-micro-label block mb-2">{t('fieldImage')}</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 file:bg-[var(--action-primary)] file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer ${
              errors['image'] ? 'border-red-500' : ''
            }`}
          />
          {formData.image && (
            <p className="text-green-500 text-xs mt-1">{t('fileSelected')} {formData.image.name}</p>
          )}
          {errors['image'] && (
            <p className="text-red-500 text-xs mt-1">{errors['image']}</p>
          )}
        </div>

        {formError && (
            <p className="text-red-500 text-xl mt-2">{formError}</p>
        )}

        <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
            !loading
                ? 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer'
                : 'bg-gray-500 cursor-not-allowed opacity-60'
            }`}
        >
            {loading ? t('btnCreating') : t('btnCreate')}
        </button>

        <button
            type="button"
            onClick={() => router.back()}
            className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
        >
            {t('btnBack')}
        </button>
        </form>
    </div>
  );
}
