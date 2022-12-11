export const AuthInterceptors = {
    JWT: 'JWT',
    BASIC: 'BASIC'
};

export const environment = {
    production: true,
    baseUrl: 'https://dms-spring-boot-production.up.railway.app/api/v1',
    host: 'https://dms-spring-boot-production.up.railway.app',
    authInterceptor: AuthInterceptors.JWT,
    wsSpring: 'wss://dms-spring-boot-production.up.railway.app'
};
