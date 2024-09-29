import userNavbar from "../components/userNavbar.js";


const userDashboard = {
    template: `
    <div>
        <userNavbar title="User Dashboard"/>
        <div class="m-5">
            <div class="dash-style">
                <div class="h4">Books Issued</div>
                <div style="overflow-y: auto;" v-if="issuedbooks && issuedbooks.length > 0">
                    <div class='text-danger text-center my-2'><b>{{msg}}</b></div>

                    <table class="table table-striped table-light table-hover align-middle">
                        <thead class="table-light">
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">ID</th>
                                <th scope="col">Title</th>
                                <th scope="col">Section</th>
                                <th scope="col">Authors</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr class="text-center" v-for="(book, index) in issuedbooks">
                                <th scope="row">{{ index+1 }}</th>
                                <td>{{ book.id }}</td>
                                <td>{{ book.title }}</td>
                                <td>{{ book.section }}</td>
                                <td>{{ book.authors }}</td>
                                <td>
                                    <button class="btn btn-success" type="button">View</button>
                                    <button class="btn btn-danger" type="button" @click="returnBook(book)">Return</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class='text-danger text-center my-4' v-else><b>No Book Issued</b></div>
            </div>
            <div class="dash-style">
                <div class="h4">Books Purchased</div>
                <div style="max-height: 50vh; overflow-y: auto;" v-if="purchasedbooks && purchasedbooks.length > 0">
                    <table class="table table-striped table-light table-hover align-middle">
                        <thead class="table-light">
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">ID</th>
                                <th scope="col">Title</th>
                                <th scope="col">Section</th>
                                <th scope="col">Authors</th>
                                <th scope="col">View</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            <tr class="text-center" v-for="(book, index) in purchasedbooks">
                                <th scope="row">{{ index+1 }}</th>
                                <td>{{ book.id }}</td>
                                <td>{{ book.title }}</td>
                                <td>{{ book.section }}</td>
                                <td>{{ book.authors }}</td>
                                <td>
                                    <button class="btn btn-success" type="button">View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class='text-danger text-center my-4' v-else><b>No Book Purchased</b></div>
            </div>
        </div>
    </div>
    `,

    components: {
        userNavbar
    },

    data() {
        return {
            msg: null,
            issuedbooks: null,
            purchasedbooks: null
        }
    },

    methods: {
        async returnBook(book){
            const res = await fetch(window.location.origin + '/returnBook', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    'username': localStorage.getItem('username'),
                    'book_id': book.id
                })
            });
            const data = await res.json();
            if (res.ok) {
                this.$router.go(0);
            }
            else{
                this.msg = "*" + data.message;
            }
        }
    },

    async mounted(){
        var res = await fetch(window.location.origin + `/getIssuedBooks/${localStorage.getItem('username')}`, {
            method: 'GET',
            headers: { 
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        }); 
        if (res.ok) {
            this.issuedbooks = await res.json();
        }

        res = await fetch(window.location.origin + `/getPurchasedBooks/${localStorage.getItem('username')}`, {
            headers: { 
                'Authentication-Token': localStorage.getItem('auth-token')
            },
        }); 
        if (res.ok) {
            this.purchasedbooks = await res.json();
        }
    }


};



export default userDashboard;