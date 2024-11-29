import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useState, useEffect, createContext} from 'react';
import {SellerPosts} from './components/userSeller/sellerPosts/SellerPosts';
import './App.css';
import { Home } from './components/home/Home';
import {ProductDetail} from './components/home/productDetail/ProductDetail';
import { LoginForm } from './components/loginForm/LoginForm';
import { UserSeller } from './components/userSeller/UserSeller';
import { SellProduct } from './components/postSell/products/SellProduct';
import { UserCart } from './components/userCart/UserCart';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {productsUrl} from './utils/AxiosHelper';
import axios from './utils/AxiosHelper';

export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart'); // Opcional: limpiar el localStorage si hay un error
      }
    }
    return [];
  });
  
 const fetchProducts = async () => {
    setLoading(true);
    try {
        const { data, status } = await axios.get(`${productsUrl}/products/get`);
        if (status === 200) {
            setProducts(data);
        } else {
            throw new Error(`HTTP error! status: ${status}`);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        setLoading(false);
    }
};


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Verifica si el token existe en localStorage
    fetchProducts();
    }, []);
  

    function SessionVerifier() {
      const navigate = useNavigate();

      useEffect(() => {
          const token = localStorage.getItem('token');
          if (token) {
              const loginTime = localStorage.getItem('loginTime');
              const currentTime = new Date();
              const loginDate = new Date(loginTime);
              const timeDiff = currentTime - loginDate;
              const timeDiffInHours = timeDiff / (1000 * 60 * 60);
              
              if (timeDiffInHours >= 24) {
                  // Expired session
                  localStorage.removeItem('token');
                  localStorage.removeItem('loginTime');
                  localStorage.removeItem('email');
                  localStorage.removeItem('user_id');
                  localStorage.removeItem('fullName');
                  setIsAuthenticated(false);
                  Swal.fire({
                      position: "top-end",
                      icon: "warning",
                      title: "Session expired",
                      text: "Your session has expired. Please log in again.",
                      showConfirmButton: false,
                      timer: 2500
                  });
                  navigate('/login');
              } else {
                  setIsAuthenticated(true);
              }
          }
      }, [navigate]);
      
      return null;
  }
  return (
    
      <div className="App">
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, name, setName, email, setEmail, products, setProducts, loading, setLoading, fetchProducts }}>
            <Router>
            <SessionVerifier />
              <div className='body-div'>
                <Routes>
                  <Route path="/" element={<Home setCart={setCart} cart={cart}/>} ></Route>
                  <Route path="/product/:productId" element={<ProductDetail products={products}></ProductDetail>} />
                  <Route path="/login" element={<LoginForm/>} ></Route>
                  <Route path="/user-seller" element={<UserSeller/>} ></Route>
                  <Route path="/seller-posts" element={<SellerPosts/>} ></Route>
                  <Route path="/user-cart" element={<UserCart setCart={setCart} cart={cart}/>} ></Route>
                  <Route path="/sell-product" element={<SellProduct/>} ></Route>
                  
                </Routes>
              

              </div>
            </Router>
            </AuthContext.Provider>
      </div>
  );
}

export default App;
