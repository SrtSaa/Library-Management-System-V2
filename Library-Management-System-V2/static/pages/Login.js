const Login = {
    template: `
    <div>
        <div style="margin-top: 100px">
            <h1 class="h1 text-center">Welcome To Online Library</h1></br>
        </div>
        
        <div class='d-flex justify-content-center'>
            <div class='register-style mb-3'>
                <h3 class="h3 text-center">Login</h3></br>

                <div class='text-danger text-center'><b>{{error}}</b></div>
                <label class="form-label"><strong>Username / Email</strong></label>
                <input type="text" class="form-control" id="fue" v-model="credential.emailoruname">
                <div id="usernameoremail"><b><span class="formerror text-danger"></span></b></div>

                <label class="form-label" style="margin-top: 20px"><strong>Password</strong></label>
                <input type="password" class="form-control" id="fpass" v-model="credential.password">
                <div id="pass"><b><span class="formerror text-danger"></span></b></div>

                <button class="d-grid col-5 mx-auto btn btn-primary" type="button" style="margin-top: 20px" @click='login'>Login</button>
                <router-link to="/register"><button class="d-grid col-5 mx-auto btn btn-primary" type="button" style="margin-top: 20px">Register</button></router-link>
                <div class="text-center text-danger mt-3" v-if='this.registered'><b>Registered Successfully!!!</b></div>
            </div> 
        </div>
            
    </div>
    `,

    data(){
        return {
            credential: {
                emailoruname: null,
                password: null
            },
            error: null,
            registered: false
        };
    },

    methods: {
        async login(){
            if (validateLoginDetails()){
                const res = await fetch(window.location.origin + '/LogIn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify(this.credential),
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('auth-token', data.token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('username', data.username);
                    if (data.role == 'admin')   this.$router.push({ path: '/admin_dashboard' });
                    if (data.role == 'user')   this.$router.push({ path: '/user_dashboard' });
                } else {
                    this.error = "*" + data.message;
                }
            }
        }
    },

    mounted(){
        localStorage.clear()
        if (sessionStorage.getItem('registered')){
            this.registered = true;
            sessionStorage.removeItem('registered');
        }
    }
};


export default Login;