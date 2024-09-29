import adminNavbar from "../components/adminNavbar.js";
import userDetailsModal from "../components/userDetailsModal.js";


const viewRequest = {
    template:`
    <div>
        <adminNavbar title="View Request"/>
        <div style="margin-top: 50px; margin-bottom: 5px;">
            <h1 class="h1 text-center">View Request</h1></br>
        </div>

        <div class="register-style table-responsive-sm" style="max-width: 70%;">
            <div class='text-danger text-center' my-4><b>{{msg}}</b></div>
            <div style="max-height: 58vh; overflow-y: auto;" v-if="requests.length>0">
                <table class="table table-striped table-light table-hover align-middle">
                    <thead class="table-light">
                        <tr class="text-center">
                            <th scope="col">#</th>
                            <th scope="col">eBook ID</th>
                            <th scope="col">User ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">Request Day</th>
                            <th scope="col">Required Day</th>
                            <th scope="col">View Details</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr class="text-center" v-for="(req, index) in requests">
                            <th scope="row">{{ index+1 }}</th>
                            <td><div style="text-decoration: none; cursor: pointer; color: blue;" @click="openBookDetails(req)" data-bs-toggle="modal" data-bs-target="#bookModal">{{ req.ebook_id }}</div></td>
                            <td><div style="text-decoration: none; cursor: pointer; color: blue;" @click="openUserDetails(req)">{{ req.user_id }}</div></td>
                            <td>{{ req.username }}</td>
                            <td>{{ req.request_date }}</td>
                            <td>{{ req.required_day }}</td>
                            <td>
                                <button type="button" :id="'a' + index" class="btn btn-success my-1" @click="accept(req, index)">Accept</button>
                                <button type="button" :id="'r' + index" class="btn btn-danger my-1" @click="reject(req, index)">Reject</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="modal fade" id="bookModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header" style="background-color: #50c76c;"> 
                                <h1 class="modal-title fs-3">Book Details</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeBookDetails"></button>
                            </div>
                            <div class="modal-body text-center" style="background-color: #f7e9f7;">
                                <div v-if="selectedBook">
                                    <p class="fs-4"><strong class="font-color-1">Title:</strong><span class="h4"> {{ selectedBook.title }}</span></p>
                                    <p><strong class="font-color-1 fs-5">Section:</strong><span class="h5"> {{ selectedBook.section }}</span></p>
                                    <p><strong class="font-color-1 fs-5">Authors:</strong><span class="h5"> {{ selectedBook.authors_name }}</span></p>
                                    <p><strong class="font-color-1 fs-5">Rating:</strong><span class="h5"> {{ selectedBook.rating }}</span></p>
                                    <p><strong class="font-color-1">Description:</strong> {{ selectedBook.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <userDetailsModal :user="selectedUser" v-if="currUserID" @close="closeuserDetailsModal"/>
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
            requests: [],
            selectedRequest: null,
            selectedBook: null,
            selectedUser: null,
            currUserID: null,
            msg: null
        }
    },

    methods: {
        selectRequest(req){
            this.selectedRequest = req;
        },

        closeBookDetails(){
            this.selectedBook = null;
        },

        async openBookDetails(req){
            
            var res = await fetch(window.location.origin + `/api/eBook/${req.ebook_id}`, {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            });
            const data = await res.json();
            if (res.ok) {
                this.selectedBook = data;
            } 
            else {
                this.msg = data.message;
            }
        },

        async openUserDetails(req){
            var res = await fetch(window.location.origin + `/api/usersDetails/${req.user_id}`, {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            });
            const data = await res.json();
            if (res.ok) {
                this.selectedUser = data;
                this.currUserID = this.selectedUser.id;
            } 
            else {
                this.msg = data.message;
            }
        },

        closeuserDetailsModal(){
            this.currUserID = null;
            this.selectedUser = null;
        },

        async accept(req, id) {
            var res = await fetch(window.location.origin + '/api/bookRequests', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    'action': 'accept',
                    'eb_id': req.ebook_id,
                    'u_id': req.user_id,
                    'day': req.required_day,
                })
            }); 
            const data = await res.json();
            if (res.ok) {
                document.getElementById('a'+id).disabled = true;
                document.getElementById('a'+id).textContent = 'Accepted';
                document.getElementById('r'+id).disabled = true;
            }
            else {
                this.msg = data.message;
            }
        },

        async reject(req, id) {
            var res = await fetch(window.location.origin + '/api/bookRequests', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    'action': 'reject',
                    'eb_id': req.ebook_id,
                    'u_id': req.user_id
                })
            }); 
            const data = await res.json();
            if (res.ok) {
                document.getElementById('r'+id).disabled = true;
                document.getElementById('r'+id).textContent = 'Rejected';
                document.getElementById('a'+id).disabled = true;
            }
            else {
                this.msg = data.message;
            }
        }

    },

    async mounted() {
        var res = await fetch('/api/bookRequests', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        var data = await res.json();
        if (res.ok) {
            this.requests = data;
        }
        else{
            this.msg = data.message;
        }
    }
    
};



export default viewRequest;