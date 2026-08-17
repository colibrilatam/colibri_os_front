export const routeConfig = {
  routes: [
    {
      path: '/evaluations',
      protected: true,
      roles: ['admin','mentor', 'evaluator'],
      header: 'main',
      padding: 'pt-24',
    },

    {
      path: '/dashboard',
      protected: true,
      roles: ['admin','entrepreneur', 'mentor', 'mecenas_semilla'],
      header: 'project',
      padding: 'pt-0',
    },
    {
      path: '/user',
      protected: true,
      roles: ['admin','entrepreneur', 'mecenas_semilla'],
      header: 'project',
      padding: 'pt-0',
    },
    {
      path: '/proyecto',
      protected: true,
      roles: ['admin','entrepreneur', 'mecenas_semilla'],
      header: 'main',
      padding: 'pt-24',
    },

    {
      path: '/admin',
      protected: true,
      roles: ['admin','admin'],
      header: 'main',
      padding: 'pt-24',
    },

    {
      path: '/login',
      protected: false,
      header: null,
      padding: '',
    },
    {
      path: '/home',
      protected: true,
      roles: ['admin','entrepreneur', 'mentor', 'mecenas_semilla'],
      header: 'project',
      padding: 'pt-0',
    },
  ],
};

export function getRouteConfig(pathname) {
  return (
    routeConfig.routes.find((route) => pathname.startsWith(route.path)) || {
      protected: false,
      header: null,
      padding: '',
      roles: ['admin',],
    }
  );
}
