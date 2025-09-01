import { Routes } from '@angular/router';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes as clientRoutes } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'details/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'updateproduct/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];

export default serverRoutes;
