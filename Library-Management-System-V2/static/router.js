import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import adminDashboard from "./pages/adminDashboard.js"
import userDashboard from "./pages/userDashboard.js"
import userProfile from "./pages/userProfile.js";
import AddSection from "./pages/AddSection.js";
import DeleteSection from "./pages/DeleteSection.js";
import AddeBook from "./pages/AddeBook.js";
import ViewBooks from "./pages/ViewBooks.js";
import viewRequest from "./pages/viewRequest.js";
import viewUsers from "./pages/viewUsers.js";
import viewIssuedBooks from "./pages/viewIssuedBooks.js";
import viewReturnedBooks from "./pages/viewReturnedBooks.js";
import viewRevokedBooks from "./pages/viewRevokedBooks.js";
import viewPurchasedBooks from "./pages/viewPurchasedBooks.js";
import viewChart from "./pages/viewChart.js";



const routes = [
    {path:'/', component: Login, name: 'Login'},
    {path:'/register', component: Register, name: 'Register'},
    {path:'/admin_dashboard', component: adminDashboard},
    {path:'/addSection', component: AddSection},
    {path:'/deleteSection', component: DeleteSection},
    {path:'/addeBook', component: AddeBook},
    {path:'/vieweBooks', component: ViewBooks},
    {path:'/viewRequest', component: viewRequest},
    {path:'/viewUsers', component: viewUsers},
    {path:'/viewIssuedBooks', component: viewIssuedBooks},
    {path:'/viewReturnedBooks', component: viewReturnedBooks},
    {path:'/viewRevokedBooks', component: viewRevokedBooks},
    {path:'/viewPurchasedBooks', component: viewPurchasedBooks},
    {path:'/viewChart', component: viewChart},
    {path:'/user_dashboard', component: userDashboard},
    {path:'/userProfile', component: userProfile}
];


const router = new VueRouter({
    routes, 
});


export default router;