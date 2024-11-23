import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51POgezRqxU2e6hROnjzJ0YsIG3aKfYckIhbGHfF4G2M7ey0Es2gYhEf4QVf4iGgJI2j0H7Y9smliGawBDvPEMu7f00D12gyOcH');

export default stripePromise;