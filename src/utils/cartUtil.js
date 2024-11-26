import Swal from 'sweetalert2';
import axios from '../utils/AxiosHelper';

export const handleAddToCart = async (productCode, userId, setLoading) => {
    if (userId === null) {
        Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "First, you must be logged in before adding any product to a cart."
        });
        return;
    }

    const jwtToken = localStorage.getItem('token');
    setLoading(true);

    try {
       
        const response = await axios.put(
            `/products/add/${userId}/${productCode}`,
            null,{
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },}
        );

        if (response.status === 200) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Product added to cart.",
                showConfirmButton: false,
                timer: 1000
            });
        }
    } catch (e) {
        console.error('Error:', e);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error adding the product to cart."
        });
    } finally {
        setLoading(false);
    }
};