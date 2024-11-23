import { jwtDecode } from 'jwt-decode';


const fetchUserRoles = () => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const roles = decodedToken.roles;

            console.log('Roles del usuario:', roles);

            return roles;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            throw error; 
        }
    } else {
        console.log('Token no encontrado');
        return null;
    }
};

export default fetchUserRoles;