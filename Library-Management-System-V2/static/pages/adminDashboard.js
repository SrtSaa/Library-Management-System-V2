import adminNavbar from "../components/adminNavbar.js";



const adminDashboard = {
    template: `
    <div>
        <adminNavbar title="Librarian Dashboard"/>
              
        <div class='d-flex justify-content-center' style="margin-top: 100px">
            <div class='register-style mb-3'>
                <h1 class="h1 text-center">Welcome Librarian!!!</h1></br>
                <h3 class="h3 text-center">Have a Good Day ^_^</h3></br>
            </div> 
        </div>
    </div>
    `,

    components: {
        adminNavbar
    }
}



export default adminDashboard;