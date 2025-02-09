const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'analyse', path: '/analyse', component: () => import('pages/AnalysePage.vue')},
      { name: 'download', path: '/download', component: () => import('pages/DownloadPage.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
