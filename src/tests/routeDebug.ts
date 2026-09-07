import app from '../server';

export function debugRoutes() {
  const routes: any[] = [];
  
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const route = handler.route;
          routes.push({
            path: route.path,
            methods: Object.keys(route.methods)
          });
        }
      });
    }
  });
  
  console.log('Available routes:');
  routes.forEach(route => {
    console.log(`- ${Object.keys(route.methods).join(', ').toUpperCase()} ${route.path}`);
  });
  
  return routes;
}