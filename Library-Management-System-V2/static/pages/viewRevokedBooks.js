import adminNavbar from "../components/adminNavbar.js";
import userDetailsModal from "../components/userDetailsModal.js";

const viewRevokedBooks = {
    template: `
    <div>
        <adminNavbar title="Revoke List"/>
        <div class="register-style table-responsive-sm" style="max-width: 70%; margin-top: 3%;">
            <div class='text-danger text-center' mt-4><b>{{msg}}</b></div>
            <div v-if="records.length>0">
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
                                <th scope="col">eBook ID</th>
                                <th scope="col">eBook Title</th>
                                <th scope="col">UserName</th>
                                <th scope="col">Revoke Date</th>
                                <th scope="col">View Details</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr class="text-center" v-for="(record, index) in records" v-if="isSearchStringPresent(record)">
                                <th scope="row">{{ index+1 }}</th>
                                <td>{{ record.ebook_id }}</td>
                                <td>{{ record.title }}</td>
                                <td>{{ record.username }}</td>
                                <td>{{ record.revoke_date }}</td>
                                <td>
                                    <button class="btn btn-success my-1" @click="openBookDetails(record)" data-bs-toggle="modal" data-bs-target="#bookModal">eBook Details</button> 
                                    <button class="btn btn-success my-1" @click="openUserDetails(record)">User Details</button> 
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
    </div>
    `,


    components: {
        adminNavbar,
        userDetailsModal
    },

    data() {
        return {
            records: [],
            searchString: '',
            selectedBook: null,
            selectedUser: null,
            currUserID: null,
            msg: null
        }
    },

    methods: {

        isSearchStringPresent(record){
            var username = record.username.toLowerCase();
            var title = record.title.toLowerCase();
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
    
            if (this.searchString.trim() == record.ebook_id) return true;
            if (this.searchString.trim() == record.user_id) return true;
            if (subsequenceMatch(username, this.searchString.trim())) return true;
            if (subsequenceMatch(title, this.searchString.trim())) return true;
            return false;
        },

        async openBookDetails(record){
            var res = await fetch(window.location.origin + `/api/eBook/${record.ebook_id}`, {
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

        closeBookDetails(){
            this.selectedBook = null;
        },
        
        async openUserDetails(record){
            var res = await fetch(window.location.origin + `/api/usersDetails/${record.user_id}`, {
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
        }
    },

    async mounted() {
        var res = await fetch('/api/allRevokedBooks', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        var data = await res.json();
        if (res.ok) {
            this.records = data;
        }
        else{
            this.msg = data.message;
        }
    }
    
};






export default viewRevokedBooks;