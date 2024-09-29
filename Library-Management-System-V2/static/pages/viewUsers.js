import adminNavbar from "../components/adminNavbar.js";
import userDetailsModal from "../components/userDetailsModal.js";

const viewUsers = {
    template: `
    <div>
        <adminNavbar title="View Users"/>
        <div class="register-style table-responsive-sm" style="max-width: 70%; margin-top: 3%;">
            <div class='text-danger text-center' mt-4><b>{{msg}}</b></div>
            <div v-if="users">
                <div class="d-flex mb-3 flex-wrap">
                    <div class="ms-auto p-2">
                        <input class="form-control me-2 search-box bg-body-secondary" type="search" placeholder="Search" v-model="searchString">
                    </div>
                </div>

                <div style="max-height: 58vh; overflow-y: auto;">
                    <table class="table table-striped table-light table-hover align-middle">
                        <thead class="table-light">
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">id</th>
                                <th scope="col">UserName</th>
                                <th scope="col">email</th>
                                <th scope="col">View Details</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr class="text-center" v-for="(user, index) in users" v-if="isSearchStringPresent(user)">
                                <th scope="row">{{ index+1 }}</th>
                                <td>{{ user.id }}</td>
                                <td>{{ user.username }}</td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <button class="btn btn-success" @click="gotouserDetailsModal(user)">View</button> 
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <userDetailsModal :user="selectedUser" v-if="currUserID" @close="closeuserDetailsModal"/>
                </div>
            </div>
        </div>
    </div>
    `,



    components: {
        adminNavbar,
        userDetailsModal
    },



    data() {
        return {
            users: [],
            selectedUser: null,
            searchString: '',
            currUserID: null,
            msg: null
        }
    },



    methods: {
        selectUser(user) {
            this.selectedUser = user;
        },

        isSearchStringPresent(user){
            var username = user.username.toLowerCase();
            var email = user.email.toLowerCase();
            const subsequenceMatch = (string, sub) => {
                let subIndex = 0;
                for (let char of string) {
                    if (char === sub[subIndex]) {
                        subIndex++;
                    }
                    if (subIndex === sub.length) {
                        return true;
                    }
                }
                return false;
            };
    
            if (this.searchString.trim() == user.id) return true;
            if (subsequenceMatch(username, this.searchString.trim())) return true;
            if (subsequenceMatch(email, this.searchString.trim())) return true;
            return false;
        },

        gotouserDetailsModal(user){
            this.currUserID = user.id;
            this.selectedUser = user;
        },

        closeuserDetailsModal(){
            this.currUserID = null;
        }

    },



    async mounted() {
        var res = await fetch(window.location.origin + '/api/usersDetails', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        if (res.ok) {
            this.users = await res.json();
        }
    }

};



export default viewUsers;