import userNavbar from "../components/userNavbar.js";

const userProfile = {
    template: `
    <div>
        <userNavbar title="User Dashboard"/>
        <div style="margin-top: 50px">
            <h1 class="h1 text-center">Profile</h1></br>
        </div>

        <div class="dash-style" style="max-width: 800px;" v-if="user">
            <form action= "">
                <div v-if="change == 0 || change == 1">
                    <div class="row g-4 mb-3">
                        <div class="col-2"><label class="col-form-label"><strong>ID:</strong></label></div>
                        <div class="col"><input type="text" disabled class="form-control" :value="user.id"></div>
                        <div class="col-2"><label class="col-form-label"><strong>UserName:</strong></label></div>
                        <div class="col"><input type="text" disabled class="form-control" :value="user.username"></div>
                    </div>
                    <div class="row g-4 mb-3">
                        <div class="col-2"><label class="col-form-label"><strong>First Name:</strong></label></div>
                        <div class="col"><input type="text" disabled class="form-control" :value="user.first_name"></div>
                        <div class="col-2"><label class="col-form-label"><strong>Last Name:</strong></label></div>
                        <div class="col"><input type="text" disabled class="form-control justify-content-center" :value="user.last_name"></div>
                    </div>
                    <div class="row g-4 mb-3">
                        <div class="col-2"><label class="col-form-label"><strong>Email:</strong></label></div>
                        <div class="col" v-if="change==0"><input type="text" disabled class="form-control"  :value="user.email"></div>
                        <div class="col" v-if="change==1"><input id="femail" type="email" class="form-control" v-model="email" required></div>
                        <div class="col-2"><label class="col-form-label"><strong>Phone:</strong></label></div>
                        <div class="col" v-if="change==0"><input type="text" disabled class="form-control justify-content-center" :value="user.phone"></div>
                        <div class="col" v-if="change==1"><input id="fphone" type="tel" class="form-control justify-content-center" v-model="phone" required></div>
                    </div>
                    <div class="row g-4 mb-3">
                        <div class="col-2"><label class="col-form-label"><strong>Date of Birth:</strong></label></div>
                        <div class="col"><input type="text" disabled class="form-control" :value="user.dob"></div>
                        <div class="col-2"><label class="col-form-label"><strong>Gender:</strong></label></div>
                        <div class="col"><input type="text" disabled class="form-control justify-content-center" :value="user.gender"></div>
                    </div>
                </div>
                <div v-if="change == 2">
                    <div class="row g-4 mb-3 justify-content-center">
                        <div class="col-auto"><label class="col-form-label"><strong>Old Password:</strong></label></div>
                        <div class="col-auto"><input type="password" class="form-control" v-model="oldpw" required></div>
                    </div>
                    <div class="row g-4 mb-3 justify-content-center">
                        <div class="col-auto"><label class="col-form-label"><strong>New Password:</strong></label></div>
                        <div class="col-auto"><input type="password" class="form-control justify-content-center" v-model="newpw" required></div>
                    </div>
                    <div class="row g-4 mb-3 justify-content-center">
                        <div class="col-auto"><label class="col-form-label"><strong>Confirm Password:</strong></label></div>
                        <div class="col-auto"><input type="password" class="form-control justify-content-center" v-model="cnfpw" required></div>
                    </div>
                </div>
                <div class='d-flex justify-content-center text-danger'><strong>{{msg}}</strong></div>
                <div class="d-flex" style="margin: auto; max-width: 300px">
                    <button class="d-grid col-5 mx-auto btn btn-success" style="margin-top: 20px" @click='update1($event)' v-if="change==1">Update</button>
                    <button class="d-grid col-5 mx-auto btn btn-success" style="margin-top: 20px" @click='update2($event)' v-if="change==2">Update</button>
                    <button class="d-grid col-5 mx-auto btn btn-danger" style="margin-top: 20px" @click='normal' v-if="change!=0">Go Back</button>
                </div>
            </form>
            <div class="d-flex" style="margin: auto; max-width: 300px">
                <button class="d-grid col-5 mx-auto btn btn-primary" style="margin-top: 20px" @click='edit1' v-if="change==0">Update Profile</button>
                <button class="d-grid col-5 mx-auto btn btn-primary" style="margin-top: 20px" @click='edit2' v-if="change==0">Update Password</button>
            </div>
        </div>
    </div>
    `,

    components: {
        userNavbar
    },

    data(){
        return {
            user: null,
            oldpw: null,
            newpw: null,
            cnfpw: null,
            email: null,
            phone: null,
            change: false,
            msg: null
        };
    },


    methods: {
        edit1(){
            this.msg = null;
            this.change = 1;
        },
        edit2(){
            this.msg = null;
            this.change = 2;
        },
        normal(){
            this.msg = null;
            this.change = 0;
            this.oldpw = null;
            this.newpw = null;
            this.cnfpw = null;
            this.email = this.user.email;
            this.phone = this.user.phone;
        },

        checkEmail(){
            var email = document.getElementById("femail").value.trim();
            if (email.length == 0) {
                this.msg = "*Please enter email!";
                return false;
            }
            if (!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                this.msg = "*Please give valid email address!";
                return false;
            }
            if (email.length > 30) {
                this.msg = "*Email length is too long!";
                return false;
            }
            return true;
        },

        checkPhone(){
            var phone = document.getElementById("fphone").value;
            if (phone.length != 10){
                this.msg = "*Phone number should be 10 digit long!";
                return false
            }
            if (!phone.match(/^([1-9]{1})([0-9]{9})$/)) {
                this.msg = "*Phone number should be valid!";
                return false;
            }
            
            return true;
        },

        checkPassword() {
            if (this.oldpw.length == 0 || this.newpw.length == 0 || this.cnfpw.length == 0) {
                this.msg = "*Please enter password!";
                return false;
            } 
            if (this.oldpw.length < 0 || this.newpw.length < 0 || this.cnfpw.length < 0) {
                this.msg = "*Password should be atleast 6 characters long!";
                return false;
            }
            if (this.oldpw.length > 15 || this.newpw.length > 15 || this.cnfpw.length > 15) {
                this.msg = "*Password should be atmost 15 characters long!";
                return false;
            }
            if (!this.oldpw.match(/[a-z]/g) || !this.oldpw.match(/[A-Z]/g) || !this.oldpw.match(/[0-9]/g) || !this.oldpw.match(/[^a-zA-Z\d]/g)
             || !this.newpw.match(/[a-z]/g) || !this.newpw.match(/[A-Z]/g) || !this.newpw.match(/[0-9]/g) || !this.newpw.match(/[^a-zA-Z\d]/g)
             || !this.cnfpw.match(/[a-z]/g) || !this.cnfpw.match(/[A-Z]/g) || !this.cnfpw.match(/[0-9]/g) || !this.cnfpw.match(/[^a-zA-Z\d]/g)) {
                this.msg = "*Passsword must contain atleast 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character!";
                return false;
            }
            
            if (this.newpw == this.oldpw){
                this.msg = "*New Password and Old Password should not be same!";
                return false;
            }
            if (this.newpw != this.cnfpw){
                this.msg = "*New Password and Confirm Password should be same!";
                return false;
            }
        
            return true;
        },

        changedEmailPhone(){
            var email = document.getElementById("femail").value.trim();
            var phone = document.getElementById("fphone").value;
            if (phone === this.user.phone && email === this.user.email){
                this.msg = "*Give new Email or Phone number!";
                return false;
            }
            return true;
        },
        
        async update1(event){
            event.preventDefault();
            this.msg = null;
            if (this.checkEmail() && this.checkPhone() && this.changedEmailPhone()){
                
                const res = await fetch(window.location.origin + '/api/userDetailsUpdate', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify({
                        'username': this.user.username,
                        'email': this.email,
                        'phone': this.phone
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    sessionStorage.setItem('message', data.message);
                    this.$router.go(0);
                } else {
                    this.msg = "*" + data.message;
                }
            }
        },
        
        async update2(event){
            event.preventDefault();
            this.msg = null;
            if (this.checkPassword()){
                
                const res = await fetch(window.location.origin + '/api/userPasswordUpdate', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify({
                        'username': this.user.username,
                        'oldpw': this.oldpw,
                        'newpw': this.newpw,
                        'cnfpw': this.cnfpw
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    sessionStorage.setItem('message', data.message);
                    this.$router.go(0);
                } else {
                    this.msg = "*" + data.message;
                }
            }
        }
    },


    async mounted(){
        if (sessionStorage.getItem('message')){
            this.msg = sessionStorage.getItem('message');
            sessionStorage.removeItem('message');
        }
        var res = await fetch(window.location.origin + `/api/usersDetails/${localStorage.getItem('username')}`, {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        const data = await res.json();
        if (res.ok) {
            this.user = data;
            this.email = this.user.email;
            this.phone = this.user.phone;
        } 
        else {
            this.msg = data.message;
        }
    },

};



export default userProfile;