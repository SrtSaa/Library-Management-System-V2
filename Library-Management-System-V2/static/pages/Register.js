const Register = {
    template: `
    <div>
        <div style="margin-top: 50px">
            <h1 class="h1 text-center">Register</h1></br>
        </div>

        <div class="register-style">
            <form action= "">
                <div class="row g-2" style="width: auto; max-width: 400px; margin: auto;">
                        <div class="col-md form-floating mb-3">
                        <input type="text" class="form-control" id="ffname" placeholder="First Name" v-model="form_data.fname" required> 
                        <label>First Name</label>
                        <div id="fname"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                    <div class="col-md form-floating mb-3">
                        <input type="text" class="form-control" id="flname" placeholder="Last Name" v-model="form_data.lname">
                        <label>Last Name</label>
                        <div id="lname"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                </div>
                <div class="row g-2" style="width: auto; max-width: 400px; margin: auto;">
                    <div class="col-md form-floating mb-3">
                        <input type="text" class="form-control" id="funame" placeholder="Username" v-model="form_data.uname" required>
                        <label>Username</label>
                        <span class="form-text opacity-50">Must be 4-15 characters long and AlphaNumeric</span>
                        <div id="username"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                    <div class="col-md form-floating mb-3">
                        <input type="email" class="form-control" id="femail" placeholder="test@example.com" v-model="form_data.email" required>
                        <label>Email</label>
                        <div id="email"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                </div>
                <div class="row g-2" style="width: auto; max-width: 400px; margin: auto;">
                    <div class="col-md form-floating mb-3">
                        <input type="password" class="form-control" id="fpass" placeholder="Password" v-model="form_data.password" required>
                        <label>Password</label>
                        <span class="form-text opacity-50">Must be 6-15 characters long. Must contain 1 Uppercase, 1Lowercase, 1 Number, 1 Special Characters</span>
                        <div id="pass"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                </div>
                <div class="row g-2" style="width: auto; max-width: 400px; margin: auto;">
                    <div class="col-md form-floating mb-3">
                        <input type="password" class="form-control" id="fcpass" placeholder="Confirm Password" v-model="form_data.cpassword" required>
                        <label>Confirm Password</label>
                        <div id="cpass"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                </div>
                <div class="row g-2" style="width: auto; max-width: 400px; margin: auto;">
                    <div class="col-md form-floating mb-3">
                        <input type="tel" class="form-control" id="fphone" placeholder="Phone" v-model="form_data.phone" required>
                        <label>Phone</label>
                        <div id="phone"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                    <div class="col-md form-floating mb-3">
                        <input type="date" class="form-control" id="fdob" placeholder="Date of Birth" v-model="form_data.dob" required>
                        <label>Date of Birth</label>
                        <div id="dob"><b><span class="formerror text-danger"></span></b></div>
                    </div>
                </div>
                <div class="g-2" style="width: auto; max-width: 400px; margin: auto;">
                    <label class="col-sm-2 col-form-label"><strong>Gender:</strong></label>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="fgender1" value="M" v-model="form_data.gender" required>
                        <label class="form-check-label">Male</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="fgender2" value="F" v-model="form_data.gender">
                        <label class="form-check-label">Female</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" id="fgender3" value="O" v-model="form_data.gender">
                        <label class="form-check-label">Others</label>
                    </div>
                </div>
                <div class='d-flex justify-content-center text-danger'><strong>{{error}}</strong></div>
                <button class="d-grid col-5 mx-auto btn btn-primary" style="margin-top: 20px" @click='register'>Register</button>
            </form>
            <router-link to="/"><button class="d-grid col-5 mx-auto btn btn-primary" type="button" style="margin-top: 20px; margin-bottom: 20px;">Go Back</button></router-link>
        </div>
    </div>
    `,

    data(){
        return {
            form_data: {
                fname: null,
                lname: null,
                uname: null,
                email: null,
                password: null,
                cpassword: null,
                phone: null,
                dob: null,
                gender: null,
            },
            error: null,
            registered: false
        };
    },

    methods: {
        async register(){
            if (valildateRegisterDetails()){
                const res = await fetch(window.location.origin + '/user-register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify(this.form_data),
                });
                const data = await res.json();
                if (res.ok) {
                    sessionStorage.setItem('registered', true);
                    this.$router.push({ path: '/' });
                } else {
                    this.error = "*" + data.message;
                }
            }
        }
    }
        
};



export default Register;