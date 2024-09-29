const userDetailsModal = {
    template: `
    <div>
        <div class="modal modal-lg d-block" id="userdetailswindow" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #50c76c;">
                        <h1 class="modal-title fs-5">User Details</h1>
                    </div>
                    <div class="modal-body" style="background-color: #f7e9f7;">
                        <div>
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
                                <div class="col"><input type="text" disabled class="form-control" :value="user.email"></div>
                                <div class="col-2"><label class="col-form-label"><strong>Phone:</strong></label></div>
                                <div class="col"><input type="text" disabled class="form-control justify-content-center" :value="user.phone"></div>
                            </div>
                            <div class="row g-4 mb-3">
                                <div class="col-2"><label class="col-form-label"><strong>Date of Birth:</strong></label></div>
                                <div class="col"><input type="text" disabled class="form-control" :value="user.dob"></div>
                                <div class="col-2"><label class="col-form-label"><strong>Gender:</strong></label></div>
                                <div class="col"><input type="text" disabled class="form-control justify-content-center" :value="user.gender"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" type="button" @click='getIssuednPurchasedBooks'>Books Issued</button>
                        <button class="btn btn-danger" type="button" @click='closeModal'>Close</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal modal-lg" id="issuedBooks" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #50c76c;">
                        <h1 class="modal-title fs-5">Book Issued & Purchased</h1>
                    </div>
                    <div class="modal-body" style="background-color: #f7e9f7;">
                        <div class="mb-5">
                            <div class="h4">Books Issued</div>
                            <div style="max-height: 30vh; overflow-y: auto;" v-if="issuedbooks && issuedbooks.length > 0">
                                <table class="table table-striped table-light table-hover align-middle">
                                    <thead class="table-light">
                                        <tr class="text-center">
                                            <th scope="col">#</th>
                                            <th scope="col">ID</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Section</th>
                                            <th scope="col">Authors</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-group-divider">
                                        <tr class="text-center" v-for="(book, index) in issuedbooks">
                                            <th scope="row">{{ index+1 }}</th>
                                            <td>{{ book.id }}</td>
                                            <td>{{ book.title }}</td>
                                            <td>{{ book.section }}</td>
                                            <td>{{ book.authors }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class='text-danger text-center my-4' v-else><b>No Book Issued</b></div>
                        </div>
                        <div>
                            <div class="h4">Books Purchased</div>
                            <div style="max-height: 30vh; overflow-y: auto;" v-if="purchasedbooks && purchasedbooks.length > 0">
                                <table class="table table-striped table-light table-hover align-middle">
                                    <thead class="table-light">
                                        <tr class="text-center">
                                            <th scope="col">#</th>
                                            <th scope="col">ID</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Section</th>
                                            <th scope="col">Authors</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-group-divider">
                                        <tr class="text-center" v-for="(book, index) in purchasedbooks">
                                            <th scope="row">{{ index+1 }}</th>
                                            <td>{{ book.id }}</td>
                                            <td>{{ book.title }}</td>
                                            <td>{{ book.section }}</td>
                                            <td>{{ book.authors }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class='text-danger text-center my-4' v-else><b>No Book Purchased</b></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-danger" type="button" @click='openDetails'>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    props: {
        user: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            msg: null,
            issuedbooks: null,
            purchasedbooks: null
        }
    },

    methods: {
        closeModal() {
            this.$emit('close');
        },

        openDetails(){
            const issuedBooks = bootstrap.Modal.getInstance(document.getElementById('issuedBooks'));
            issuedBooks.hide();
        },

        async getIssuednPurchasedBooks(){
            const issuedBooksModal = new bootstrap.Modal(document.getElementById('issuedBooks'));
            issuedBooksModal.show();
            var res = await fetch(window.location.origin + `/getIssuedBooks/${this.user.username}`, {
                method: 'GET',
                headers: { 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
            }); 
            if (res.ok) {
                this.issuedbooks = await res.json();
            }

            res = await fetch(window.location.origin + `/getPurchasedBooks/${this.user.username}`, {
                headers: { 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
            }); 
            if (res.ok) {
                this.purchasedbooks = await res.json();
            }
        }
 
    },


   
    
}

export default userDetailsModal;
