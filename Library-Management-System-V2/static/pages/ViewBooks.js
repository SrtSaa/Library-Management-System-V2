import adminNavbar from "../components/adminNavbar.js";
import userNavbar from "../components/userNavbar.js";
import rateModal from "../components/rateModal.js";
import bookRequestModal from "../components/bookRequestModal.js";
import viewFeedbackModal from "../components/viewFeedbackModal.js";
import buyBookModal from "../components/buyBookModal.js";


const ViewBooks = {
    template: `
    <div>
        <adminNavbar title="View eBooks" v-if="role == 'admin'"/>
        <userNavbar title="View eBooks" v-else/>
        <div class="register-style table-responsive-sm" style="max-width: 70%; margin-top: 3%;">
            <div class="d-flex mb-3 flex-wrap">
                <div class="p-2">
                    <select class="form-select search-box" v-model="currSection">
                        <option value="-1" selected>All</option>
                        <option :value="section.id" v-for="section in sections">{{section.title}}</option>
                    </select>
                </div>
                <div class="ms-auto p-2">
                    <input class="form-control me-2 search-box bg-body-secondary" type="search" placeholder="Search" v-model="searchString">
                </div>
            </div>

            <div style="max-height: 58vh; overflow-y: auto;">
                <table class="table table-striped table-light table-hover align-middle">
                    <thead class="table-light">
                        <tr class="text-center">
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Section</th>
                            <th scope="col">Authors</th>
                            <th scope="col">View Details</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr class="text-center" v-for="(book, index) in books" v-if="(currSection == -1 || currSection == book.section_id) && isSearchStringPresent(book)">
                            <th scope="row">{{ index+1 }}</th>
                            <td>{{ book.title }}</td>
                            <td>{{ book.section }}</td>
                            <td>{{ book.authors_name }}</td>
                            <td>
                                <button type="button" class="btn btn-primary" @click="selectBook(book)" data-bs-toggle="modal" data-bs-target="#bookModal">View</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="modal fade" id="bookModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header" style="background-color: #50c76c;"> 
                                <h1 class="modal-title fs-3">Book Details</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center" style="background-color: #f7e9f7;" v-if="selectedBook">
                                <p class="fs-4"><strong class="font-color-1">Title:</strong><span class="h4"> {{ selectedBook.title }}</span></p>
                                <p><strong class="font-color-1 fs-5">Section:</strong><span class="h5"> {{ selectedBook.section }}</span></p>
                                <p><strong class="font-color-1 fs-5">Authors:</strong><span class="h5"> {{ selectedBook.authors_name }}</span></p>
                                <p><strong class="font-color-1 fs-5">Rating:</strong><span class="h5"> {{ selectedBook.rating }}</span></p>
                                <p><strong class="font-color-1">Description:</strong> {{ selectedBook.description }}</p>
                            </div>
                            <div class="modal-footer" v-if="role == 'user'">
                                <div id="requestbook" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                                
                                <button class="btn btn-danger" disabled v-if="selectedBook && purchasedBooks.includes(selectedBook.id)">Purchased</button>
                                <button class="btn btn-danger" data-bs-target="#confirmModal" data-bs-toggle="modal" v-else>Buy</button>
                                
                                <button class="btn btn-warning" @click="selectedBook && gotoNextModal(selectedBook.id, 'rate')">Rate</button> 
                                <button class="btn btn-info" @click="selectedBook && gotoNextModal(selectedBook.id, 'feedback')">View FeedBack</button>
                                
                                <button class="btn btn-success" v-if="selectedBook && !purchasedBooks.includes(selectedBook.id) && issuedBooks.includes(selectedBook.id)" disabled>Issued</button>
                                <button class="btn btn-success" v-if="selectedBook && !purchasedBooks.includes(selectedBook.id) && !issuedBooks.includes(selectedBook.id) && requestedBooks.includes(selectedBook.id)" disabled>Requested</button>
                                <button class="btn btn-success" v-if="selectedBook && !purchasedBooks.includes(selectedBook.id) && !issuedBooks.includes(selectedBook.id) && !requestedBooks.includes(selectedBook.id)" @click="request(selectedBook.id)">Request</button>
                            </div>
                            <div class="modal-footer" v-if="role == 'admin'">
                                <div class='text-danger text-center' mt-4><b>{{msg2}}</b></div>
                                <button class="btn btn-danger" data-bs-target="#deleteModal" data-bs-toggle="modal">Delete</button>
                                <button class="btn btn-info" @click="selectedBook && gotoNextModal(selectedBook.id, 'feedback')">View FeedBack</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="confirmModal" data-bs-backdrop="static" aria-hidden="true" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header" style="background-color: #50c76c;"><h1 class="modal-title fs-5">Confimation Message</h1></div>
                            <div class="modal-body" style="background-color: #f7e9f7;"><div class="h5">Are you sure to buy this book?</div></div>
                            <div class="modal-footer">
                                <button class="btn btn-danger" data-bs-target="#bookModal" data-bs-toggle="modal">No</button>
                                <button class="btn btn-success" @click="selectedBook && purchase(selectedBook.id)">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="deleteModal" data-bs-backdrop="static" aria-hidden="true" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header" style="background-color: #50c76c;"><h1 class="modal-title fs-5">Confimation Message</h1></div>
                            <div class="modal-body" style="background-color: #f7e9f7;"><div class="h5">Are you sure to delete this book?</div></div>
                            <div class="modal-footer">
                                <button class="btn btn-success" data-bs-target="#bookModal" data-bs-toggle="modal">No</button>
                                <button class="btn btn-danger" @click="selectedBook && deleteBook(selectedBook.id)">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <buyBookModal :bookID="currBookIDforPurchase" v-if="currBookIDforPurchase" @close1="backtoBookModal('purchase')" @close2="purchased"/>
                <rateModal :bookID="currBookIDforRate" v-if="currBookIDforRate" @close1="backtoBookModal('rate')" @close2="submitRate"/>
                <viewFeedbackModal :bookID="currBookIDforFeedback" v-if="currBookIDforFeedback" @close1="backtoBookModal('feedback')"/>
                <bookRequestModal :bookID="currBookIDforRequest" v-if="currBookIDforRequest" @close1="backtoBookModal('request')" @close2="submitRequest"/>
            </div>
        </div>
    </div>
    `,



    components: {
        adminNavbar,
        userNavbar,
        buyBookModal,
        rateModal,
        viewFeedbackModal,
        bookRequestModal
    },



    data() {
        return {
            books: [],
            sections: [],
            selectedBook: null,
            currSection: -1,
            searchString: '',
            role: localStorage.getItem('role'),
            requestedBooks: [],
            issuedBooks: [],
            purchasedBooks: [],
            currBookIDforPurchase: null,
            currBookIDforRate: null,
            currBookIDforFeedback: null,
            currBookIDforRequest: null,
            msg2: null
        }
    },



    methods: {
        selectBook(book) {
            clearErrors();
            this.selectedBook = book;
        },

        isSearchStringPresent(book){
            var title = book.title.toLowerCase();
            var authors = book.authors_name.toLowerCase();
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
    
            if (subsequenceMatch(title, this.searchString.trim())) return true;
            if (subsequenceMatch(authors, this.searchString.trim())) return true;
            return false;
        },


        async deleteBook(id){
            const res = await fetch(window.location.origin + `/api/eBook/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            });
            const data = await res.json();
            if (res.ok) {
                this.$router.go(0);
            }
            this.msg2 = "*" + data.message;
        },

        
        purchased(){
            this.$router.go(0);
        },

        submitRate(){
            this.currBookIDforRate = null;
            this.$router.go(0);
        },


        purchase(id){
            const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
            confirmModal.hide();
            this.currBookIDforPurchase = id;
        },


        request(id){
            if (this.requestedBooks.length == 5){
                seterror('requestbook', "You can only request for 5 books!");
            }
            else {
                const bookModal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
                bookModal.hide();
                this.currBookIDforRequest = id;
            }
        },

        submitRequest(data){
            this.currBookIDforRequest = null;
            this.requestedBooks.push(data.bookID);
            const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
            bookModal.show();
        },


        gotoNextModal(id, modalName){
            const bookModal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
            bookModal.hide();
            if (modalName == 'rate') this.currBookIDforRate = id;
            else if (modalName == 'feedback') this.currBookIDforFeedback = id;
        },

        backtoBookModal(modalName){
            if (modalName == 'purchase')    this.currBookIDforPurchase = null;
            else if (modalName == 'rate')    this.currBookIDforRate = null;
            else if (modalName == 'feedback')    this.currBookIDforFeedback = null;
            else if (modalName == 'request')    this.currBookIDforRequest = null;
            const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
            bookModal.show();
        }
    },



    async mounted() {
        // get all section
        var res = await fetch(window.location.origin + '/api/Section', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        if (res.ok) {
            this.sections = await res.json();
        }


        // get all books
        res = await fetch(window.location.origin + '/api/eBook', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        });
        if (res.ok) {
            this.books = await res.json();
        } 


        // if role is 'user'
        if (this.role == 'user'){
            // get all the requested book id of that particular user
            res = await fetch(window.location.origin + '/request-book', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    'type': 'get_data',
                    'username': localStorage.getItem('username')
                })
            }); 
            if (res.ok) {
                this.requestedBooks = await res.json();
            }

            // get all the issued book id of that particular user
            res = await fetch(window.location.origin + `/getIssuedBooksID/${localStorage.getItem('username')}`, {
                method: 'GET',
                headers: { 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
            }); 
            if (res.ok) {
                this.issuedBooks = await res.json();
            }


            // get all the purchased book id of that particular user
            res = await fetch(window.location.origin + `/getPurchasedBooksID/${localStorage.getItem('username')}`, {
                headers: { 
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
            }); 
            if (res.ok) {
                this.purchasedBooks = await res.json();
            }

        }

    }

};



export default ViewBooks;